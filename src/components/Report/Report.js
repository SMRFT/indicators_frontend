import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { wardOptions } from "../constant";
import Alert from "react-bootstrap/Alert";
import apiRequest from "../apiRequest"; // Import the API helper
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
import { Calendar, Pencil, Save, Trash2, Download } from "lucide-react";
import { getTransposedData, exportToExcel } from "./reportUtils";
import "./Report.css";

function Report() {
  const [selectedWard, setSelectedWard] = useState("First Floor"); // Default value set to "First Floor"
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Default value set to current month and year
  const [exportData, setExportData] = useState([]);
  const [isViewClicked, setIsViewClicked] = useState(true); // Set to true by default
  const [isEditing, setIsEditing] = useState(false); // Track if the table is in edit mode
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedValues, setEditedValues] = useState({}); // Store edited values separately
  const [fieldMapping, setFieldMapping] = useState({}); // Store mapping between display fields and original keys
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  useEffect(() => {
    fetchExportData();
  }, [selectedWard, selectedDate, selectedMonth]);

  // Create mapping between display field names and original database field names
  useEffect(() => {
    if (exportData.length > 0) {
      const mapping = {};
      const excludedFields = ["created_by", "created_date", "lastmodified_by", "lastmodified_date", "selectedDate", "ward"];

    Object.keys(exportData[0]).forEach((key) => {
      if (excludedFields.includes(key)) return; // Strictly skip metadata
      let displayKey = key;
        // Convert to formatted display key
        if (key.endsWith("Insurance")) {
          displayKey = key.replace(/Insurance$/, "").trim() + " ( Insurance )";
        } else if (key.endsWith("Pay")) {
          displayKey = key.replace(/Pay$/, "").trim() + " ( Pay )";
        }

        displayKey = displayKey
          .split(/(?=[A-Z])/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        mapping[displayKey] = key;
      });

      setFieldMapping(mapping);
    }
  }, [exportData]);

const fetchExportData = async () => {
  try {
    let apiUrl = `${IndicatorBaseUrl}get-export-data/?ward=${selectedWard}`;

    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
      const isoDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000).toISOString();
      apiUrl += `&date=${isoDate}`;
    } else if (selectedMonth) {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      apiUrl += `&year=${year}&month=${month}`;
    }

    const response = await apiRequest(apiUrl);
    console.log("Fetched export data:", response);

    // Try to get data array from possible keys
    const data = Array.isArray(response)
      ? response
      : response?.data || response?.results || [];

    if (Array.isArray(data) && data.length > 0) {
      const sortedData = [...data].sort(
        (a, b) => new Date(a.selectedDate) - new Date(b.selectedDate)
      );

      setExportData(sortedData);
      setEditedValues({});
    } else {
      setExportData([]);

      console.error("No valid data array found:", response);
    }
  } catch (error) {
    setExportData([]);
    console.error("Error fetching data:", error);
  }
};



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleDownloadButtonClick = () => {
    if (exportData.length === 0) {
      console.error("No data available to download.");
      return;
    }

    const transposedData = getTransposedData(exportData);

    const headers = [
      "Indicators",
      ...exportData.map((item) => formatDate(item.selectedDate)),
      "Total",
    ];

    const worksheetData = Object.entries(transposedData).map(
      ([field, values]) => {
        const total = values.reduce(
          (sum, value) => sum + (parseFloat(value) || 0),
          0
        );
        return [field, ...values, total];
      }
    );

    exportToExcel(headers, worksheetData, "Indicator_Report.xlsx");
  };

  const handleEditClick = () => {
    setIsEditing(true);

    // Initialize editedValues with the current data
    const initialEdits = {};
    exportData.forEach((item, index) => {
      initialEdits[index] = { ...item };
    });
    setEditedValues(initialEdits);
  };

  const handleSaveClick = () => {
    // Apply all edits to the exportData
    const updatedData = exportData
      .map((item, index) => {
        if (editedValues[index]) {
          return { ...item, ...editedValues[index] };
        }
        return item;
      })
      .map((item) => ({
        ...item,
        selectedDate: new Date(item.selectedDate).toISOString(),
      }));

    apiRequest(`${IndicatorBaseUrl}update-export-data/`, "PUT", updatedData)
      .then((response) => {
        if (response.success) {
          fetchExportData();
          setIsEditing(false);
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 5000);
        } else {
          console.error("Error updating data:", response.error);
          setShowErrorAlert(true);
          setTimeout(() => setShowErrorAlert(false), 5000);
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 5000);
      });
  };

  const handleSelect = (ward) => setSelectedWard(ward);

  const handleDelete = async () => {
    if (!selectedDate || !selectedWard) {
      alert("Please select a date and ward to delete.");
      return;
    }

    try {
      const response = await apiRequest(
        `${IndicatorBaseUrl}delete_data/?date=${selectedDate}&ward=${selectedWard}`,
        "DELETE"
      );

      if (response.success) {
        alert("Data deleted successfully!");
        fetchExportData();
      } else {
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete data.");
    }
  };

// Get the display value for a field and column
const getDisplayValue = (displayField, colIndex) => {
  const dbField = fieldMapping[displayField];
  if (!dbField) return "Nil";

  // 1. Get the raw value from data
  const rawValue = exportData[colIndex][dbField];

  // 2. Handle Edited Values (Ensure we return a string for inputs)
  if (isEditing && editedValues[colIndex] && dbField in editedValues[colIndex]) {
    const val = editedValues[colIndex][dbField];
    // CRITICAL: If the value is an object, stringify it so the input doesn't crash
    return typeof val === 'object' ? JSON.stringify(val) : (val ?? "");
  }

  if (rawValue === null || rawValue === undefined || rawValue.toString().toLowerCase() === "nil") {
    return "Nil";
  }

  // 3. Special handling for Transfusion Remarks
  if (dbField === "numberOfUnitsTransfusedRemarks") {
    try {
      // If it's already an object, use it; if string, parse it
      const parsedRemarks = typeof rawValue === 'object' ? rawValue : JSON.parse(rawValue.replace(/'/g, '"'));

      const transfusedKeys = Object.keys(parsedRemarks).filter(k => k.startsWith('transfused-') && !k.includes('remarks'));

      if (transfusedKeys.length > 0) {
        return (
          <div>
            {transfusedKeys.map((transfusedKey, idx) => {
              const index = transfusedKey.split('-')[1];
              const remarks = parsedRemarks[`remarks-${index}`] || parsedRemarks[`transfused-remarks-${index}`] || "";
              return <div key={idx}>{parseInt(index) + 1} - remarks: {remarks}</div>;
            })}
          </div>
        );
      }
      // If it's an object but doesn't match the keys, stringify it to avoid the error
      return typeof parsedRemarks === 'object' ? JSON.stringify(parsedRemarks) : String(parsedRemarks);
    } catch (error) {
      return String(rawValue);
    }
  }

  // 4. Final safety check: if rawValue is an object, stringify it
  if (typeof rawValue === 'object') {
    return JSON.stringify(rawValue);
  }

  return rawValue;
};
  // Handle input change for a field
  const handleInputChange = (displayField, colIndex, value) => {
    // Get the original database field name from our mapping
    const dbField = fieldMapping[displayField];

    if (!dbField) {
      console.error("No mapping found for display field:", displayField);
      return;
    }

    // Update the edited value
    setEditedValues((prev) => ({
      ...prev,
      [colIndex]: {
        ...(prev[colIndex] || {}),
        [dbField]: value,
      },
    }));
  };

  const isAdmin = localStorage.getItem("userRole") === "Admin";

  return (
    <div className="report-page">
      <h1 className="report-title">{selectedWard} Report</h1>

      <div className="report-actions">
        {isAdmin && (
          <button
            className="report-action-btn"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            title={isEditing ? "Save" : "Edit"}
          >
            {isEditing ? <Save size={16} /> : <Pencil size={16} />}
          </button>
        )}
        {isAdmin && (
          <button
            className="report-action-btn danger"
            onClick={() => setShowDeleteModal(true)}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
        <button
          className="report-action-btn accent"
          onClick={handleDownloadButtonClick}
          title="Download"
        >
          <Download size={16} />
        </button>
      </div>

      <div className="report-toolbar">
        <div className="report-field">
          <label className="report-field-label">Ward</label>
          <Dropdown onSelect={handleSelect}>
            <Dropdown.Toggle className="report-dropdown-toggle" id="dropdown-basic">
              <span>{selectedWard || "Select Ward"}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="report-dropdown-menu">
              {wardOptions.map((ward, index) => (
                <Dropdown.Item key={index} eventKey={ward}>
                  {ward}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="report-field">
          <label className="report-field-label">Date</label>
          <div className="report-date-input">
            <Calendar size={16} />
            <DatePicker
              id="datePicker"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a Date"
              className="form-control"
            />
          </div>
        </div>

        <div className="report-field">
          <label className="report-field-label">Month &amp; Year</label>
          <div className="report-date-input">
            <Calendar size={16} />
            <DatePicker
              id="monthYearPicker"
              selected={selectedMonth}
              onChange={(date) => setSelectedMonth(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="Select Month and Year"
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Keep the delete modal outside but it will only be triggered by admins */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Date to Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Select a date:</label>
          <div style={{ position: "relative", zIndex: 9999 }}>
            <select
              className="form-control"
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Select Date</option>
              {exportData.map((item, index) => (
                <option key={index} value={item.selectedDate}>
                  {formatDate(item.selectedDate)}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {showSuccessAlert && (
        <Alert variant="success" className="text-center mt-3">
          Successfully updated.
        </Alert>
      )}
      {showErrorAlert && (
        <Alert variant="danger" className="text-center mt-3">
          Failed to update. Please try again.
        </Alert>
      )}

      {isViewClicked && exportData && exportData.length > 0 ? (
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Indicators</th>
                {exportData.map((item, index) => (
                  <th key={index}>{formatDate(item.selectedDate)}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(getTransposedData(exportData)).map(
                ([field, values], rowIndex, rowArray) => {
                  const totalRows = rowArray.length;

                  // Calculate row total for numeric fields
                  const rowTotal =
                    rowIndex >= 2 && rowIndex < totalRows - 1
                      ? values.reduce(
                          (sum, val) => sum + (parseFloat(val) || 0),
                          0
                        )
                      : "";

                  return (
                    <tr key={rowIndex}>
                      <td>{field}</td>
                      {values.map((_, colIndex) => {
                        const displayValue = getDisplayValue(field, colIndex);

                        // Special handling for numberOfUnitsTransfusedRemarks
                        const isTransfusedRemarks =
                          field === "Number Of Units Transfused Remarks";

                        return (
                          <td key={colIndex}>
                            {isEditing ? (
                              isTransfusedRemarks ? (
                                <textarea
                                  value={displayValue}
                                  onChange={(e) =>
                                    handleInputChange(
                                      field,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                  style={{ minHeight: "60px" }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={displayValue}
                                  onChange={(e) =>
                                    handleInputChange(
                                      field,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              )
                            ) : (
                              displayValue
                            )}
                          </td>
                        );
                      })}
                      <td>{rowTotal !== "" ? Math.round(rowTotal) : ""}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="report-empty-state">No data available</div>
      )}
    </div>
  );
}

export default Report;

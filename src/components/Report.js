import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { wardOptions } from "./constant";
import * as XLSX from "xlsx";
import Alert from "react-bootstrap/Alert";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal

function getTransposedData(dataArray) {
  const transposedData = {};

  dataArray.forEach((data) => {
    Object.keys(data).forEach((key) => {
      let formattedKey;
      if (key.endsWith("Insurance")) {
        formattedKey = key.replace(/Insurance$/, "").trim() + " ( Insurance )";
      } else if (key.endsWith("Pay")) {
        formattedKey = key.replace(/Pay$/, "").trim() + " ( Pay )";
      } else {
        formattedKey = key;
      }

      formattedKey = formattedKey
        .split(/(?=[A-Z])/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      if (!transposedData[formattedKey]) {
        transposedData[formattedKey] = [];
      }

      let formattedValue;
      if (key === "numberOfUnitsTransfusedRemarks") {
        let transfusedRemarks = {};
        try {
          transfusedRemarks = JSON.parse(data[key]?.replace(/'/g, '"') || "{}");
        } catch (error) {
          console.error("Error parsing transfusion remarks:", error);
        }

        formattedValue =
          Object.keys(transfusedRemarks)
            .map((transKey) => {
              if (
                transKey.startsWith("transfused-") &&
                !transKey.includes("remarks")
              ) {
                let index = parseInt(transKey.split("-")[1]) + 1;
                let remarksKey = `remarks-${index - 1}`;
                let remarks = transfusedRemarks[remarksKey] || "";
                return `${index} - ${remarks}`;
              }
              return null;
            })
            .filter((item) => item !== null)
            .join(",\n") || "";
      } else {
        formattedValue =
          typeof data[key] === "string"
            ? data[key]
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : String(data[key]).charAt(0).toUpperCase() +
              String(data[key]).slice(1);
      }

      transposedData[formattedKey].push(formattedValue);
    });
  });

  return transposedData;
}

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

  useEffect(() => {
    fetchExportData();
  }, [selectedWard, selectedDate, selectedMonth]);

  // Create mapping between display field names and original database field names
  useEffect(() => {
    if (exportData.length > 0) {
      const mapping = {};

      Object.keys(exportData[0]).forEach((key) => {
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

  const fetchExportData = () => {
    let apiUrl = `https://indicators.shinovadatabase.in/get-export-data/?ward=${selectedWard}`;
    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
      const isoDate = new Date(
        selectedDate.getTime() + 24 * 60 * 60 * 1000
      ).toISOString();
      apiUrl += `&date=${isoDate}`;
    } else if (selectedMonth) {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      apiUrl += `&year=${year}&month=${month}`;
    }
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExportData(data);
          setEditedValues({}); // Reset edited values when new data is fetched
        } else {
          console.error("Error fetching data:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
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

    // Ensure 'Total' is included in the headers
    const headers = [
      "Indicators",
      ...exportData.map((item) => formatDate(item.selectedDate)),
      "Total",
    ];

    // Extract total values (Ensure each item in exportData has a 'total' field)
    const worksheetData = Object.entries(transposedData).map(
      ([field, values]) => {
        const total = values.reduce(
          (sum, value) => sum + (parseFloat(value) || 0),
          0
        );
        return [field, ...values, total];
      }
    );

    const excelData = [headers, ...worksheetData];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "ExportData");
    XLSX.writeFile(wb, "Indicator_Report.xlsx");
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

    fetch("https://indicators.shinovadatabase.in/update-export-data/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchExportData();
          setIsEditing(false);
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 5000);
        } else {
          console.error("Error updating data:", data);
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
      const response = await fetch(
        `https://indicators.shinovadatabase.in/delete_data/?date=${selectedDate}&ward=${selectedWard}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Data deleted successfully!");
        setShowDeleteModal(false);
        setExportData(
          exportData.filter((item) => item.selectedDate !== selectedDate)
        );
      } else {
        alert("Error deleting data.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete data.");
    }
  };

  // Get the display value for a field and column
  const getDisplayValue = (displayField, colIndex) => {
    // Get the original database field name from our mapping
    const dbField = fieldMapping[displayField];

    if (!dbField) {
      console.error("No mapping found for display field:", displayField);
      return "Nil";
    }

    // First check for edited values
    if (
      isEditing &&
      editedValues[colIndex] &&
      dbField in editedValues[colIndex]
    ) {
      return editedValues[colIndex][dbField];
    }

    // Otherwise return the original value
    const value = exportData[colIndex][dbField];
    return value === null ||
      value === undefined ||
      value.toString().toLowerCase() === "nil"
      ? "Nil"
      : value;
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

  return (
    <Container style={{ marginLeft: "230px" }}>
      <h1 className="text-center mt-4">{selectedWard} Report</h1>
      <br />
      <Row className="mb-4" style={{ marginLeft: "10px" }}>
        <Col xs={12} md={4}>
          <Dropdown
            id="wardSelect"
            onSelect={handleSelect}
            className="custom-dropdown"
          >
            <Dropdown.Toggle
              id="dropdown-basic"
              style={{
                minWidth: "200px",
                backgroundColor: "white",
                color: "black",
                border: "1px solid #DEE2E6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{selectedWard || "Select Ward"}</span>
              <span className="caret"></span>
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                minWidth: "200px",
                textAlign: "center",
                maxHeight: "250px",
                overflowY: "auto",
                scrollbarWidth: "thin",
              }}
            >
              {wardOptions.map((ward, index) => (
                <Dropdown.Item key={index} eventKey={ward}>
                  {ward}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={12} md={4}>
          <div className="input-group">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => document.getElementById("datePicker").click()}
            >
              <i
                style={{
                  fontSize: "130%",
                  color: "rgb(149,188,176)",
                  marginRight: "10px",
                  marginTop: "5px",
                }}
                className="fa fa-calendar"
              ></i>
            </div>
            <div
              style={{
                position: "relative",
                zIndex: showDeleteModal ? 1 : 9999,
              }}
            >
              <DatePicker
                id="datePicker"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select a Date"
                className="form-control"
                style={{ display: "inline-block", width: "calc(100% - 40px)" }}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="input-group">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => document.getElementById("monthYearPicker").click()}
            >
              <i
                style={{
                  fontSize: "130%",
                  color: "rgb(149,188,176)",
                  marginRight: "10px",
                  marginTop: "5px",
                }}
                className="fa fa-calendar"
              ></i>
            </div>
            <div
              style={{
                position: "relative",
                zIndex: showDeleteModal ? 1 : 9999,
              }}
            >
              <DatePicker
                id="monthYearPicker"
                selected={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="Select Month and Year"
                className="form-control"
                style={{ display: "inline-block", width: "calc(100% - 40px)" }}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          md={12}
          className="text-right"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <i
            className={`fa ${isEditing ? "fa-save" : "fa-edit"}`}
            onClick={isEditing ? handleSaveClick : handleEditClick}
            style={{
              fontSize: "150%",
              color: "rgb(149,188,176)",
              cursor: "pointer",
              marginRight: "15px",
            }}
            title={isEditing ? "Save" : "Edit"}
          ></i>
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
          >
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
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
          <i
            style={{
              fontSize: "150%",
              color: "rgb(149,188,176)",
              cursor: "pointer",
              marginRight: "20px",
            }}
            title="Delete"
            className="fa fa-trash"
            onClick={() => setShowDeleteModal(true)}
          ></i>
          <i
            style={{
              fontSize: "150%",
              color: "rgb(149,188,176)",
              cursor: "pointer",
              marginRight: "30px",
            }}
            title="Download"
            className="fa fa-download"
            onClick={handleDownloadButtonClick}
          ></i>
        </Col>
      </Row>
      {showSuccessAlert && (
        <Alert
          variant="success"
          className="text-center mt-3"
          style={{ width: "50%", margin: "auto" }}
        >
          Successfully updated.
        </Alert>
      )}
      {showErrorAlert && (
        <Alert
          variant="danger"
          className="text-center mt-3"
          style={{ width: "50%", margin: "auto" }}
        >
          Failed to update. Please try again.
        </Alert>
      )}
      <Container className="mt-2">
        {isViewClicked && exportData && exportData.length > 0 ? (
          <div
            className="table-responsive"
            style={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "400px",
              maxWidth: "100%",
              position: "relative",
              border: "1px solid #ddd",
            }}
          >
            <table
              className="table table-bordered"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                borderCollapse: "collapse",
                minWidth: "600px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "rgb(149,188,176)",
                      color: "white",
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                    }}
                  >
                    Indicators
                  </th>
                  {exportData.map((item, index) => (
                    <th
                      key={index}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        backgroundColor: "rgb(149,188,176)",
                        color: "white",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      {formatDate(item.selectedDate)}
                    </th>
                  ))}
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "rgb(149,188,176)",
                      color: "white",
                      position: "sticky",
                      top: 0,
                      right: 0,
                      zIndex: 2,
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(getTransposedData(exportData)).map(
                  ([field, values], rowIndex, rowArray) => {
                    const totalRows = rowArray.length;

                    // Calculate row total for numeric fields
                    const rowTotal =
                      rowIndex >= 3 && rowIndex < totalRows - 1
                        ? values.reduce(
                            (sum, val) => sum + (parseFloat(val) || 0),
                            0
                          )
                        : "";

                    return (
                      <tr
                        key={rowIndex}
                        style={{
                          backgroundColor:
                            rowIndex % 2 === 0 ? "grey" : "whitesmoke",
                        }}
                      >
                        <td
                          style={{
                            padding: "8px",
                            textAlign: "left",
                            position: "sticky",
                            left: 0,
                            color: "black",
                            zIndex: 1,
                          }}
                        >
                          {field}
                        </td>
                        {values.map((_, colIndex) => {
                          const displayValue = getDisplayValue(field, colIndex);

                          // Special handling for numberOfUnitsTransfusedRemarks
                          const isTransfusedRemarks =
                            field === "Number Of Units Transfused Remarks";

                          return (
                            <td key={colIndex} style={{ padding: "8px" }}>
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
                                    style={{ width: "100%", minHeight: "60px" }}
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
                                    style={{ width: "100%" }}
                                  />
                                )
                              ) : (
                                displayValue
                              )}
                            </td>
                          );
                        })}
                        <td
                          style={{
                            padding: "8px",
                            fontWeight: "bold",
                            backgroundColor: "lightblue",
                            position: "sticky",
                            right: 0,
                          }}
                        >
                          {rowTotal !== "" ? Math.round(rowTotal) : ""}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <center>
            <div style={{ marginTop: "100px" }}>
              <b>No data available</b>
            </div>
          </center>
        )}
      </Container>
    </Container>
  );
}

export default Report;

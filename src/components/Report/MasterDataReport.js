import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RawDataOptions } from "../constant";
import Alert from "react-bootstrap/Alert";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
import { getTransposedData, exportToExcel } from "./reportUtils";
import apiRequest from "../apiRequest";
import { Pencil, Save, Trash2, Download, Calendar } from "lucide-react";
import "./Report.css";

function MasterDataReport() {
  const [selectedWard, setSelectedWard] = useState("First Floor Raw Data");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [exportData, setExportData] = useState([]);
  const [isViewClicked, setIsViewClicked] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [userRole, setUserRole] = useState("");
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  useEffect(() => {
    fetchExportData();
  }, [selectedWard, selectedDate, selectedMonth]);

const fetchExportData = async () => {
  let apiUrl = `${IndicatorBaseUrl}get_export_rawdata/?ward=${selectedWard}`;

  if (
    selectedDate &&
    selectedDate instanceof Date &&
    !isNaN(selectedDate.getTime())
  ) {
    const isoDate = new Date(
      selectedDate.getTime() + 24 * 60 * 60 * 1000
    ).toISOString();
    apiUrl += `&date=${isoDate}`;
  } else if (selectedMonth) {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1;
    apiUrl += `&year=${year}&month=${month}`;
  }

  try {
    const response = await apiRequest(apiUrl);
    if (response.success) {
      const data = response.data;
      if (Array.isArray(data)) {
        const sortedData = data.sort(
          (a, b) => new Date(a.selectedDate) - new Date(b.selectedDate)
        );
        setExportData(sortedData);
      }
    } else {
      console.error("Error fetching data:", response.error);
    }
  } catch (error) {
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

    const transposedData = getTransposedData(exportData, true);

    // Create headers: 'Indicators' + corresponding date
    const headers = ["Indicators", formatDate(exportData[0].selectedDate)];

    // Convert transposed data into an array format
    const worksheetData = Object.entries(transposedData).map(
      ([indicator, values]) => [
        indicator,
        values[0] || "", // Single value per indicator for the selected date
      ]
    );

    exportToExcel(headers, worksheetData, "Indicator_masterReport.xlsx");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const updatedData = exportData.map((item) => ({
      ...item,
      selectedDate: new Date(item.selectedDate).toISOString(),
      _id: item._id ? { $oid: item._id } : undefined,
    }));

    apiRequest(`${IndicatorBaseUrl}update-export_rawdata/`, "PUT", updatedData)
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

  const handleDelete = async () => {
    if (!selectedDate || !selectedWard) {
      alert("Please select a date and ward to delete.");
      return;
    }

    try {
      const response = await apiRequest(
        `${IndicatorBaseUrl}delete_export_rawdata/?date=${selectedDate}&ward=${selectedWard}`,
        "DELETE"
      );

      if (response.success) {
        alert("Data deleted successfully!");
        setShowDeleteModal(false);
        setExportData(
          exportData.filter((item) => item.selectedDate !== selectedDate)
        );
      } else {
        alert("Failed to delete data: " + (response.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete data.");
    }
  };

  const handleChange = (colIndex, field, idx, subField, value) => {
    const updatedData = [...exportData];
    if (idx !== null && subField) {
      // If modifying a nested field inside an array
      updatedData[colIndex][field][idx][subField] = value;
    } else {
      // If modifying a normal field
      updatedData[colIndex][field] = value;
    }
    setExportData(updatedData);
  };

  const handleSelect = (ward) => setSelectedWard(ward);

  return (
    <div className="report-page">
      <h1 className="report-title">{selectedWard} Report</h1>

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
                  {item.selectedDate}
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

      <div className="report-actions">
        {userRole === "Admin" && (
          <button
            className="report-action-btn"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            title={isEditing ? "Save" : "Edit"}
          >
            {isEditing ? <Save size={16} /> : <Pencil size={16} />}
          </button>
        )}
        {userRole === "Admin" && (
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
          <Dropdown id="wardSelect" onSelect={handleSelect}>
            <Dropdown.Toggle className="report-dropdown-toggle" id="dropdown-basic">
              <span>{selectedWard || "Select Ward"}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="report-dropdown-menu">
              {RawDataOptions.map((ward, index) => (
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
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Select Date"
            />
          </div>
        </div>

        <div className="report-field">
          <label className="report-field-label">Month</label>
          <div className="report-date-input">
            <Calendar size={16} />
            <DatePicker
              id="monthPicker"
              selected={selectedMonth}
              onChange={(date) => setSelectedMonth(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="form-control"
              placeholderText="Select Month"
            />
          </div>
        </div>
      </div>
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
      <Row>
        <Col xs={12} className="mt-2">
          {exportData.length > 0 ? (
            <div className="report-table-wrap">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>
                      Field
                    </th>

                    {exportData.map((item, index) => (
                      <th key={index}>
                        {formatDate(item.selectedDate)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  
  {Object.keys(exportData[0]).map((field, index) => {
    const excludedFields = [ 
      "_id", 
      "created_by", 
      "created_date", 
      "lastmodified_by", // Note: Make sure this spelling matches your database exactly
      "lastmodified_date"
    ];

    if (!excludedFields.includes(field)) {
                      return (
                        <tr key={index}>
                          <td>{field}</td>
                          {exportData.map((item, colIndex) => (
                            <td key={colIndex}>
                              {Array.isArray(item[field]) ? (
                                item[field].map((obj, idx) => (
                                  <div key={idx}>
                                    <p>
                                      Patient Name:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.patientName}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "patientName",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.patientName
                                      )}
                                    </p>
                                    <p>
                                      Age:{" "}
                                      {isEditing ? (
                                        <input
                                          type="number"
                                          value={obj.age}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "age",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.age
                                      )}
                                    </p>
                                    <p>
                                      UHID No:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.uhidNo}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "uhidNo",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.uhidNo
                                      )}
                                    </p>
                                    <p>
                                      Patient Time to be Ward Time Entered In
                                      Ward Transfer Sheet By Dmo:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.wardTransferSheet}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "wardTransferSheet",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.wardTransferSheet
                                      )}
                                    </p>
                                    <p>
                                      Assessment Completed Time By Dmo:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.timeByDmo}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "timeByDmo",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.timeByDmo
                                      )}
                                    </p>
                                    <p>
                                      Time Hr/ Mts By Dmo:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.timeHrsmts}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "timeHrsmts",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.timeHrsmts
                                      )}
                                    </p>
                                    <p>
                                      Care Plan Documented By Dmo Yes / No:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.carePlanPlanDoc}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "carePlanPlanDoc",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.carePlanPlanDoc
                                      )}
                                    </p>
                                    <p>
                                      Nutrition Assessment Completed By Dmo Yes
                                      / No:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.nutritionAssessment}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "nutritionAssessment",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.nutritionAssessment
                                      )}
                                    </p>
                                    <p>
                                      Name of the Doctor Who Perform Initial
                                      Assessment:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.initialAssessment}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "initialAssessment",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.initialAssessment
                                      )}
                                    </p>
                                    <p>
                                      Patient Time to Entered With Transfer
                                      Sheet By Dmo:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.transferSheet}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "transferSheet",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.transferSheet
                                      )}
                                    </p>
                                    <p>
                                      Assessment Completed Time By Nurse:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.assessmentCompletedTimeBy}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "assessmentCompletedTimeBy",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.assessmentCompletedTimeBy
                                      )}
                                    </p>
                                    <p>
                                      Nursing Care Plan Documented Yes / No:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.nursingCarePlan}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "nursingCarePlan",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.nursingCarePlan
                                      )}
                                    </p>
                                    <p>
                                      Name Of The Primary Consultant:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.primaryConsultant}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "primaryConsultant",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.primaryConsultant
                                      )}
                                    </p>
                                    <p>
                                      Name Of The Staff Sign - Id No:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.staffSign}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "staffSign",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.staffSign
                                      )}
                                    </p>
                                    <p>
                                      Incharge Staff Name - Id No:{" "}
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={obj.inchargeStaffName}
                                          onChange={(e) =>
                                            handleChange(
                                              colIndex,
                                              field,
                                              idx,
                                              "inchargeStaffName",
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        obj.inchargeStaffName
                                      )}
                                    </p>
                                  </div>
                                ))
                              ) : isEditing ? (
                                <input
                                  type="text"
                                  value={item[field]}
                                  onChange={(e) =>
                                    handleChange(
                                      colIndex,
                                      field,
                                      null,
                                      null,
                                      e.target.value
                                    )
                                  }
                                />
                              ) : (
                                <div>{item[field]}</div>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    }
                    return null;
                  })}
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
        </Col>
      </Row>
    </div>
  );
}

export default MasterDataReport;

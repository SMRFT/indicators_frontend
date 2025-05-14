import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RawDataOptions } from "../constant";
import * as XLSX from "xlsx";
import Alert from "react-bootstrap/Alert";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal

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

  const fetchExportData = () => {
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
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort data based on date
          const sortedData = data.sort(
            (a, b) => new Date(a.selectedDate) - new Date(b.selectedDate)
          );
          setExportData(sortedData);
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

    // Initialize transposed structure
    const transposedData = {};

    exportData.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key !== "selectedDate") {
          if (!transposedData[key]) transposedData[key] = [];

          if (key === "raw_data" && Array.isArray(value)) {
            value.forEach((entry) => {
              Object.entries(entry).forEach(([subKey, subValue]) => {
                if (!transposedData[subKey]) transposedData[subKey] = [];
                transposedData[subKey].push(subValue);
              });
            });
          } else {
            transposedData[key].push(value);
          }
        }
      });
    });

    // Create headers: 'Indicators' + corresponding date
    const headers = ["Indicators", formatDate(exportData[0].selectedDate)];

    // Convert transposed data into an array format
    const worksheetData = Object.entries(transposedData).map(
      ([indicator, values]) => [
        indicator,
        values[0] || "", // Single value per indicator for the selected date
      ]
    );

    // Combine headers and data
    const excelData = [headers, ...worksheetData];

    // Create and export the Excel file
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "ExportData");
    XLSX.writeFile(wb, "Indicator_masterReport.xlsx");
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

    fetch(`${IndicatorBaseUrl}update-export_rawdata/`, {
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

  const handleDelete = async () => {
    if (!selectedDate || !selectedWard) {
      alert("Please select a date and ward to delete.");
      return;
    }

    try {
      const response = await fetch(
        `${IndicatorBaseUrl}delete_export_rawdata/?date=${selectedDate}&ward=${selectedWard}`,
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
              {RawDataOptions.map((ward, index) => (
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
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Select Date"
              />
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="input-group">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => document.getElementById("monthPicker").click()}
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
          {/* Edit Button (Admin Only) */}
          {userRole === "Admin" && (
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
          )}

          {/* Delete Button (Admin Only) */}
          {userRole === "Admin" && (
            <>
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
                          {item.selectedDate}{" "}
                          {/* Assuming formatDate is applied elsewhere */}
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
            </>
          )}

          {/* Download Button (Visible to Everyone) */}
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
      <Row>
        <Col xs={12} className="mt-2">
          {exportData.length > 0 ? (
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
                      Field
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
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(exportData[0]).map((field, index) => {
                    if (
                      field !== "selectedDate" &&
                      field !== "ward" &&
                      field !== "_id"
                    ) {
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
    </Container>
  );
}

export default MasterDataReport;

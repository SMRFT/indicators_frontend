import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Row, Col, Modal, Button, Container, Form } from "react-bootstrap";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const IncidentReportReport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [investigations, setInvestigations] = useState([]);
  const tableRef = useRef(null);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");
    setFromDate(thirtyDaysAgo);
    setToDate(today);
  }, []);

  useEffect(() => {
    let incUrl = `${IndicatorBaseUrl}IncidentReport/`;
    let invUrl = `${IndicatorBaseUrl}SupervisorInvestigation/`;
    const params = [];
    if (fromDate) params.push(`startDate=${fromDate}`);
    if (toDate) params.push(`endDate=${toDate}`);
    if (params.length > 0) {
      incUrl += `?${params.join("&")}`;
      invUrl += `?${params.join("&")}`;
    }

    Promise.all([
      fetch(incUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token"),
        },
      }),
      fetch(invUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token"),
        },
      })
    ])
      .then(async ([incRes, invRes]) => {
        if (!incRes.ok || !invRes.ok) throw new Error("Failed to fetch data");
        const incData = await incRes.json();
        const invData = await invRes.json();
        setData(incData);
        setFilteredData(incData);
        setInvestigations(invData);
      })
      .catch((err) => setError(err.message));
  }, [IndicatorBaseUrl, fromDate, toDate]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = data.filter((item) => {
        const incNo = String(item.incidentNo || "").toLowerCase();
        const loc = String(item.incidentLocation || "").toLowerCase();
        const desc = String(item.descriptionOfIncident || "").toLowerCase();
        const reportedBy = String(item.reportedBy || "").toLowerCase();
        const patientName = String(item.patientName || "").toLowerCase();
        const employeeName = String(item.employeeName || "").toLowerCase();
        
        return (
          incNo.includes(lower) ||
          loc.includes(lower) ||
          desc.includes(lower) ||
          reportedBy.includes(lower) ||
          patientName.includes(lower) ||
          employeeName.includes(lower)
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const formatClassifications = (classMap) => {
    if (!classMap) return "";
    let parsed = classMap;
    if (typeof classMap === "string") {
      try {
        parsed = JSON.parse(classMap);
      } catch (e) {
        return classMap;
      }
    }
    return Object.entries(parsed)
      .filter(([_, items]) => Array.isArray(items) && items.length > 0)
      .map(([category, items]) => `${category}: ${items.join(", ")}`)
      .join(" | ");
  };

  const handlePrint = () => {
    const printContent = tableRef.current;
    const WindowPrt = window.open("", "", "width=900,height=650");
    WindowPrt.document.write(`
      <html>
        <head>
          <title>Incident Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial; font-size: 14px; }
            th, td { border: 1px solid #999; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center">Incident Report</h2>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  };

  const handleDownloadButtonClick = () => {
    const flattenedData = filteredData.map((item) => ({
      "Incident No": item.incidentNo,
      "Date": item.incidentDate,
      "Time": item.incidentTime,
      "Location": item.incidentLocation,
      "Person Involved Type": item.personInvolvedType,
      "Others Details": item.personInvolvedOthersDetails,
      "Patient Name": item.patientName,
      "Employee Name": item.employeeName,
      "MR No": item.mrNo,
      "Designation": item.designation,
      "ID No": item.idNo,
      "Classifications": formatClassifications(item.classifications),
      "Description": item.descriptionOfIncident,
      "Reported By": item.reportedBy,
      "Reported By Designation": item.reportedByDesignation,
      "Date & Time Reported": item.reportedByDateTime,
      "Witness Name": item.witnessName,
      "Immediate Correction": item.immediateCorrection,
      "Actioned By": item.correctionName,
      "Actioned By Designation": item.correctionDesignation,
      "Date & Time Actioned": item.correctionDateTime,
    }));

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incident Reports");
    XLSX.writeFile(workbook, "Incident_Reports_Report.xlsx");
  };

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/IncidentDashboard")}
          className="me-3"
          style={{
            background: "#6c757d",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            width: "auto",
            height: "auto",
          }}
        >
          ← Back
        </Button>
        <h2 className="text-center m-0 flex-grow-1" style={{ fontSize: "24px", fontWeight: "bold" }}>
          Incident Report
        </h2>
        <div style={{ width: "90px" }}></div>
      </div>

      {/* Search and Date Pickers */}
      <Row className="mb-4 align-items-end" style={{ marginLeft: "0px", marginRight: "0px" }}>
        <Col xs={12} md={4}>
          <Form.Group controlId="searchBar">
            <Form.Label style={{ fontWeight: "600" }}>Search Incident Reports</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by ID, Location, Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group controlId="fromDate">
            <Form.Label style={{ fontWeight: "600" }} className="d-block">From Date</Form.Label>
            <DatePicker
              value={fromDate ? dayjs(fromDate) : null}
              onChange={(date) => setFromDate(date ? date.format("YYYY-MM-DD") : "")}
              format="YYYY-MM-DD"
              className="form-control w-100"
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group controlId="toDate">
            <Form.Label style={{ fontWeight: "600" }} className="d-block">To Date</Form.Label>
            <DatePicker
              value={toDate ? dayjs(toDate) : null}
              onChange={(date) => setToDate(date ? date.format("YYYY-MM-DD") : "")}
              format="YYYY-MM-DD"
              className="form-control w-100"
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={2} className="text-end d-flex justify-content-end gap-2 align-items-center" style={{ marginTop: "15px" }}>
          <i
            className="fa fa-print"
            title="Print"
            onClick={handlePrint}
            style={{
              fontSize: "150%",
              color: "rgb(149,188,176)",
              cursor: "pointer",
              marginRight: "15px",
            }}
          />
          <i
            className="fa fa-file-excel-o"
            title="Download Excel"
            onClick={handleDownloadButtonClick}
            style={{
              fontSize: "150%",
              color: "rgb(149,188,176)",
              cursor: "pointer",
            }}
          />
        </Col>
      </Row>

      {error && <p className="text-danger">{error}</p>}

      {/* Table */}
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto" ref={tableRef}>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th className="border px-2 py-1">Incident No</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Time</th>
                <th className="border px-2 py-1">Location</th>
                <th className="border px-2 py-1">Involved Person</th>
                <th className="border px-2 py-1">Classifications</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Reported By</th>
                <th className="border px-2 py-1">Date & Time Reported</th>
                <th className="border px-2 py-1">Immediate Correction</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr 
                  key={idx}
                  onClick={() => {
                    setSelectedReport(item);
                    setShowModal(true);
                  }}
                  style={{ cursor: "pointer" }}
                  title="Click to view full details"
                >
                  <td className="border px-2 py-1">{item.incidentNo || "-"}</td>
                  <td className="border px-2 py-1">{item.incidentDate}</td>
                  <td className="border px-2 py-1">{item.incidentTime}</td>
                  <td className="border px-2 py-1">{item.incidentLocation}</td>
                  <td className="border px-2 py-1">
                    {item.personInvolvedType}
                    {item.patientName ? ` (Patient: ${item.patientName})` : item.employeeName ? ` (Employee: ${item.employeeName})` : ""}
                  </td>
                  <td className="border px-2 py-1" style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={formatClassifications(item.classifications)}>
                    {formatClassifications(item.classifications)}
                  </td>
                  <td className="border px-2 py-1" style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.descriptionOfIncident}>
                    {item.descriptionOfIncident}
                  </td>
                  <td className="border px-2 py-1">{item.reportedBy} ({item.reportedByDesignation || "-"})</td>
                  <td className="border px-2 py-1">{dayjs(item.reportedByDateTime).format("DD/MM/YYYY hh:mm A")}</td>
                  <td className="border px-2 py-1" style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.immediateCorrection}>
                    {item.immediateCorrection || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted mt-4">
          No data available for selected dates.
        </p>
      )}

      {/* Detailed View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1e293b", color: "#fff" }}>
          <Modal.Title>Incident Report Details - {selectedReport?.incidentNo}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8fafc" }}>
          {selectedReport && (
            <div>
              <h5 className="border-bottom pb-2 mb-3 text-primary">General Information</h5>
              <Row className="mb-3">
                <Col md={4}><strong>Incident No:</strong><br />{selectedReport.incidentNo}</Col>
                <Col md={4}><strong>Date & Time:</strong><br />{selectedReport.incidentDate} at {selectedReport.incidentTime}</Col>
                <Col md={4}><strong>Location:</strong><br />{selectedReport.incidentLocation}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}><strong>Witness Name:</strong><br />{selectedReport.witnessName || "-"}</Col>
                <Col md={8}><strong>Person Involved:</strong><br />{selectedReport.personInvolvedType}</Col>
              </Row>

              <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Involved Person Details</h5>
              {selectedReport.personInvolvedType === "Patient" && (
                <Row className="mb-3">
                  <Col md={3}><strong>Patient Name:</strong><br />{selectedReport.patientName || "-"}</Col>
                  <Col md={3}><strong>Age / Sex:</strong><br />{selectedReport.patientAgeSex || "-"}</Col>
                  <Col md={3}><strong>UHID:</strong><br />{selectedReport.patientUhid || "-"}</Col>
                  <Col md={3}><strong>Doctor Incharge:</strong><br />{selectedReport.patientDoctor || "-"}</Col>
                </Row>
              )}
              {selectedReport.personInvolvedType === "Employee" && (
                <Row className="mb-3">
                  <Col md={3}><strong>Employee Name:</strong><br />{selectedReport.employeeName || "-"}</Col>
                  <Col md={3}><strong>Age / Sex:</strong><br />{selectedReport.employeeAgeSex || "-"}</Col>
                  <Col md={3}><strong>Designation:</strong><br />{selectedReport.designation || "-"}</Col>
                  <Col md={3}><strong>ID No / Dept:</strong><br />{selectedReport.idNo || "-"} ({selectedReport.employeeDept || "-"})</Col>
                </Row>
              )}
              {selectedReport.personInvolvedType === "Instrument/Tools" && (
                <Row className="mb-3">
                  <Col md={12}><strong>Instrument/Tools Details:</strong><br />{selectedReport.instrumentToolsDetails || "-"}</Col>
                </Row>
              )}
              {selectedReport.personInvolvedType === "Others" && (
                <Row className="mb-3">
                  <Col md={12}><strong>Specify Details:</strong><br />{selectedReport.personInvolvedOthersDetails || "-"}</Col>
                </Row>
              )}

              <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Classifications</h5>
              <div className="bg-white p-3 border rounded mb-3">
                {selectedReport.classifications ? (
                  (() => {
                    let parsed = selectedReport.classifications;
                    if (typeof parsed === "string") {
                      try { parsed = JSON.parse(parsed); } catch(e) { parsed = {}; }
                    }
                    const entries = Object.entries(parsed).filter(([_, items]) => Array.isArray(items) && items.length > 0);
                    if (entries.length === 0) return <span>No classifications selected.</span>;
                    return entries.map(([category, items]) => (
                      <div key={category} className="mb-2">
                        <strong>{category}:</strong> <span className="text-muted">{items.join(", ")}</span>
                      </div>
                    ));
                  })()
                ) : (
                  <span>None</span>
                )}
              </div>

              <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Description of Incident</h5>
              <p className="bg-white p-3 border rounded text-muted">{selectedReport.descriptionOfIncident || "No description provided."}</p>

              <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Immediate Correction Details</h5>
              <p className="bg-white p-3 border rounded text-muted">{selectedReport.immediateCorrection || "No immediate correction documented."}</p>
              <Row className="mb-3">
                <Col md={4}><strong>Actioned By:</strong><br />{selectedReport.correctionName || "-"}</Col>
                <Col md={4}><strong>Designation (ID):</strong><br />{selectedReport.correctionDesignation || "-"} ({selectedReport.correctionEmpId || "-"})</Col>
                <Col md={4}><strong>Date & Time:</strong><br />{selectedReport.correctionDateTime ? dayjs(selectedReport.correctionDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
              </Row>

              <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Reported By Details</h5>
              <Row className="mb-3">
                <Col md={4}><strong>Reporter Name:</strong><br />{selectedReport.reportedBy || "-"}</Col>
                <Col md={4}><strong>Designation (ID):</strong><br />{selectedReport.reportedByDesignation || "-"} ({selectedReport.reportedByEmpId || "-"})</Col>
                <Col md={4}><strong>Date & Time:</strong><br />{selectedReport.reportedByDateTime ? dayjs(selectedReport.reportedByDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
              </Row>

              {/* Supervisor's Investigation & RCA Details */}
              {(() => {
                const matchedInv = investigations.find(inv => 
                  String(inv.incidentId) === String(selectedReport.incidentNo)
                );
                if (!matchedInv) return null;
                
                // Check if quality details exist
                const hasQuality = !!(matchedInv.qualityReceivedBy || matchedInv.qualityVerifiedByHead || matchedInv.qualityRemarks || (matchedInv.qualityClassification && matchedInv.qualityClassification !== "No harm"));

                return (
                  <>
                    <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Supervisor's Investigation & RCA</h5>
                    <Row className="mb-3">
                      <Col md={4}><strong>Investigator (In-Charge) Name:</strong><br />{matchedInv.investigationName || "-"}</Col>
                      <Col md={4}><strong>Employee ID:</strong><br />{matchedInv.investigationSignatureEmpId || "-"}</Col>
                      <Col md={4}><strong>Dept / Designation:</strong><br />{matchedInv.investigationDeptDesignation || "-"}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={12}><strong>Date & Time Investigated:</strong><br />{matchedInv.investigationDateTime ? dayjs(matchedInv.investigationDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                    </Row>

                    <div className="mb-3">
                      <strong>Root Cause Analysis (RCA):</strong>
                      <p className="bg-white p-3 border rounded text-muted mt-1">{matchedInv.why1 || "No RCA description provided."}</p>
                    </div>

                    {matchedInv.rcaImage && (
                      <div className="mb-4">
                        <strong>RCA Diagram:</strong>
                        <div className="mt-2 text-center" style={{ maxWidth: "100%", maxHeight: "400px", overflow: "hidden", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#fff" }}>
                          <img src={matchedInv.rcaImage} alt="RCA Diagram" style={{ maxWidth: "100%", maxHeight: "398px", objectFit: "contain" }} />
                        </div>
                      </div>
                    )}

                    <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Supervisor Corrective & Preventive Actions</h5>
                    <Row className="mb-3">
                      <Col md={6}>
                        <strong>Corrective Action Taken:</strong>
                        <p className="bg-white p-2 border rounded text-muted mt-1" style={{ minHeight: "60px" }}>{matchedInv.correctiveAction || "-"}</p>
                        <span className="text-muted small">By: {matchedInv.correctiveName || "-"} ({matchedInv.correctiveSignatureEmpId || "-"})</span>
                      </Col>
                      <Col md={6}>
                        <strong>Preventive Action Plan:</strong>
                        <p className="bg-white p-2 border rounded text-muted mt-1" style={{ minHeight: "60px" }}>{matchedInv.preventiveAction || "-"}</p>
                        <span className="text-muted small">By: {matchedInv.preventiveName || "-"} ({matchedInv.preventiveSignatureEmpId || "-"})</span>
                      </Col>
                    </Row>

                    {hasQuality && (
                      <>
                        <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Quality Department Review</h5>
                        <Row className="mb-3">
                          <Col md={3}><strong>Received By:</strong><br />{matchedInv.qualityReceivedBy || "-"}</Col>
                          <Col md={3}><strong>Employee ID:</strong><br />{matchedInv.qualityReceivedSignatureEmpId || "-"}</Col>
                          <Col md={3}><strong>Dept & Designation:</strong><br />{matchedInv.qualityReceivedDeptDesignation || "-"}</Col>
                          <Col md={3}><strong>Received Date & Time:</strong><br />{matchedInv.qualityReceivedDateTime ? dayjs(matchedInv.qualityReceivedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col md={6}><strong>Quality Classification:</strong><br /><span className="badge bg-info text-white px-2 py-1">{matchedInv.qualityClassification || "-"}</span></Col>
                          <Col md={6}><strong>Verified By (Quality Head):</strong><br />{matchedInv.qualityVerifiedByHead || "-"}</Col>
                        </Row>
                        <div className="mb-3">
                          <strong>Quality Remarks:</strong>
                          <p className="bg-white p-3 border rounded text-muted mt-1">{matchedInv.qualityRemarks || "-"}</p>
                        </div>
                        <Row className="mb-3">
                          <Col md={12}><strong>Verification Date & Time:</strong><br />{matchedInv.qualityVerifiedDateTime ? dayjs(matchedInv.qualityVerifiedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                        </Row>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IncidentReportReport;

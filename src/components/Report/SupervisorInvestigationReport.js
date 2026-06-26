import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Row, Col, Modal, Button, Badge, Container, Form } from "react-bootstrap";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const SupervisorInvestigationReport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInv, setSelectedInv] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const tableRef = useRef(null);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");
    setFromDate(thirtyDaysAgo);
    setToDate(today);
  }, []);

  useEffect(() => {
    let invUrl = `${IndicatorBaseUrl}SupervisorInvestigation/`;
    let incUrl = `${IndicatorBaseUrl}IncidentReport/`;
    const params = [];
    if (fromDate) params.push(`startDate=${fromDate}`);
    if (toDate) params.push(`endDate=${toDate}`);
    if (params.length > 0) {
      invUrl += `?${params.join("&")}`;
      incUrl += `?${params.join("&")}`;
    }

    Promise.all([
      fetch(invUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token"),
        },
      }),
      fetch(incUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token"),
        },
      })
    ])
      .then(async ([invRes, incRes]) => {
        if (!invRes.ok || !incRes.ok) throw new Error("Failed to fetch data");
        const invData = await invRes.json();
        const incData = await incRes.json();
        setData(invData);
        setFilteredData(invData);
        setIncidents(incData);
      })
      .catch((err) => setError(err.message));
  }, [IndicatorBaseUrl, fromDate, toDate]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = data.filter((item) => {
        const invId = String(item.id || "").toLowerCase();
        const incId = String(item.incidentNo || item.incidentId || "").toLowerCase();
        const rca = String(item.why1 || "").toLowerCase();
        const invName = String(item.investigationName || "").toLowerCase();
        const classification = String(item.qualityClassification || "").toLowerCase();
        const verifiedBy = String(item.qualityVerifiedByHead || "").toLowerCase();
        
        return (
          invId.includes(lower) ||
          incId.includes(lower) ||
          rca.includes(lower) ||
          invName.includes(lower) ||
          classification.includes(lower) ||
          verifiedBy.includes(lower)
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const handlePrint = () => {
    const printContent = tableRef.current;
    const WindowPrt = window.open("", "", "width=900,height=650");
    WindowPrt.document.write(`
      <html>
        <head>
          <title>Supervisor Investigation & RCA Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial; font-size: 14px; }
            th, td { border: 1px solid #999; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center">Supervisor Investigation & Root Cause Analysis Report</h2>
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
      "Investigation ID": item.id,
      "Incident ID": item.incidentNo || item.incidentId,
      "Root Cause Analysis (RCA)": item.why1,
      "Date & Time Investigated": item.investigationDateTime,
      "Corrective Action": item.correctiveAction,
      "Preventive Action": item.preventiveAction,
      "Quality Classification": item.qualityClassification,
      "Quality Remarks": item.qualityRemarks,
      "Quality Verified By": item.qualityVerifiedByHead,
      "Verification Date": item.qualityVerifiedDateTime,
    }));

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Investigations");
    XLSX.writeFile(workbook, "Supervisor_Investigations_Report.xlsx");
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
          Supervisor's Investigation & RCA Report
        </h2>
        <div style={{ width: "90px" }}></div>
      </div>

      {/* Search and Date Pickers */}
      <Row className="mb-4 align-items-end" style={{ marginLeft: "0px", marginRight: "0px" }}>
        <Col xs={12} md={4}>
          <Form.Group controlId="searchBar">
            <Form.Label style={{ fontWeight: "600" }}>Search Investigations</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by ID, Incident No, RCA..."
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
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Incident ID</th>
                <th className="border px-2 py-1">Investigation Date</th>
                <th className="border px-2 py-1">Root Cause Analysis (RCA)</th>
                <th className="border px-2 py-1">Corrective Action</th>
                <th className="border px-2 py-1">Preventive Action</th>
                <th className="border px-2 py-1">Classification</th>
                <th className="border px-2 py-1">Verified By</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr 
                  key={idx}
                  onClick={() => {
                    setSelectedInv(item);
                    setShowModal(true);
                  }}
                  style={{ cursor: "pointer" }}
                  title="Click to view full details"
                >
                  <td className="border px-2 py-1">{item.id}</td>
                  <td className="border px-2 py-1">{item.incidentNo || item.incidentId}</td>
                  <td className="border px-2 py-1">
                    {item.investigationDateTime ? dayjs(item.investigationDateTime).format("DD/MM/YYYY hh:mm A") : "-"}
                  </td>
                  <td className="border px-2 py-1" style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.why1}>
                    {item.why1 || "-"}
                  </td>
                  <td className="border px-2 py-1" style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.correctiveAction}>
                    {item.correctiveAction}
                  </td>
                  <td className="border px-2 py-1" style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.preventiveAction}>
                    {item.preventiveAction}
                  </td>
                  <td className="border px-2 py-1">{item.qualityClassification}</td>
                  <td className="border px-2 py-1">{item.qualityVerifiedByHead || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted mt-4">
          No data available for selected dates or search criteria.
        </p>
      )}

      {/* Detailed Investigation View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1e293b", color: "#fff" }}>
          <Modal.Title>Investigation & RCA Details - ID: {selectedInv?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8fafc" }}>
          {selectedInv && (
            (() => {
              const matchedInc = incidents.find(inc => 
                String(inc.incidentNo || inc.id) === String(selectedInv.incidentNo || selectedInv.incidentId)
              );
              
              return (
                <div>
                  {/* General Incident Info */}
                  <h5 className="border-bottom pb-2 mb-3 text-primary">General Incident Information</h5>
                  {matchedInc ? (
                    <>
                      <Row className="mb-3">
                        <Col md={4}><strong>Incident No:</strong><br />{matchedInc.incidentNo || "-"}</Col>
                        <Col md={4}><strong>Date & Time:</strong><br />{matchedInc.incidentDate} at {matchedInc.incidentTime}</Col>
                        <Col md={4}><strong>Location:</strong><br />{matchedInc.incidentLocation}</Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}><strong>Witness Name:</strong><br />{matchedInc.witnessName || "-"}</Col>
                        <Col md={8}><strong>Person Involved:</strong><br />{matchedInc.personInvolvedType}</Col>
                      </Row>

                      <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Involved Person Details</h5>
                      {matchedInc.personInvolvedType === "Patient" && (
                        <Row className="mb-3">
                          <Col md={3}><strong>Patient Name:</strong><br />{matchedInc.patientName || "-"}</Col>
                          <Col md={3}><strong>Age / Sex:</strong><br />{matchedInc.patientAgeSex || "-"}</Col>
                          <Col md={3}><strong>UHID:</strong><br />{matchedInc.patientUhid || "-"}</Col>
                          <Col md={3}><strong>Doctor Incharge:</strong><br />{matchedInc.patientDoctor || "-"}</Col>
                        </Row>
                      )}
                      {matchedInc.personInvolvedType === "Employee" && (
                        <Row className="mb-3">
                          <Col md={3}><strong>Employee Name:</strong><br />{matchedInc.employeeName || "-"}</Col>
                          <Col md={3}><strong>Age / Sex:</strong><br />{matchedInc.employeeAgeSex || "-"}</Col>
                          <Col md={3}><strong>Designation:</strong><br />{matchedInc.designation || "-"}</Col>
                          <Col md={3}><strong>ID No / Dept:</strong><br />{matchedInc.idNo || "-"} ({matchedInc.employeeDept || "-"})</Col>
                        </Row>
                      )}
                      {matchedInc.personInvolvedType === "Instrument/Tools" && (
                        <Row className="mb-3">
                          <Col md={12}><strong>Instrument/Tools Details:</strong><br />{matchedInc.instrumentToolsDetails || "-"}</Col>
                        </Row>
                      )}
                      {matchedInc.personInvolvedType === "Others" && (
                        <Row className="mb-3">
                          <Col md={12}><strong>Specify Details:</strong><br />{matchedInc.personInvolvedOthersDetails || "-"}</Col>
                        </Row>
                      )}

                      <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Classifications</h5>
                      <div className="bg-white p-3 border rounded mb-3">
                        {matchedInc.classifications ? (
                          (() => {
                            let parsed = matchedInc.classifications;
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
                          <span>None selected.</span>
                        )}
                      </div>

                      <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Description of Incident</h5>
                      <p className="bg-white p-3 border rounded text-muted">{matchedInc.descriptionOfIncident || "No description provided."}</p>

                      <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Immediate Correction Details</h5>
                      <p className="bg-white p-3 border rounded text-muted">{matchedInc.immediateCorrection || "No immediate correction documented."}</p>
                      <Row className="mb-3">
                        <Col md={4}><strong>Actioned By:</strong><br />{matchedInc.correctionName || "-"}</Col>
                        <Col md={4}><strong>Designation (ID):</strong><br />{matchedInc.correctionDesignation || "-"} ({matchedInc.correctionEmpId || "-"})</Col>
                        <Col md={4}><strong>Date & Time:</strong><br />{matchedInc.correctionDateTime ? dayjs(matchedInc.correctionDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                      </Row>

                      <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Reported By Details</h5>
                      <Row className="mb-3">
                        <Col md={4}><strong>Reporter Name:</strong><br />{matchedInc.reportedBy || "-"}</Col>
                        <Col md={4}><strong>Designation (ID):</strong><br />{matchedInc.reportedByDesignation || "-"} ({matchedInc.reportedByEmpId || "-"})</Col>
                        <Col md={4}><strong>Date & Time:</strong><br />{matchedInc.reportedByDateTime ? dayjs(matchedInc.reportedByDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                      </Row>
                    </>
                  ) : (
                    <div className="bg-light p-3 border rounded text-muted mb-4">
                      Associated Incident details not found in the database.
                    </div>
                  )}

                  {/* Supervisor's Investigation Info */}
                  <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Supervisor's Investigation & RCA</h5>
                  <Row className="mb-3">
                    <Col md={4}><strong>Investigator (In-Charge) Name:</strong><br />{selectedInv.investigationName || "-"}</Col>
                    <Col md={4}><strong>Employee ID:</strong><br />{selectedInv.investigationSignatureEmpId || "-"}</Col>
                    <Col md={4}><strong>Dept / Designation:</strong><br />{selectedInv.investigationDeptDesignation || "-"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={12}><strong>Date & Time Investigated:</strong><br />{selectedInv.investigationDateTime ? dayjs(selectedInv.investigationDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                  </Row>

                  <div className="mb-3">
                    <strong>Root Cause Analysis (RCA):</strong>
                    <p className="bg-white p-3 border rounded text-muted mt-1">{selectedInv.why1 || "No RCA description provided."}</p>
                  </div>

                  {selectedInv.rcaImage && (
                    <div className="mb-4">
                      <strong>RCA Diagram:</strong>
                      <div className="mt-2 text-center" style={{ maxWidth: "100%", maxHeight: "400px", overflow: "hidden", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#fff" }}>
                        <img src={selectedInv.rcaImage} alt="RCA Diagram" style={{ maxWidth: "100%", maxHeight: "398px", objectFit: "contain" }} />
                      </div>
                    </div>
                  )}

                  <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Supervisor Corrective & Preventive Actions</h5>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Corrective Action Taken:</strong>
                      <p className="bg-white p-2 border rounded text-muted mt-1" style={{ minHeight: "60px" }}>{selectedInv.correctiveAction || "-"}</p>
                      <span className="text-muted small">By: {selectedInv.correctiveName || "-"} ({selectedInv.correctiveSignatureEmpId || "-"})</span>
                    </Col>
                    <Col md={6}>
                      <strong>Preventive Action Plan:</strong>
                      <p className="bg-white p-2 border rounded text-muted mt-1" style={{ minHeight: "60px" }}>{selectedInv.preventiveAction || "-"}</p>
                      <span className="text-muted small">By: {selectedInv.preventiveName || "-"} ({selectedInv.preventiveSignatureEmpId || "-"})</span>
                    </Col>
                  </Row>

                  {/* Quality Dept Review */}
                  <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Quality Department Review</h5>
                  <Row className="mb-3">
                    <Col md={3}><strong>Received By:</strong><br />{selectedInv.qualityReceivedBy || "-"}</Col>
                    <Col md={3}><strong>Employee ID:</strong><br />{selectedInv.qualityReceivedSignatureEmpId || "-"}</Col>
                    <Col md={3}><strong>Dept & Designation:</strong><br />{selectedInv.qualityReceivedDeptDesignation || "-"}</Col>
                    <Col md={3}><strong>Received Date & Time:</strong><br />{selectedInv.qualityReceivedDateTime ? dayjs(selectedInv.qualityReceivedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><strong>Quality Classification:</strong><br /><Badge bg="info">{selectedInv.qualityClassification || "-"}</Badge></Col>
                    <Col md={6}><strong>Verified By (Quality Head):</strong><br />{selectedInv.qualityVerifiedByHead || "-"}</Col>
                  </Row>
                  <div className="mb-3">
                    <strong>Quality Remarks:</strong>
                    <p className="bg-white p-3 border rounded text-muted mt-1">{selectedInv.qualityRemarks || "-"}</p>
                  </div>
                  <Row className="mb-3">
                    <Col md={12}><strong>Verification Date & Time:</strong><br />{selectedInv.qualityVerifiedDateTime ? dayjs(selectedInv.qualityVerifiedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                  </Row>
                </div>
              );
            })()
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupervisorInvestigationReport;

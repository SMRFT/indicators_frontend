import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Row, Col, Modal, Button, Container, Form, Spinner } from "react-bootstrap";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPrint, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../apiRequest";

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 18px;
  font-size: 14.5px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  width: auto;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
  }
`;

const ActionButton = styled.button`
  background: ${props => props.variant === "print" ? "#4e4376" : "#109b76"};
  color: white;
  border: none;
  padding: 8px 18px;
  font-size: 14.5px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.variant === "print" ? "0 4px 12px rgba(78, 67, 118, 0.2)" : "0 4px 12px rgba(16, 155, 118, 0.2)"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  width: auto;

  &:hover {
    background: ${props => props.variant === "print" ? "#3a3258" : "#0c7a5d"};
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === "print" ? "0 6px 16px rgba(78, 67, 118, 0.3)" : "0 6px 16px rgba(16, 155, 118, 0.3)"};
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background: white;
  margin-bottom: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14.5px;
  }

  th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
    padding: 12px 16px;
    text-align: left;
    white-space: nowrap;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #edf2f7;
    color: #2d3748;
    white-space: nowrap;
  }

  tr:hover {
    background-color: #f8fafc;
  }

  /* Sticky columns styling for first four fields */
  th:nth-child(1), td:nth-child(1) {
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: white;
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1);
    width: 120px;
    min-width: 120px;
    max-width: 120px;
  }
  th:nth-child(2), td:nth-child(2) {
    position: sticky;
    left: 120px;
    z-index: 2;
    background-color: white;
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1);
    width: 110px;
    min-width: 110px;
    max-width: 110px;
  }
  th:nth-child(3), td:nth-child(3) {
    position: sticky;
    left: 230px;
    z-index: 2;
    background-color: white;
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1);
    width: 100px;
    min-width: 100px;
    max-width: 100px;
  }
  th:nth-child(4), td:nth-child(4) {
    position: sticky;
    left: 330px;
    z-index: 2;
    background-color: white;
    box-shadow: 4px 0 5px -2px rgba(0, 0, 0, 0.15);
    width: 150px;
    min-width: 150px;
    max-width: 150px;
    border-right: 2px solid #cbd5e0;
  }

  th:nth-child(1), th:nth-child(2), th:nth-child(3), th:nth-child(4) {
    z-index: 3;
    background-color: #f8fafc !important;
  }

  tr:hover td:nth-child(1),
  tr:hover td:nth-child(2),
  tr:hover td:nth-child(3),
  tr:hover td:nth-child(4) {
    background-color: #f8fafc;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
`;

const PageButton = styled.button`
  background: ${props => props.active ? "#4e4376" : "white"};
  color: ${props => props.active ? "white" : "#4a5568"};
  border: 1px solid #cbd5e0;
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? "#4e4376" : "#edf2f7"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  gap: 15px;
`;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");
    setFromDate(thirtyDaysAgo);
    setToDate(today);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate]);

  useEffect(() => {
    setLoading(true);
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
      apiRequest(incUrl),
      apiRequest(invUrl),
      apiRequest(`${IndicatorBaseUrl}IncidentClassification/`)
    ])
      .then(([incRes, invRes, classRes]) => {
        if (!incRes.success || !invRes.success || !classRes.success) {
          throw new Error(incRes.error || invRes.error || classRes.error || "Failed to fetch data");
        }
        const incData = incRes.data;
        const invData = invRes.data;
        const classData = classRes.data;

        // Helper to check assignment
        const checkIsAssignedLocal = (inc) => {
          if (!inc) return false;
          const currentUserId = localStorage.getItem("userId") || "";
          if (!currentUserId) return false;

          let parsedClass = {};
          if (inc.classifications) {
            if (typeof inc.classifications === "string") {
              try {
                parsedClass = JSON.parse(inc.classifications);
              } catch (e) {
                parsedClass = {};
              }
            } else {
              parsedClass = inc.classifications;
            }
          }

          return Object.entries(parsedClass).some(([catTitle, items]) => {
            if (!Array.isArray(items) || items.length === 0) return false;
            const matchedClassObj = classData.find(c => c.category_key === catTitle || c.title === catTitle);
            if (!matchedClassObj) return false;

            // Check item-level first, fallback to category-level if item-level not assigned
            const itemIncharges = matchedClassObj.item_incharges || {};
            return items.some(item => {
              const assignment = itemIncharges[item] || {};
              if (assignment.incharge_id) {
                return String(assignment.incharge_id) === String(currentUserId);
              }
              return matchedClassObj.incharge_id && String(matchedClassObj.incharge_id) === String(currentUserId);
            });
          });
        };

        const userRole = localStorage.getItem("userRole") || "";
        const currentUserId = localStorage.getItem("userId") || "";

        let filteredInc = incData;
        if (userRole === "In-Charge") {
          filteredInc = incData.filter(item => checkIsAssignedLocal(item));
        } else if (userRole === "Employee") {
          filteredInc = incData.filter(item => String(item.reportedByEmpId) === String(currentUserId));
        }

        setData(filteredInc);
        setFilteredData(filteredInc);
        setInvestigations(invData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
    const tableHeaders = [
      "Incident No", "Date", "Time", "Location", "Person Involved Type",
      "Patient Name", "Patient Age & Sex", "Patient UHID", "Patient Doctor",
      "Employee Name", "Employee Age & Sex", "Employee Dept", "Designation",
      "ID No", "MR No", "Instrument/Tools Details", "Others Details",
      "Classifications", "Description of Incident", "Reported By",
      "Reported By Designation", "Reported By Emp ID", "Witness Name",
      "Immediate Correction", "Actioned By", "Actioned By Designation",
      "Date & Time Actioned"
    ];

    const rowsHtml = filteredData.map(item => `
      <tr>
        <td>${item.incidentNo || "-"}</td>
        <td>${item.incidentDate || "-"}</td>
        <td>${item.incidentTime || "-"}</td>
        <td>${item.incidentLocation || "-"}</td>
        <td>${item.personInvolvedType || "-"}</td>
        <td>${item.patientName || "-"}</td>
        <td>${item.patientAgeSex || "-"}</td>
        <td>${item.patientUhid || "-"}</td>
        <td>${item.patientDoctor || "-"}</td>
        <td>${item.employeeName || "-"}</td>
        <td>${item.employeeAgeSex || "-"}</td>
        <td>${item.employeeDept || "-"}</td>
        <td>${item.designation || "-"}</td>
        <td>${item.idNo || "-"}</td>
        <td>${item.mrNo || "-"}</td>
        <td>${item.instrumentToolsDetails || "-"}</td>
        <td>${item.personInvolvedOthersDetails || "-"}</td>
        <td>${formatClassifications(item.classifications) || "-"}</td>
        <td>${item.descriptionOfIncident || "-"}</td>
        <td>${item.reportedBy || "-"}</td>
        <td>${item.reportedByDesignation || "-"}</td>
        <td>${item.reportedByEmpId || "-"}</td>
        <td>${item.witnessName || "-"}</td>
        <td>${item.immediateCorrection || "-"}</td>
        <td>${item.correctionName || "-"}</td>
        <td>${item.correctionDesignation || "-"}</td>
        <td>${item.correctionDateTime ? dayjs(item.correctionDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</td>
      </tr>
    `).join("");

    const WindowPrt = window.open("", "", "width=900,height=650");
    WindowPrt.document.write(`
      <html>
        <head>
          <title>Incident Report Archive</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10px; }
            th, td { border: 1px solid #999; padding: 6px; text-align: left; word-break: break-all; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h2 { text-align: center; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <h2>Incident Report Archive</h2>
          <table>
            <thead>
              <tr>
                ${tableHeaders.map(h => `<th>${h}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
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

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-4">
        <BackButton onClick={() => navigate("/IncidentDashboard")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </BackButton>
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
          <ActionButton variant="print" onClick={handlePrint} title="Print Report">
            <FontAwesomeIcon icon={faPrint} /> Print
          </ActionButton>
          <ActionButton variant="excel" onClick={handleDownloadButtonClick} title="Export Excel">
            <FontAwesomeIcon icon={faFileExcel} /> Excel
          </ActionButton>
        </Col>
      </Row>

      {error && <p className="text-danger">{error}</p>}

      {/* Table */}
      {loading ? (
        <SpinnerContainer>
          <Spinner animation="border" role="status" style={{ width: "3rem", height: "3rem", color: "#4e4376" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div style={{ color: "#718096", fontSize: "16px", fontWeight: "500" }}>Fetching records...</div>
        </SpinnerContainer>
      ) : filteredData.length > 0 ? (
        <>
          <TableContainer ref={tableRef}>
            <table>
              <thead>
                <tr>
                  <th>Incident No</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Person Involved Type</th>
                  <th>Patient Name</th>
                  <th>Patient Age & Sex</th>
                  <th>Patient UHID</th>
                  <th>Patient Doctor</th>
                  <th>Employee Name</th>
                  <th>Employee Age & Sex</th>
                  <th>Employee Dept</th>
                  <th>Designation</th>
                  <th>ID No</th>
                  <th>MR No</th>
                  <th>Instrument/Tools Details</th>
                  <th>Others Details</th>
                  <th>Classifications</th>
                  <th>Description</th>
                  <th>Reported By</th>
                  <th>Reported By Designation</th>
                  <th>Reported By Emp ID</th>
                  <th>Witness Name</th>
                  <th>Immediate Correction</th>
                  <th>Actioned By</th>
                  <th>Actioned By Designation</th>
                  <th>Date & Time Actioned</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => (
                  <tr 
                    key={idx}
                    onClick={() => {
                      setSelectedReport(item);
                      setShowModal(true);
                    }}
                    style={{ cursor: "pointer" }}
                    title="Click to view full details"
                  >
                    <td>{item.incidentNo || "-"}</td>
                    <td>{item.incidentDate}</td>
                    <td>{item.incidentTime}</td>
                    <td>{item.incidentLocation}</td>
                    <td>{item.personInvolvedType}</td>
                    <td>{item.patientName || "-"}</td>
                    <td>{item.patientAgeSex || "-"}</td>
                    <td>{item.patientUhid || "-"}</td>
                    <td>{item.patientDoctor || "-"}</td>
                    <td>{item.employeeName || "-"}</td>
                    <td>{item.employeeAgeSex || "-"}</td>
                    <td>{item.employeeDept || "-"}</td>
                    <td>{item.designation || "-"}</td>
                    <td>{item.idNo || "-"}</td>
                    <td>{item.mrNo || "-"}</td>
                    <td>{item.instrumentToolsDetails || "-"}</td>
                    <td>{item.personInvolvedOthersDetails || "-"}</td>
                    <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={formatClassifications(item.classifications)}>
                      {formatClassifications(item.classifications)}
                    </td>
                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.descriptionOfIncident}>
                      {item.descriptionOfIncident}
                    </td>
                    <td>{item.reportedBy}</td>
                    <td>{item.reportedByDesignation || "-"}</td>
                    <td>{item.reportedByEmpId || "-"}</td>
                    <td>{item.witnessName || "-"}</td>
                    <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.immediateCorrection}>
                      {item.immediateCorrection || "-"}
                    </td>
                    <td>{item.correctionName || "-"}</td>
                    <td>{item.correctionDesignation || "-"}</td>
                    <td>{item.correctionDateTime ? dayjs(item.correctionDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>

          {filteredData.length > 0 && (
            <PaginationContainer>
              <div style={{ color: "#718096", fontSize: "14px" }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
              </div>
              <div style={{ display: "flex", gap: "2px" }}>
                <PageButton 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1}
                >
                  First
                </PageButton>
                <PageButton 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                >
                  Prev
                </PageButton>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                    return (
                      <PageButton
                        key={page}
                        active={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PageButton>
                    );
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return <span key={page} style={{ padding: "6px 8px", color: "#a0aec0" }}>...</span>;
                  }
                  return null;
                })}
                <PageButton 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </PageButton>
                <PageButton 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages}
                >
                  Last
                </PageButton>
              </div>
            </PaginationContainer>
          )}
        </>
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

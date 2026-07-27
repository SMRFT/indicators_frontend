import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Row, Col, Modal, Button, Badge, Container, Form, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPrint, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../apiRequest";
import "./ReportArchive.css";

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
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background: var(--color-surface);
  margin-bottom: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14.5px;
  }

  th {
    background-color: var(--color-accent-dark);
    color: #fff;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.05em;
    border-bottom: 2px solid var(--color-border);
    padding: 12px 16px;
    text-align: left;
    white-space: nowrap;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text-primary);
    white-space: nowrap;
  }

  tr:hover {
    background-color: var(--color-hover-overlay);
  }

  /* Sticky columns styling for first five fields */
  th:nth-child(1), td:nth-child(1) {
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: var(--color-surface);
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1);
    width: 80px;
    min-width: 80px;
    max-width: 80px;
  }
  th:nth-child(2), td:nth-child(2) {
    position: sticky;
    left: 80px;
    z-index: 2;
    background-color: var(--color-surface);
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1);
    width: 120px;
    min-width: 120px;
    max-width: 120px;
  }
  th:nth-child(3), td:nth-child(3) {
    position: sticky;
    left: 200px;
    z-index: 2;
    background-color: var(--color-surface);
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1);
    width: 110px;
    min-width: 110px;
    max-width: 110px;
  }
  th:nth-child(4), td:nth-child(4) {
    position: sticky;
    left: 310px;
    z-index: 2;
    background-color: var(--color-surface);
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1);
    width: 100px;
    min-width: 100px;
    max-width: 100px;
  }
  th:nth-child(5), td:nth-child(5) {
    position: sticky;
    left: 410px;
    z-index: 2;
    background-color: var(--color-surface);
    box-shadow: 4px 0 5px -2px rgba(0, 0, 0, 0.15);
    width: 150px;
    min-width: 150px;
    max-width: 150px;
    border-right: 2px solid var(--color-border-strong);
  }

  th:nth-child(1), th:nth-child(2), th:nth-child(3), th:nth-child(4), th:nth-child(5) {
    z-index: 3;
    background-color: var(--color-accent-dark) !important;
  }

  tr:hover td:nth-child(1),
  tr:hover td:nth-child(2),
  tr:hover td:nth-child(3),
  tr:hover td:nth-child(4),
  tr:hover td:nth-child(5) {
    background-color: var(--color-hover-overlay);
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
  background: ${props => props.active ? "#4e4376" : "var(--color-surface)"};
  color: ${props => props.active ? "white" : "var(--color-text-primary)"};
  border: 1px solid var(--color-border-strong);
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? "#4e4376" : "var(--color-hover-overlay)"};
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
      apiRequest(invUrl),
      apiRequest(incUrl),
      apiRequest(`${IndicatorBaseUrl}IncidentClassification/`)
    ])
      .then(([invRes, incRes, classRes]) => {
        if (!invRes.success || !incRes.success || !classRes.success) {
          throw new Error(invRes.error || incRes.error || classRes.error || "Failed to fetch data");
        }
        const invData = invRes.data;
        const incData = incRes.data;
        const classData = classRes.data;
        setIncidents(incData);

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
        if (userRole === "In-Charge") {
          const filteredInv = invData.filter(item => {
            const inc = incData.find(i => String(i.incidentNo) === String(item.incidentId) || String(i.id) === String(item.incidentId));
            return checkIsAssignedLocal(inc);
          });
          setData(filteredInv);
          setFilteredData(filteredInv);
        } else {
          setData(invData);
          setFilteredData(invData);
        }
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
      "ID", "Incident ID", "Incident Date", "Incident Time", "Incident Location",
      "Person Involved", "Classifications", "Incident Description", "Investigation Date",
      "RCA (Why 1)", "Corrective Action", "Preventive Action", "Investigator Name",
      "Investigator Emp ID", "Investigator Dept/Designation", "Corrective Name",
      "Corrective Emp ID", "Corrective Dept/Designation", "Preventive Name",
      "Preventive Emp ID", "Preventive Dept/Designation", "Quality Received By",
      "Quality Received Dept/Designation", "Quality Received Emp ID",
      "Quality Received Date & Time", "Quality Classification", "Quality Remarks",
      "Quality Verified By Head", "Quality Verified Date & Time"
    ];

    const rowsHtml = filteredData.map(item => {
      const matchedInc = incidents.find(inc => String(inc.incidentNo || inc.id) === String(item.incidentNo || item.incidentId));
      const incDate = matchedInc?.incidentDate || "-";
      const incTime = matchedInc?.incidentTime || "-";
      const incLocation = matchedInc?.incidentLocation || "-";
      const incDescription = matchedInc?.descriptionOfIncident || "-";
      const incClassifications = matchedInc ? formatClassifications(matchedInc.classifications) : "-";
      const incPerson = matchedInc ? `${matchedInc.personInvolvedType}${matchedInc.patientName ? ` (Patient: ${matchedInc.patientName})` : matchedInc.employeeName ? ` (Employee: ${matchedInc.employeeName})` : ""}` : "-";

      return `
        <tr>
          <td>${item.id || "-"}</td>
          <td>${item.incidentNo || item.incidentId || "-"}</td>
          <td>${incDate}</td>
          <td>${incTime}</td>
          <td>${incLocation}</td>
          <td>${incPerson}</td>
          <td>${incClassifications}</td>
          <td>${incDescription}</td>
          <td>${item.investigationDateTime ? dayjs(item.investigationDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</td>
          <td>${item.why1 || "-"}</td>
          <td>${item.correctiveAction || "-"}</td>
          <td>${item.preventiveAction || "-"}</td>
          <td>${item.investigationName || "-"}</td>
          <td>${item.investigationSignatureEmpId || "-"}</td>
          <td>${item.investigationDeptDesignation || "-"}</td>
          <td>${item.correctiveName || "-"}</td>
          <td>${item.correctiveSignatureEmpId || "-"}</td>
          <td>${item.correctiveDeptDesignation || "-"}</td>
          <td>${item.preventiveName || "-"}</td>
          <td>${item.preventiveSignatureEmpId || "-"}</td>
          <td>${item.preventiveDeptDesignation || "-"}</td>
          <td>${item.qualityReceivedBy || "-"}</td>
          <td>${item.qualityReceivedDeptDesignation || "-"}</td>
          <td>${item.qualityReceivedSignatureEmpId || "-"}</td>
          <td>${item.qualityReceivedDateTime ? dayjs(item.qualityReceivedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</td>
          <td>${item.qualityClassification || "-"}</td>
          <td>${item.qualityRemarks || "-"}</td>
          <td>${item.qualityVerifiedByHead || "-"}</td>
          <td>${item.qualityVerifiedDateTime ? dayjs(item.qualityVerifiedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</td>
        </tr>
      `;
    }).join("");

    const WindowPrt = window.open("", "", "width=900,height=650");
    WindowPrt.document.write(`
      <html>
        <head>
          <title>Supervisor Investigation & RCA Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10px; }
            th, td { border: 1px solid #999; padding: 6px; text-align: left; word-break: break-all; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h2 { text-align: center; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <h2>Supervisor Investigation & Root Cause Analysis Report</h2>
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
    const flattenedData = filteredData.map((item) => {
      const matchedInc = incidents.find(inc => String(inc.incidentNo || inc.id) === String(item.incidentNo || item.incidentId));
      return {
        "Investigation ID": item.id,
        "Incident ID": item.incidentNo || item.incidentId,
        "Incident Date": matchedInc?.incidentDate || "-",
        "Incident Time": matchedInc?.incidentTime || "-",
        "Incident Location": matchedInc?.incidentLocation || "-",
        "Person Involved": matchedInc ? `${matchedInc.personInvolvedType}${matchedInc.patientName ? ` (Patient: ${matchedInc.patientName})` : matchedInc.employeeName ? ` (Employee: ${matchedInc.employeeName})` : ""}` : "-",
        "Classifications": matchedInc ? formatClassifications(matchedInc.classifications) : "-",
        "Incident Description": matchedInc?.descriptionOfIncident || "-",
        "Investigation Date": item.investigationDateTime ? dayjs(item.investigationDateTime).format("DD/MM/YYYY hh:mm A") : "-",
        "RCA (Why 1)": item.why1 || "-",
        "Corrective Action": item.correctiveAction || "-",
        "Preventive Action": item.preventiveAction || "-",
        "Investigator Name": item.investigationName || "-",
        "Investigator Emp ID": item.investigationSignatureEmpId || "-",
        "Investigator Dept/Designation": item.investigationDeptDesignation || "-",
        "Corrective Name": item.correctiveName || "-",
        "Corrective Emp ID": item.correctiveSignatureEmpId || "-",
        "Corrective Dept/Designation": item.correctiveDeptDesignation || "-",
        "Preventive Name": item.preventiveName || "-",
        "Preventive Emp ID": item.preventiveSignatureEmpId || "-",
        "Preventive Dept/Designation": item.preventiveDeptDesignation || "-",
        "Quality Received By": item.qualityReceivedBy || "-",
        "Quality Received Dept/Designation": item.qualityReceivedDeptDesignation || "-",
        "Quality Received Emp ID": item.qualityReceivedSignatureEmpId || "-",
        "Quality Received Date & Time": item.qualityReceivedDateTime ? dayjs(item.qualityReceivedDateTime).format("DD/MM/YYYY hh:mm A") : "-",
        "Quality Classification": item.qualityClassification || "-",
        "Quality Remarks": item.qualityRemarks || "-",
        "Quality Verified By Head": item.qualityVerifiedByHead || "-",
        "Quality Verified Date & Time": item.qualityVerifiedDateTime ? dayjs(item.qualityVerifiedDateTime).format("DD/MM/YYYY hh:mm A") : "-",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Investigations");
    XLSX.writeFile(workbook, "Supervisor_Investigations_Report.xlsx");
  };

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-4 archive-page">
      <div className="d-flex align-items-center mb-4">
        <BackButton onClick={() => navigate("/IncidentDashboard")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </BackButton>
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
              selected={fromDate ? dayjs(fromDate).toDate() : null}
              onChange={(date) => setFromDate(date ? dayjs(date).format("YYYY-MM-DD") : "")}
              dateFormat="yyyy-MM-dd"
              className="form-control w-100"
              placeholderText="Select From Date"
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group controlId="toDate">
            <Form.Label style={{ fontWeight: "600" }} className="d-block">To Date</Form.Label>
            <DatePicker
              selected={toDate ? dayjs(toDate).toDate() : null}
              onChange={(date) => setToDate(date ? dayjs(date).format("YYYY-MM-DD") : "")}
              dateFormat="yyyy-MM-dd"
              className="form-control w-100"
              placeholderText="Select To Date"
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
          <div style={{ color: "var(--color-text-muted)", fontSize: "16px", fontWeight: "500" }}>Fetching records...</div>
        </SpinnerContainer>
      ) : filteredData.length > 0 ? (
        <>
          <TableContainer ref={tableRef}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Incident ID</th>
                  <th>Incident Date</th>
                  <th>Incident Time</th>
                  <th>Incident Location</th>
                  <th>Person Involved</th>
                  <th>Classifications</th>
                  <th>Incident Description</th>
                  <th>Investigation Date</th>
                  <th>RCA (Why 1)</th>
                  <th>Corrective Action</th>
                  <th>Preventive Action</th>
                  <th>Investigator Name</th>
                  <th>Investigator Emp ID</th>
                  <th>Investigator Dept/Designation</th>
                  <th>Corrective Name</th>
                  <th>Corrective Emp ID</th>
                  <th>Corrective Dept/Designation</th>
                  <th>Preventive Name</th>
                  <th>Preventive Emp ID</th>
                  <th>Preventive Dept/Designation</th>
                  <th>Quality Received By</th>
                  <th>Quality Received Dept/Designation</th>
                  <th>Quality Received Emp ID</th>
                  <th>Quality Received Date & Time</th>
                  <th>Quality Classification</th>
                  <th>Quality Remarks</th>
                  <th>Quality Verified By Head</th>
                  <th>Quality Verified Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => {
                  const matchedInc = incidents.find(inc => String(inc.incidentNo || inc.id) === String(item.incidentNo || item.incidentId));
                  return (
                    <tr 
                      key={idx}
                      onClick={() => {
                        setSelectedInv(item);
                        setShowModal(true);
                      }}
                      style={{ cursor: "pointer" }}
                      title="Click to view full details"
                    >
                      <td>{item.id}</td>
                      <td>{item.incidentNo || item.incidentId || "-"}</td>
                      <td>{matchedInc?.incidentDate || "-"}</td>
                      <td>{matchedInc?.incidentTime || "-"}</td>
                      <td>{matchedInc?.incidentLocation || "-"}</td>
                      <td>{matchedInc ? `${matchedInc.personInvolvedType}${matchedInc.patientName ? ` (Patient: ${matchedInc.patientName})` : matchedInc.employeeName ? ` (Employee: ${matchedInc.employeeName})` : ""}` : "-"}</td>
                      <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={matchedInc ? formatClassifications(matchedInc.classifications) : ""}>
                        {matchedInc ? formatClassifications(matchedInc.classifications) : "-"}
                      </td>
                      <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={matchedInc?.descriptionOfIncident || ""}>
                        {matchedInc?.descriptionOfIncident || "-"}
                      </td>
                      <td>
                        {item.investigationDateTime ? dayjs(item.investigationDateTime).format("DD/MM/YYYY hh:mm A") : "-"}
                      </td>
                      <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.why1}>
                        {item.why1 || "-"}
                      </td>
                      <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.correctiveAction}>
                        {item.correctiveAction || "-"}
                      </td>
                      <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.preventiveAction}>
                        {item.preventiveAction || "-"}
                      </td>
                      <td>{item.investigationName || "-"}</td>
                      <td>{item.investigationSignatureEmpId || "-"}</td>
                      <td>{item.investigationDeptDesignation || "-"}</td>
                      <td>{item.correctiveName || "-"}</td>
                      <td>{item.correctiveSignatureEmpId || "-"}</td>
                      <td>{item.correctiveDeptDesignation || "-"}</td>
                      <td>{item.preventiveName || "-"}</td>
                      <td>{item.preventiveSignatureEmpId || "-"}</td>
                      <td>{item.preventiveDeptDesignation || "-"}</td>
                      <td>{item.qualityReceivedBy || "-"}</td>
                      <td>{item.qualityReceivedDeptDesignation || "-"}</td>
                      <td>{item.qualityReceivedSignatureEmpId || "-"}</td>
                      <td>
                        {item.qualityReceivedDateTime ? dayjs(item.qualityReceivedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}
                      </td>
                      <td>{item.qualityClassification || "-"}</td>
                      <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.qualityRemarks}>
                        {item.qualityRemarks || "-"}
                      </td>
                      <td>{item.qualityVerifiedByHead || "-"}</td>
                      <td>
                        {item.qualityVerifiedDateTime ? dayjs(item.qualityVerifiedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableContainer>

          {filteredData.length > 0 && (
            <PaginationContainer>
              <div style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
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
                    return <span key={page} style={{ padding: "6px 8px", color: "var(--color-text-muted)" }}>...</span>;
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
          No data available for selected dates or search criteria.
        </p>
      )}

      {/* Detailed Investigation View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: "var(--color-accent-dark)", color: "#fff" }}>
          <Modal.Title>Investigation & RCA Details - ID: {selectedInv?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "var(--color-bg-canvas)" }}>
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
                      <div className="detail-box mb-3">
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
                      <p className="detail-box">{matchedInc.descriptionOfIncident || "No description provided."}</p>

                      <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Immediate Correction Details</h5>
                      <p className="detail-box">{matchedInc.immediateCorrection || "No immediate correction documented."}</p>
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
                    <div className="detail-box mb-4">
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
                    <p className="detail-box mt-1">{selectedInv.why1 || "No RCA description provided."}</p>
                  </div>

                  {selectedInv.rcaImage && (
                    <div className="mb-4">
                      <strong>RCA Diagram:</strong>
                      <div className="mt-2 text-center" style={{ maxWidth: "100%", maxHeight: "400px", overflow: "hidden", border: "1px solid var(--color-border-strong)", borderRadius: "4px", backgroundColor: "var(--color-surface)" }}>
                        <img src={selectedInv.rcaImage} alt="RCA Diagram" style={{ maxWidth: "100%", maxHeight: "398px", objectFit: "contain" }} />
                      </div>
                    </div>
                  )}

                  <h5 className="border-bottom pb-2 mb-3 text-primary mt-4">Supervisor Corrective & Preventive Actions</h5>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Corrective Action Taken:</strong>
                      <p className="detail-box sm mt-1" style={{ minHeight: "60px" }}>{selectedInv.correctiveAction || "-"}</p>
                      <span className="text-muted small">By: {selectedInv.correctiveName || "-"} ({selectedInv.correctiveSignatureEmpId || "-"})</span>
                    </Col>
                    <Col md={6}>
                      <strong>Preventive Action Plan:</strong>
                      <p className="detail-box sm mt-1" style={{ minHeight: "60px" }}>{selectedInv.preventiveAction || "-"}</p>
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
                    <p className="detail-box mt-1">{selectedInv.qualityRemarks || "-"}</p>
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

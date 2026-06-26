import React, { useState, useEffect } from "react";
import { Row, Form, Col, Alert, Card, Badge, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faQuestionCircle, faFileMedical, faUserTie, faCheckDouble, faEye, faEdit, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { message } from "antd";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 30px;
  max-width: 1200px;
  background: #fdfdfd;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #2b5876, #4e4376);
  color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
  
  h2 {
    margin: 0;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  span {
    opacity: 0.9;
    font-size: 14px;
  }
`;

const SectionTitle = styled.h4`
  color: #4e4376;
  border-bottom: 2px solid #eef2f5;
  padding-bottom: 8px;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledButton = styled.button`
  background: #4e4376;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(78, 67, 118, 0.2);
  width: auto;
  height: auto;

  &:hover {
    background: #3a3258;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(78, 67, 118, 0.3);
  }

  &:disabled {
    background: #b2abbd;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.variant === "view" ? "#4e4376" : "#109b76"};
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;

  &:hover {
    background: ${props => props.variant === "view" ? "#3a3258" : "#0c7a5d"};
    transform: translateY(-1px);
  }
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
  width: auto;
  height: auto;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
  }
`;

const InfoCard = styled(Card)`
  background: #f8f9fa;
  border-left: 5px solid #4e4376;
  margin-bottom: 24px;
  border-radius: 6px;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  width: 100%;
  max-width: 350px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4e4376;
  }
`;

const SupervisorInvestigation = () => {
  const navigate = useNavigate();
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const userRole = localStorage.getItem("userRole") || "";

  // View state: 'list', 'view', 'edit'
  const [viewMode, setViewMode] = useState("list");
  const [incidents, setIncidents] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [classificationsList, setClassificationsList] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Search and Date filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [investigationDate, setInvestigationDate] = useState(new Date());
  const [receivedDate, setReceivedDate] = useState(new Date());
  const [verifiedDate, setVerifiedDate] = useState(new Date());

  // Form states
  const [formData, setFormData] = useState({
    why1: "", // Mapped as single RCA field
    why2: "",
    why3: "",
    why4: "",
    why5: "",
    correctiveAction: "",
    preventiveAction: "",
    investigationName: "",
    investigationSignatureEmpId: "",
    investigationDeptDesignation: "",
    correctiveName: "",
    correctiveSignatureEmpId: "",
    correctiveDeptDesignation: "",
    preventiveName: "",
    preventiveSignatureEmpId: "",
    preventiveDeptDesignation: "",
    qualityReceivedBy: "",
    qualityReceivedDeptDesignation: "",
    qualityClassification: "No harm",
    qualityRemarks: "",
    qualityVerifiedByHead: "",
    rcaImage: "",
    qualityReceivedSignatureEmpId: ""
  });

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: localStorage.getItem("access_token"),
      };

      let incUrl = `${IndicatorBaseUrl}IncidentReport/`;
      let invUrl = `${IndicatorBaseUrl}SupervisorInvestigation/`;
      const params = [];
      if (fromDate) params.push(`startDate=${fromDate}`);
      if (toDate) params.push(`endDate=${toDate}`);
      if (params.length > 0) {
        incUrl += `?${params.join("&")}`;
        invUrl += `?${params.join("&")}`;
      }
      
      const [incRes, invRes, classRes] = await Promise.all([
        fetch(incUrl, { headers }),
        fetch(invUrl, { headers }),
        fetch(`${IndicatorBaseUrl}IncidentClassification/`, { headers })
      ]);

      if (incRes.ok && invRes.ok && classRes.ok) {
        const incData = await incRes.json();
        const invData = await invRes.json();
        const classData = await classRes.json();
        setIncidents(incData);
        setInvestigations(invData);
        setClassificationsList(classData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (userRole && userRole !== "Admin" && userRole !== "In-Charge") {
      navigate("/IncidentDashboard");
      return;
    }
    fetchData();
  }, [IndicatorBaseUrl, fromDate, toDate, userRole]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getInvestigationForIncident = (incident) => {
    if (!incident) return null;
    return investigations.find(inv => 
      String(inv.incidentId) === String(incident.incidentNo) ||
      String(inv.incidentId) === String(incident.id)
    );
  };

  const handleView = (incident) => {
    setSelectedIncident(incident);
    setViewMode("view");
  };

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    const existing = getInvestigationForIncident(incident);
    const uRole = localStorage.getItem("userRole") || "";
    const uName = localStorage.getItem("userName") || "";
    const uId = localStorage.getItem("userId") || "";

    if (existing) {
      setFormData({
        why1: existing.why1 || "",
        why2: "",
        why3: "",
        why4: "",
        why5: "",
        correctiveAction: existing.correctiveAction || "",
        preventiveAction: existing.preventiveAction || "",
        investigationName: existing.investigationName || uName,
        investigationSignatureEmpId: existing.investigationSignatureEmpId || uId,
        investigationDeptDesignation: existing.investigationDeptDesignation || "",
        correctiveName: existing.correctiveName || uName,
        correctiveSignatureEmpId: existing.correctiveSignatureEmpId || uId,
        correctiveDeptDesignation: existing.correctiveDeptDesignation || "",
        preventiveName: existing.preventiveName || uName,
        preventiveSignatureEmpId: existing.preventiveSignatureEmpId || uId,
        preventiveDeptDesignation: existing.preventiveDeptDesignation || "",
        qualityReceivedBy: existing.qualityReceivedBy || (uRole === "Admin" ? uName : ""),
        qualityReceivedDeptDesignation: existing.qualityReceivedDeptDesignation || "",
        qualityClassification: existing.qualityClassification || "No harm",
        qualityRemarks: existing.qualityRemarks || "",
        qualityVerifiedByHead: existing.qualityVerifiedByHead || (uRole === "Admin" ? uName : ""),
        rcaImage: existing.rcaImage || "",
        qualityReceivedSignatureEmpId: existing.qualityReceivedSignatureEmpId || (uRole === "Admin" ? uId : "")
      });
      setInvestigationDate(existing.investigationDateTime ? new Date(existing.investigationDateTime) : new Date());
      setReceivedDate(existing.qualityReceivedDateTime ? new Date(existing.qualityReceivedDateTime) : new Date());
      setVerifiedDate(existing.qualityVerifiedDateTime ? new Date(existing.qualityVerifiedDateTime) : new Date());
    } else {
      setFormData({
        why1: "",
        why2: "",
        why3: "",
        why4: "",
        why5: "",
        correctiveAction: "",
        preventiveAction: "",
        investigationName: uName,
        investigationSignatureEmpId: uId,
        investigationDeptDesignation: "",
        correctiveName: uName,
        correctiveSignatureEmpId: uId,
        correctiveDeptDesignation: "",
        preventiveName: uName,
        preventiveSignatureEmpId: uId,
        preventiveDeptDesignation: "",
        qualityReceivedBy: uRole === "Admin" ? uName : "",
        qualityReceivedDeptDesignation: "",
        qualityClassification: "No harm",
        qualityRemarks: "",
        qualityVerifiedByHead: uRole === "Admin" ? uName : "",
        rcaImage: "",
        qualityReceivedSignatureEmpId: uRole === "Admin" ? uId : ""
      });
      setInvestigationDate(new Date());
      setReceivedDate(new Date());
      setVerifiedDate(new Date());
    }
    setValidated(false);
    setError("");
    setViewMode("edit");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, rcaImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const submissionData = {
        ...formData,
        incidentId: selectedIncident.incidentNo || selectedIncident.id,
        investigationDateTime: investigationDate ? investigationDate.toISOString() : "",
        correctiveDateTime: new Date().toISOString(),
        preventiveDateTime: new Date().toISOString(),
        qualityReceivedDateTime: receivedDate ? receivedDate.toISOString() : "",
        qualityVerifiedDateTime: verifiedDate ? verifiedDate.toISOString() : "",
        "auth-user-id": localStorage.getItem("userId")
      };

      const response = await fetch(`${IndicatorBaseUrl}SupervisorInvestigation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token")
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save Supervisor Investigation");
      }

      message.success("Investigation & RCA saved successfully!");
      setFormSubmitted(true);
      await fetchData();
      setTimeout(() => {
        setFormSubmitted(false);
        setViewMode("list");
      }, 1500);
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to submit the form.");
      setError(err.message || "Failed to submit the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    // Filter incidents by allocated in-charge role
    if (userRole === "In-Charge") {
      const incClassifications = inc.classifications;
      let parsedClass = {};
      if (incClassifications) {
        if (typeof incClassifications === "string") {
          try {
            parsedClass = JSON.parse(incClassifications);
          } catch (e) {
            parsedClass = {};
          }
        } else {
          parsedClass = incClassifications;
        }
      }
      
      const incCategories = Object.keys(parsedClass).filter(
        cat => Array.isArray(parsedClass[cat]) && parsedClass[cat].length > 0
      );
      
      const isAssigned = incCategories.some(catTitle => {
        const matchedClassObj = classificationsList.find(c => c.category_key === catTitle || c.title === catTitle);
        return matchedClassObj && String(matchedClassObj.incharge_id) === String(localStorage.getItem("userId"));
      });
      
      if (!isAssigned) return false;
    }

    const searchLower = searchTerm.toLowerCase();
    const incidentNo = (inc.incidentNo || "").toLowerCase();
    const location = (inc.incidentLocation || "").toLowerCase();
    const patientName = (inc.patientName || "").toLowerCase();
    const employeeName = (inc.employeeName || "").toLowerCase();
    return incidentNo.includes(searchLower) ||
      location.includes(searchLower) ||
      patientName.includes(searchLower) ||
      employeeName.includes(searchLower);
  });

  const getInvolvedPersonText = (inc) => {
    if (inc.personInvolvedType === "Patient") {
      return `Patient: ${inc.patientName || "-"}`;
    } else if (inc.personInvolvedType === "Employee") {
      return `Employee: ${inc.employeeName || "-"}`;
    } else if (inc.personInvolvedType === "Instrument/Tools") {
      return `Instrument/Tools: ${inc.instrumentToolsDetails || "-"}`;
    } else {
      return `Others: ${inc.personInvolvedOthersDetails || "-"}`;
    }
  };

  const renderAllIncidentDetails = (incident) => {
    if (!incident) return null;

    let parsedClass = {};
    if (incident.classifications) {
      if (typeof incident.classifications === "string") {
        try {
          parsedClass = JSON.parse(incident.classifications);
        } catch (e) {
          parsedClass = {};
        }
      } else {
        parsedClass = incident.classifications;
      }
    }

    const classEntries = Object.entries(parsedClass).filter(
      ([_, items]) => Array.isArray(items) && items.length > 0
    );

    return (
      <InfoCard className="mb-4">
        <Card.Body>
          <h5 className="border-bottom pb-2 mb-3 text-primary" style={{ fontSize: "16px", fontWeight: "600" }}>General Information</h5>
          <Row className="mb-3">
            <Col md={3}><strong>Incident No:</strong><br /> {incident.incidentNo || "-"}</Col>
            <Col md={3}><strong>Date & Time:</strong><br /> {incident.incidentDate} at {incident.incidentTime}</Col>
            <Col md={3}><strong>Location:</strong><br /> {incident.incidentLocation}</Col>
            <Col md={3}><strong>Witness Name:</strong><br /> {incident.witnessName || "-"}</Col>
          </Row>

          <h5 className="border-bottom pb-2 mb-3 text-primary mt-3" style={{ fontSize: "16px", fontWeight: "600" }}>Involved Person Details</h5>
          {incident.personInvolvedType === "Patient" && (
            <Row className="mb-3">
              <Col md={3}><strong>Patient Name:</strong><br /> {incident.patientName || "-"}</Col>
              <Col md={3}><strong>Age / Sex:</strong><br /> {incident.patientAgeSex || "-"}</Col>
              <Col md={2}><strong>UHID:</strong><br /> {incident.patientUhid || "-"}</Col>
              <Col md={2}><strong>MR No:</strong><br /> {incident.mrNo || "-"}</Col>
              <Col md={2}><strong>Doctor:</strong><br /> {incident.patientDoctor || "-"}</Col>
            </Row>
          )}
          {incident.personInvolvedType === "Employee" && (
            <Row className="mb-3">
              <Col md={3}><strong>Employee Name:</strong><br /> {incident.employeeName || "-"}</Col>
              <Col md={2}><strong>Age / Sex:</strong><br /> {incident.employeeAgeSex || "-"}</Col>
              <Col md={2}><strong>Designation:</strong><br /> {incident.designation || "-"}</Col>
              <Col md={2}><strong>Employee ID:</strong><br /> {incident.idNo || "-"}</Col>
              <Col md={3}><strong>Department:</strong><br /> {incident.employeeDept || "-"}</Col>
            </Row>
          )}
          {incident.personInvolvedType === "Instrument/Tools" && (
            <Row className="mb-3">
              <Col md={12}><strong>Instrument/Tools Details:</strong><br /> {incident.instrumentToolsDetails || "-"}</Col>
            </Row>
          )}
          {incident.personInvolvedType === "Others" && (
            <Row className="mb-3">
              <Col md={12}><strong>Specify Details:</strong><br /> {incident.personInvolvedOthersDetails || "-"}</Col>
            </Row>
          )}

          <h5 className="border-bottom pb-2 mb-3 text-primary mt-3" style={{ fontSize: "16px", fontWeight: "600" }}>Classifications</h5>
          <div className="bg-white p-2 border rounded mb-3">
            {classEntries.length === 0 ? (
              <span className="text-muted">No classifications selected.</span>
            ) : (
              classEntries.map(([category, items]) => (
                <div key={category} className="mb-1" style={{ fontSize: "14px" }}>
                  <strong>{category}:</strong> <span className="text-muted">{items.join(", ")}</span>
                </div>
              ))
            )}
          </div>

          <h5 className="border-bottom pb-2 mb-3 text-primary mt-3" style={{ fontSize: "16px", fontWeight: "600" }}>Description of Incident</h5>
          <p className="bg-white p-2 border rounded text-muted mb-3" style={{ whiteSpace: "pre-wrap" }}>{incident.descriptionOfIncident}</p>

          <h5 className="border-bottom pb-2 mb-3 text-primary mt-3" style={{ fontSize: "16px", fontWeight: "600" }}>Immediate Correction Taken</h5>
          <p className="bg-white p-2 border rounded text-muted mb-2" style={{ whiteSpace: "pre-wrap" }}>{incident.immediateCorrection || "No immediate correction documented."}</p>
          <Row className="mb-3">
            <Col md={4}><strong>Actioned By:</strong><br /> {incident.correctionName || "-"}</Col>
            <Col md={4}><strong>Designation (ID):</strong><br /> {incident.correctionDesignation || "-"} ({incident.correctionEmpId || "-"})</Col>
            <Col md={4}><strong>Date & Time:</strong><br /> {incident.correctionDateTime ? dayjs(incident.correctionDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
          </Row>

          <h5 className="border-bottom pb-2 mb-3 text-primary mt-3" style={{ fontSize: "16px", fontWeight: "600" }}>Reported By Details</h5>
          <Row>
            <Col md={4}><strong>Reporter Name:</strong><br /> {incident.reportedBy || "-"}</Col>
            <Col md={4}><strong>Designation (ID):</strong><br /> {incident.reportedByDesignation || "-"} ({incident.reportedByEmpId || "-"})</Col>
            <Col md={4}><strong>Date & Time:</strong><br /> {incident.reportedByDateTime ? dayjs(incident.reportedByDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
          </Row>
        </Card.Body>
      </InfoCard>
    );
  };

  return (
    <StyledContainer>
      {viewMode === "list" && (
        <>
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
              Supervisor's Investigation & Root Cause Analysis
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
                  placeholder="Search by Inc No, location, name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group controlId="fromDate">
                <Form.Label style={{ fontWeight: "600" }} className="d-block">From Date</Form.Label>
                <Form.Control
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ borderRadius: "6px" }}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group controlId="toDate">
                <Form.Label style={{ fontWeight: "600" }} className="d-block">To Date</Form.Label>
                <Form.Control
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ borderRadius: "6px" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <SectionTitle>
            <FontAwesomeIcon icon={faSearch} /> Incident Reports list
          </SectionTitle>

          <div className="table-responsive">
            <Table hover striped bordered className="align-middle">
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th>Incident No</th>
                  <th>Date / Time</th>
                  <th>Location</th>
                  <th>Involved Person</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((inc, idx) => {
                    const inv = getInvestigationForIncident(inc);
                    return (
                      <tr key={inc.incidentNo || inc.id || idx}>
                        <td>{inc.incidentNo || "-"}</td>
                        <td>{inc.incidentDate} {inc.incidentTime}</td>
                        <td>{inc.incidentLocation}</td>
                        <td>{getInvolvedPersonText(inc)}</td>
                        <td>
                          {inv ? (
                            <Badge bg="success">Investigated</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">Pending RCA</Badge>
                          )}
                        </td>
                        <td>
                          <ActionButton variant="view" onClick={() => handleView(inc)}>
                            <FontAwesomeIcon icon={faEye} /> View
                          </ActionButton>
                          <ActionButton variant="edit" onClick={() => handleEdit(inc)}>
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </ActionButton>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No incidents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {viewMode === "view" && selectedIncident && (
        <>
          <div className="mb-3">
            <BackButton onClick={() => setViewMode("list")}>
              ← Back to List
            </BackButton>
          </div>

          <FormHeader>
            <h2>VIEW INCIDENT REPORT & RCA</h2>
            <span>CONFIDENTIAL • ID: {selectedIncident.incidentNo || "Pending"}</span>
          </FormHeader>

          <SectionTitle>
            <FontAwesomeIcon icon={faQuestionCircle} /> Incident Details
          </SectionTitle>
          {renderAllIncidentDetails(selectedIncident)}

          <SectionTitle>
            <FontAwesomeIcon icon={faFileMedical} /> Root Cause Analysis & Actions
          </SectionTitle>
          {getInvestigationForIncident(selectedIncident) ? (
            (() => {
              const inv = getInvestigationForIncident(selectedIncident);
              return (
                <Card className="mb-4">
                  <Card.Body>
                    <div className="mb-4">
                      <h6 className="border-bottom pb-2 text-secondary" style={{ fontWeight: "600" }}>Investigator Details</h6>
                      <Row>
                        <Col md={4}><strong>In-Charge / Investigator Name:</strong><br /> {inv.investigationName || "-"}</Col>
                        <Col md={4}><strong>Employee ID:</strong><br /> {inv.investigationSignatureEmpId || "-"}</Col>
                        <Col md={4}><strong>Dept / Designation:</strong><br /> {inv.investigationDeptDesignation || "-"}</Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md={12}><strong>Investigation Date & Time:</strong><br /> {inv.investigationDateTime ? dayjs(inv.investigationDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                      </Row>
                    </div>

                    <div className="mb-3">
                      <strong>Root Cause Analysis (RCA):</strong>
                      <p className="p-3 bg-light rounded mt-1">{inv.why1 || "No details provided."}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Corrective Action (by Dept Incharge):</strong>
                      <p className="p-3 bg-light rounded mt-1">{inv.correctiveAction || "No details provided."}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Preventive Action (by HOD):</strong>
                      <p className="p-3 bg-light rounded mt-1">{inv.preventiveAction || "No details provided."}</p>
                    </div>
                    {inv.qualityClassification && (
                      <div className="mt-4 border-top pt-3">
                        <h6 className="text-primary mb-3" style={{ fontWeight: "600" }}>Quality Department Review</h6>
                        <Row className="mb-3">
                          <Col md={3}><strong>Received By:</strong><br />{inv.qualityReceivedBy || "-"}</Col>
                          <Col md={3}><strong>Employee ID:</strong><br />{inv.qualityReceivedSignatureEmpId || "-"}</Col>
                          <Col md={3}><strong>Dept & Designation:</strong><br />{inv.qualityReceivedDeptDesignation || "-"}</Col>
                          <Col md={3}><strong>Received Date & Time:</strong><br />{inv.qualityReceivedDateTime ? dayjs(inv.qualityReceivedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col md={6}><strong>Quality Classification:</strong><br /><Badge bg="info" className="px-2 py-1">{inv.qualityClassification}</Badge></Col>
                          <Col md={6}><strong>Verified By (Quality Head):</strong><br />{inv.qualityVerifiedByHead || "-"}</Col>
                        </Row>
                        {inv.qualityVerifiedDateTime && (
                          <Row className="mb-3">
                            <Col md={12}><strong>Verified Date & Time:</strong><br />{dayjs(inv.qualityVerifiedDateTime).format("DD/MM/YYYY hh:mm A")}</Col>
                          </Row>
                        )}
                        {inv.qualityRemarks && (
                          <div className="mb-3">
                            <strong>Quality Remarks:</strong>
                            <p className="p-3 bg-light rounded mt-1">{inv.qualityRemarks}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              );
            })()
          ) : (
            <Alert variant="info">No Supervisor Investigation or RCA has been submitted yet for this incident report.</Alert>
          )}

          <div className="text-center">
            <StyledButton onClick={() => setViewMode("list")}>Back to List</StyledButton>
          </div>
        </>
      )}

      {viewMode === "edit" && selectedIncident && (
        <>
          <div className="mb-3">
            <BackButton onClick={() => setViewMode("list")}>
              ← Cancel
            </BackButton>
          </div>

          <FormHeader>
            <h2>ROOT CAUSE ANALYSIS (RCA) FORM</h2>
            <span>CONFIDENTIAL • SP Medifort Hospital Quality Department</span>
          </FormHeader>

          {/* Incident Details Overview (Read-Only) */}
          <SectionTitle>
            <FontAwesomeIcon icon={faSearch} /> Incident Overview (Read-Only)
          </SectionTitle>
          {renderAllIncidentDetails(selectedIncident)}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Root Cause Analysis Field */}
            <SectionTitle>
              <FontAwesomeIcon icon={faQuestionCircle} /> Root Cause Analysis (RCA)
            </SectionTitle>
            <Form.Group className="mb-4" controlId="why1">
              <Form.Label>Identify the root cause of the incident:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="why1"
                value={formData.why1}
                onChange={handleInputChange}
                required={userRole === "In-Charge"}
                disabled={userRole !== "In-Charge"}
                placeholder="Describe the root cause analysis..."
              />
            </Form.Group>

            <Row className="mb-4">
              <Col md={3}>
                <Form.Group controlId="investigationName">
                  <Form.Label>Investigator Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="investigationName"
                    value={formData.investigationName}
                    onChange={handleInputChange}
                    required={userRole === "In-Charge"}
                    disabled={userRole !== "In-Charge"}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="investigationSignatureEmpId">
                  <Form.Label>Investigator Emp ID:</Form.Label>
                  <Form.Control
                    type="text"
                    name="investigationSignatureEmpId"
                    value={formData.investigationSignatureEmpId}
                    onChange={handleInputChange}
                    required={userRole === "In-Charge"}
                    disabled={userRole !== "In-Charge"}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="investigationDeptDesignation">
                  <Form.Label>Investigator Dept/Designation:</Form.Label>
                  <Form.Control
                    type="text"
                    name="investigationDeptDesignation"
                    value={formData.investigationDeptDesignation}
                    onChange={handleInputChange}
                    disabled={userRole !== "In-Charge"}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="investigationDate">
                  <Form.Label className="d-block">Date & Time Received:</Form.Label>
                  <DatePicker
                    selected={investigationDate}
                    onChange={(date) => setInvestigationDate(date)}
                    className="form-control"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy h:mm aa"
                    disabled={userRole !== "In-Charge"}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Corrective Action Section */}
            <SectionTitle>
              <FontAwesomeIcon icon={faFileMedical} /> Corrective Action By Department Incharge
            </SectionTitle>
            <Form.Group className="mb-4" controlId="correctiveAction">
              <Form.Label>Corrective Action taken:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="correctiveAction"
                value={formData.correctiveAction}
                onChange={handleInputChange}
                required={userRole === "In-Charge"}
                disabled={userRole !== "In-Charge"}
                placeholder="Immediate fixes applied..."
              />
            </Form.Group>

            {/* Preventive Action Section */}
            <SectionTitle>
              <FontAwesomeIcon icon={faUserTie} /> Preventive Action By Head of the Department
            </SectionTitle>
            <Form.Group className="mb-4" controlId="preventiveAction">
              <Form.Label>Preventive Action plan:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="preventiveAction"
                value={formData.preventiveAction}
                onChange={handleInputChange}
                required={userRole === "In-Charge"}
                disabled={userRole !== "In-Charge"}
                placeholder="Procedures implemented to prevent recurrence..."
              />
            </Form.Group>

            {/* Quality Department Section */}
            <SectionTitle>
              <FontAwesomeIcon icon={faCheckDouble} /> To Be Filled By Quality Department
            </SectionTitle>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="qualityReceivedBy">
                  <Form.Label>Received By (Name):</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualityReceivedBy"
                    value={formData.qualityReceivedBy}
                    onChange={handleInputChange}
                    disabled={userRole !== "Admin"}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="qualityReceivedSignatureEmpId">
                  <Form.Label>Employee ID:</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualityReceivedSignatureEmpId"
                    value={formData.qualityReceivedSignatureEmpId}
                    onChange={handleInputChange}
                    disabled={userRole !== "Admin"}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="qualityReceivedDeptDesignation">
                  <Form.Label>Dept & Designation:</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualityReceivedDeptDesignation"
                    value={formData.qualityReceivedDeptDesignation}
                    onChange={handleInputChange}
                    disabled={userRole !== "Admin"}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="receivedDate">
                  <Form.Label className="d-block">Date & Time Received:</Form.Label>
                  <DatePicker
                    selected={receivedDate}
                    onChange={(date) => setReceivedDate(date)}
                    className="form-control"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy h:mm aa"
                    disabled={userRole !== "Admin"}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="qualityClassification">
                  <Form.Label>Classification of Incident:</Form.Label>
                  <Form.Select
                    name="qualityClassification"
                    value={formData.qualityClassification}
                    onChange={handleInputChange}
                    disabled={userRole !== "Admin"}
                  >
                    <option value="No harm">No harm</option>
                    <option value="Near Miss">Near Miss</option>
                    <option value="Adverse Event">Adverse Event</option>
                    <option value="Sentinel Event">Sentinel Event</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="qualityVerifiedByHead">
                  <Form.Label>Verified By Quality Head (Name):</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualityVerifiedByHead"
                    value={formData.qualityVerifiedByHead}
                    onChange={handleInputChange}
                    disabled={userRole !== "Admin"}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="qualityRemarks">
              <Form.Label>Remarks (if any):</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="qualityRemarks"
                value={formData.qualityRemarks}
                onChange={handleInputChange}
                placeholder="Add quality department review comments..."
                disabled={userRole !== "Admin"}
              />
            </Form.Group>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group controlId="verifiedDate">
                  <Form.Label className="d-block">Verification Date & Time:</Form.Label>
                  <DatePicker
                    selected={verifiedDate}
                    onChange={(date) => setVerifiedDate(date)}
                    className="form-control"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy h:mm aa"
                    disabled={userRole !== "Admin"}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4 d-flex justify-content-center gap-3">
              <BackButton type="button" onClick={() => setViewMode("list")}>
                Cancel
              </BackButton>
              <StyledButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save RCA / Action Plan"}
              </StyledButton>
            </div>

            <Alert variant="success" show={formSubmitted} className="mt-3">
              Supervisor root cause analysis saved successfully!
            </Alert>

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </Form>
        </>
      )}
    </StyledContainer>
  );
};

export default SupervisorInvestigation;

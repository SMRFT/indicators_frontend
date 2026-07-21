import React, { useState, useEffect } from "react";
import { Row, Form, Col, Alert, Card, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock, faExclamationTriangle, faFileAlt, faUserShield, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { message } from "antd";
import apiRequest from "../apiRequest";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 30px;
  max-width: 1200px;
  background: #fdfdfd;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #109b76, #0c7a5d);
  color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  
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
  color: #109b76;
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
  background: #109b76;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 155, 118, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: auto;

  &:hover {
    background: #0c7a5d;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 155, 118, 0.3);
  }

  &:disabled {
    background: #a5d3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: auto;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;


const IncidentReport = () => {
  const navigate = useNavigate();
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [reportedDate, setReportedDate] = useState(new Date());
  const [correctionDate, setCorrectionDate] = useState(new Date());
  
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submittedIncidentId, setSubmittedIncidentId] = useState("");
  
  const [classificationOptions, setClassificationOptions] = useState([]);
  const [classifications, setClassifications] = useState({});
  const [othersText, setOthersText] = useState({});

  const [formData, setFormData] = useState({
    incidentNo: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    personInvolvedType: "Patient",
    personInvolvedOthersDetails: "",
    patientName: "",
    patientAgeSex: "",
    patientUhid: "",
    patientDoctor: "",
    employeeName: "",
    employeeAgeSex: "",
    employeeDept: "",
    instrumentToolsDetails: "",
    mrNo: "",
    designation: "",
    idNo: "",
    descriptionOfIncident: "",
    reportedBy: "",
    reportedByDesignation: "",
    reportedBySignature: "",
    reportedByEmpId: "",
    reportedByDateTime: "",
    witnessName: "",
    immediateCorrection: "",
    correctionName: "",
    correctionDesignation: "",
    correctionSignature: "",
    correctionEmpId: "",
    correctionDateTime: ""
  });

  useEffect(() => {
    const ID = localStorage.getItem("userId") || "";
    const name = localStorage.getItem("userName") || "";
    const userRole = localStorage.getItem("userRole") || "";
    
    if (userRole === "In-Charge") {
      alert("In-Charge users are not authorized to fill Incident Reports.");
      navigate("/IncidentDashboard");
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      reportedBy: name,
      reportedByEmpId: ID,
      reportedByDesignation: userRole,
      reportedByDateTime: new Date().toLocaleString()
    }));
  }, [navigate]);

  useEffect(() => {
    const fetchNextIncidentNo = async () => {
      try {
        const response = await apiRequest(`${IndicatorBaseUrl}get-next-incident-no/`);
        if (response.success) {
          setFormData((prev) => ({
            ...prev,
            incidentNo: response.data.nextIncidentNo
          }));
        }
      } catch (err) {
        console.error("Error fetching next incident no:", err);
      }
    };
    fetchNextIncidentNo();
  }, [IndicatorBaseUrl]);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const response = await apiRequest(`${IndicatorBaseUrl}IncidentClassification/`);
        if (response.success) {
          const data = response.data;
          setClassificationOptions(data);
          const initialChecked = {};
          const initialOthers = {};
          data.forEach(cls => {
            initialChecked[cls.title] = [];
            initialOthers[cls.title] = "";
          });
          setClassifications(initialChecked);
          setOthersText(initialOthers);
        }
      } catch (err) {
        console.error("Error fetching classifications:", err);
      }
    };
    fetchClassifications();
  }, [IndicatorBaseUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category, item, checked) => {
    setClassifications((prev) => {
      const selected = prev[category] ? [...prev[category]] : [];
      if (checked) {
        selected.push(item);
      } else {
        const index = selected.indexOf(item);
        if (index !== -1) selected.splice(index, 1);
      }
      return { ...prev, [category]: selected };
    });
  };

  const handleOthersTextChange = (category, value) => {
    setOthersText((prev) => ({ ...prev, [category]: value }));
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
      // Merge other texts into classifications
      const finalClassifications = {};
      Object.keys(classifications).forEach((key) => {
        const items = [...classifications[key]];
        if (othersText[key]) {
          items.push(`Others: ${othersText[key]}`);
        }
        finalClassifications[key] = items;
      });

      const submissionData = {
        ...formData,
        incidentDate: incidentDate ? incidentDate.toISOString().split("T")[0] : "",
        reportedByDateTime: reportedDate ? reportedDate.toISOString() : "",
        correctionDateTime: correctionDate ? correctionDate.toISOString() : "",
        classifications: finalClassifications,
        "auth-user-id": localStorage.getItem("userId")
      };

      const response = await apiRequest(`${IndicatorBaseUrl}IncidentReport/`, "POST", submissionData);

      if (!response.success) {
        throw new Error(response.error || "Failed to submit Incident Report");
      }

      const resData = response.data;
      const nextNo = resData.incidentNo || resData.id || "";
      setSubmittedIncidentId(nextNo);
      message.success(`Incident Form submitted successfully! Incident No: ${nextNo}`);
      setFormSubmitted(true);
      setTimeout(() => {
        navigate("/IncidentDashboard");
      }, 5000);
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to submit the form.");
      setError(err.message || "Failed to submit the form.");
      setIsSubmitting(false);
    }
  };

  return (
    <StyledContainer>
      <div className="d-flex justify-content-start mb-3">
        <BackButton type="button" onClick={() => navigate("/IncidentDashboard")}>
          ← Back
        </BackButton>
      </div>
      <FormHeader>
        <h2>INCIDENT FORM</h2>
        <span>CONFIDENTIAL • Shanmuga Hospital Quality Department</span>
      </FormHeader>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        
        {/* Incident Details Section */}
        <SectionTitle>
          <FontAwesomeIcon icon={faExclamationTriangle} /> Incident Details
        </SectionTitle>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group controlId="incidentNo">
              <Form.Label>Incident No:</Form.Label>
              <Form.Control
                type="text"
                name="incidentNo"
                value={formData.incidentNo || "Auto-generated"}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="incidentDate">
              <Form.Label className="d-block">Incident Date:</Form.Label>
              <div className="d-flex align-items-center">
                <DatePicker
                  selected={incidentDate}
                  onChange={(date) => setIncidentDate(date)}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="incidentTime">
              <Form.Label>Incident Time:</Form.Label>
              <Form.Control
                type="text"
                name="incidentTime"
                value={formData.incidentTime}
                onChange={handleInputChange}
                placeholder="e.g. 10:30 AM"
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="incidentLocation">
              <Form.Label>Incident Location/Dept:</Form.Label>
              <Form.Control
                type="text"
                name="incidentLocation"
                value={formData.incidentLocation}
                onChange={handleInputChange}
                placeholder="e.g. ICU / Ground Floor Ward"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Person Involved Section */}
        <SectionTitle>
          <FontAwesomeIcon icon={faUserShield} /> Details of Person Involved
        </SectionTitle>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="personInvolvedType">
              <Form.Label>Person Involved Type:</Form.Label>
              <Form.Select
                name="personInvolvedType"
                value={formData.personInvolvedType}
                onChange={handleInputChange}
              >
                <option value="Patient">Patient</option>
                <option value="Employee">Employee</option>
                <option value="Materials/Equipment">Materials/Equipment</option>
                <option value="Others">Others</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {formData.personInvolvedType === "Patient" && (
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group controlId="patientName">
                <Form.Label>Patient Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Patient Name (optional)"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="patientAgeSex">
                <Form.Label>Age / Sex:</Form.Label>
                <Form.Control
                  type="text"
                  name="patientAgeSex"
                  value={formData.patientAgeSex}
                  onChange={handleInputChange}
                  placeholder="Age / Sex (optional)"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="patientUhid">
                <Form.Label>UHID:</Form.Label>
                <Form.Control
                  type="text"
                  name="patientUhid"
                  value={formData.patientUhid}
                  onChange={handleInputChange}
                  placeholder="UHID (optional)"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="patientDoctor">
                <Form.Label>Doctor:</Form.Label>
                <Form.Control
                  type="text"
                  name="patientDoctor"
                  value={formData.patientDoctor}
                  onChange={handleInputChange}
                  placeholder="Doctor (optional)"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {formData.personInvolvedType === "Employee" && (
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group controlId="employeeName">
                <Form.Label>Employee Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  placeholder="Employee Name (optional)"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="employeeAgeSex">
                <Form.Label>Age / Sex:</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeAgeSex"
                  value={formData.employeeAgeSex}
                  onChange={handleInputChange}
                  placeholder="Age / Sex (optional)"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="idNo">
                <Form.Label>Employee ID:</Form.Label>
                <Form.Control
                  type="text"
                  name="idNo"
                  value={formData.idNo}
                  onChange={handleInputChange}
                  placeholder="Employee ID (optional)"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="employeeDept">
                <Form.Label>Department:</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeDept"
                  value={formData.employeeDept}
                  onChange={handleInputChange}
                  placeholder="Department (optional)"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {formData.personInvolvedType === "Instrument/Tools" && (
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="instrumentToolsDetails">
                <Form.Label>Instrument/Tools Details:</Form.Label>
                <Form.Control
                  type="text"
                  name="instrumentToolsDetails"
                  value={formData.instrumentToolsDetails}
                  onChange={handleInputChange}
                  placeholder="Instrument/Tools Details (optional)"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {formData.personInvolvedType === "Others" && (
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="personInvolvedOthersDetails">
                <Form.Label>Specify Details (if Others):</Form.Label>
                <Form.Control
                  type="text"
                  name="personInvolvedOthersDetails"
                  value={formData.personInvolvedOthersDetails}
                  onChange={handleInputChange}
                  placeholder="Visitor, Contractor, etc. (optional)"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* Classification Sections */}
        <SectionTitle>
          <FontAwesomeIcon icon={faFileAlt} /> Classification of Incidents
        </SectionTitle>
        <p className="text-muted">Please tick the appropriate boxes below:</p>

        <Accordion defaultActiveKey="0" className="mb-4">
          {classificationOptions.map((cls, index) => {
            const key = cls.title;
            return (
              <Accordion.Item eventKey={String(index)} key={cls.id}>
                <Accordion.Header>
                  <strong>{cls.title}</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <CheckboxGrid>
                    {(cls.items || []).map((item) => (
                      <Form.Check
                        key={item}
                        type="checkbox"
                        label={item}
                        checked={classifications[key] ? classifications[key].includes(item) : false}
                        onChange={(e) => handleCheckboxChange(key, item, e.target.checked)}
                      />
                    ))}
                  </CheckboxGrid>
                  <Form.Group className="mt-3" controlId={`others-${cls.id}`}>
                    <Form.Label>Others (Specify):</Form.Label>
                    <Form.Control
                      type="text"
                      value={othersText[key] || ""}
                      onChange={(e) => handleOthersTextChange(key, e.target.value)}
                      placeholder="Add any other details..."
                    />
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>

        {/* Description Section */}
        <SectionTitle>
          <FontAwesomeIcon icon={faFileAlt} /> Description of Incident
        </SectionTitle>
        <Form.Group className="mb-3" controlId="descriptionOfIncident">
          <Form.Label>Provide detailed description of what occurred:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="descriptionOfIncident"
            value={formData.descriptionOfIncident}
            onChange={handleInputChange}
            placeholder="Type incident description here..."
            required
          />
        </Form.Group>

        {/* Reporter details */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group controlId="reportedBy">
              <Form.Label>Reported By (Name):</Form.Label>
              <Form.Control
                type="text"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleInputChange}
                disabled={true}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="reportedByDesignation">
              <Form.Label>Designation/Dept:</Form.Label>
              <Form.Control
                type="text"
                name="reportedByDesignation"
                value={formData.reportedByDesignation}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="reportedByEmpId">
              <Form.Label>EMP ID:</Form.Label>
              <Form.Control
                type="text"
                name="reportedByEmpId"
                value={formData.reportedByEmpId}
                onChange={handleInputChange}
                disabled={true}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="reportedByDateTime">
              <Form.Label className="d-block">Date & Time Reported:</Form.Label>
              <DatePicker
                selected={reportedDate}
                onChange={(date) => setReportedDate(date)}
                className="form-control"
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                required
                disabled={true}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="witnessName">
              <Form.Label>Witness Name(s) (if any):</Form.Label>
              <Form.Control
                type="text"
                name="witnessName"
                value={formData.witnessName}
                onChange={handleInputChange}
                placeholder="Separate names with commas"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Immediate Correction Section */}
        <SectionTitle>
          <FontAwesomeIcon icon={faUserShield} /> Immediate Correction
        </SectionTitle>
        <Form.Group className="mb-3" controlId="immediateCorrection">
          <Form.Label>Action taken immediately to correct or control the incident:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="immediateCorrection"
            value={formData.immediateCorrection}
            onChange={handleInputChange}
            placeholder="Type immediate correction here..."
          />
        </Form.Group>

        <Row className="mb-4">
          <Col md={3}>
            <Form.Group controlId="correctionName">
              <Form.Label>Action Taken By (Name):</Form.Label>
              <Form.Control
                type="text"
                name="correctionName"
                value={formData.correctionName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="correctionDesignation">
              <Form.Label>Designation/Dept:</Form.Label>
              <Form.Control
                type="text"
                name="correctionDesignation"
                value={formData.correctionDesignation}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="correctionEmpId">
              <Form.Label>EMP ID:</Form.Label>
              <Form.Control
                type="text"
                name="correctionEmpId"
                value={formData.correctionEmpId}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="correctionDateTime">
              <Form.Label className="d-block">Date & Time Actioned:</Form.Label>
              <DatePicker
                selected={correctionDate}
                onChange={(date) => setCorrectionDate(date)}
                className="form-control"
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center mt-4 d-flex justify-content-center gap-3">
          <BackButton type="button" onClick={() => navigate("/IncidentDashboard")}>
            Back
          </BackButton>
          <StyledButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Submit Incident Form"}
          </StyledButton>
        </div>

        <Alert variant="success" show={formSubmitted} className="mt-3">
          Incident Form submitted successfully! Generated Incident ID: <strong>{submittedIncidentId}</strong>. Redirecting to dashboard...
        </Alert>

        <Alert variant="danger" show={error !== ""} className="mt-3">
          {error}
        </Alert>
      </Form>
    </StyledContainer>
  );
};

export default IncidentReport;

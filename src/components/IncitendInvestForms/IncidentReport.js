import React, { useState, useEffect } from "react";
import { Row, Form, Col, Card, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faExclamationTriangle, faFileAlt, faUserShield, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { message } from "antd";
import apiRequest from "../apiRequest";
import { FormCard, TextField, TextAreaField, SelectField, DateField, SubmitButton, FormAlert } from "../Common/fields";

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

const StyledAccordion = styled(Accordion)`
  .accordion-item {
    background-color: var(--color-surface, #ffffff);
    color: var(--color-text-primary, #0f172a);
    border: 1px solid var(--color-border, #e2e8f0);
    margin-bottom: 8px;
    border-radius: 8px !important;
    overflow: hidden;
  }

  .accordion-button {
    background-color: var(--color-surface-raised, #f8fafc);
    color: var(--color-text-primary, #0f172a);
    font-weight: 600;
    font-size: 15px;
    box-shadow: none !important;

    &:not(.collapsed) {
      background-color: var(--color-surface-raised, #f1f5f9);
      color: var(--color-accent, #109b76);
    }

    &::after {
      filter: var(--color-icon-filter, none);
    }
  }

  .accordion-body {
    background-color: var(--color-surface, #ffffff);
    color: var(--color-text-primary, #0f172a);
    padding: 16px;
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  padding: 14px;
  background: var(--color-surface-raised, #f8fafc);
  border-radius: 8px;
  border: 1px solid var(--color-border, #e2e8f0);
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  background: ${props => props.checked ? "var(--color-surface-selected, rgba(16, 155, 118, 0.12))" : "var(--color-surface, #ffffff)"};
  border: 1px solid ${props => props.checked ? "var(--color-accent, #109b76)" : "var(--color-border, #e2e8f0)"};
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-accent, #109b76);
    background: var(--color-hover-overlay, rgba(16, 155, 118, 0.06));
  }

  .form-check {
    margin-bottom: 0;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-check-input {
    cursor: pointer;
    width: 18px;
    height: 18px;
    margin-top: 0;
    flex-shrink: 0;
  }

  .form-check-label {
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary, #0f172a);
    width: 100%;
    margin-bottom: 0;
  }
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
    <FormCard>
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
              <TextField
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
                <DateField
                  selected={incidentDate}
                  onChange={(date) => setIncidentDate(date)}
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="incidentTime">
              <Form.Label>Incident Time:</Form.Label>
              <TextField
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
              <TextField
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
              <SelectField
                name="personInvolvedType"
                value={formData.personInvolvedType}
                onChange={handleInputChange}
              >
                <option value="Patient">Patient</option>
                <option value="Employee">Employee</option>
                <option value="Materials/Equipment">Materials/Equipment</option>
                <option value="Others">Others</option>
              </SelectField>
            </Form.Group>
          </Col>
        </Row>

        {formData.personInvolvedType === "Patient" && (
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group controlId="patientName">
                <Form.Label>Patient Name:</Form.Label>
                <TextField
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
                <TextField
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
                <TextField
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
                <TextField
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
                <TextField
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
                <TextField
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
                <TextField
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
                <TextField
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
                <TextField
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
                <TextField
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
        <p style={{ color: "var(--color-text-secondary, #64748b)", fontSize: "14px" }}>
          Please tick the appropriate boxes below (click anywhere on an item or text to select):
        </p>

        <StyledAccordion defaultActiveKey="0" className="mb-4">
          {classificationOptions.map((cls, index) => {
            const key = cls.title;
            return (
              <Accordion.Item eventKey={String(index)} key={cls.id}>
                <Accordion.Header>
                  <strong>{cls.title}</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <CheckboxGrid>
                    {(cls.items || []).map((item, itemIdx) => {
                      const isChecked = classifications[key] ? classifications[key].includes(item) : false;
                      const checkId = `chk-${cls.id}-${itemIdx}`;
                      return (
                        <CheckboxItem
                          key={item}
                          checked={isChecked}
                          onClick={() => handleCheckboxChange(key, item, !isChecked)}
                        >
                          <Form.Check
                            type="checkbox"
                            id={checkId}
                            label={item}
                            checked={isChecked}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange(key, item, e.target.checked);
                            }}
                          />
                        </CheckboxItem>
                      );
                    })}
                  </CheckboxGrid>
                  <Form.Group className="mt-3" controlId={`others-${cls.id}`}>
                    <Form.Label style={{ fontWeight: "600" }}>Others (Specify):</Form.Label>
                    <TextField
                      value={othersText[key] || ""}
                      onChange={(e) => handleOthersTextChange(key, e.target.value)}
                      placeholder="Add any other details..."
                    />
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </StyledAccordion>

        {/* Description Section */}
        <SectionTitle>
          <FontAwesomeIcon icon={faFileAlt} /> Description of Incident
        </SectionTitle>
        <Form.Group className="mb-3" controlId="descriptionOfIncident">
          <Form.Label>Provide detailed description of what occurred:</Form.Label>
          <TextAreaField
            rows={6}
            style={{ width: "100%", minHeight: "150px" }}
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
              <TextField
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
              <TextField
                name="reportedByDesignation"
                value={formData.reportedByDesignation}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="reportedByEmpId">
              <Form.Label>EMP ID:</Form.Label>
              <TextField
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
              <DateField
                selected={reportedDate}
                onChange={(date) => setReportedDate(date)}
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
              <TextField
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
          <TextAreaField
            rows={5}
            style={{ width: "100%", minHeight: "130px" }}
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
              <TextField
                name="correctionName"
                value={formData.correctionName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="correctionDesignation">
              <Form.Label>Designation/Dept:</Form.Label>
              <TextField
                name="correctionDesignation"
                value={formData.correctionDesignation}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="correctionEmpId">
              <Form.Label>EMP ID:</Form.Label>
              <TextField
                name="correctionEmpId"
                value={formData.correctionEmpId}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="correctionDateTime">
              <Form.Label className="d-block">Date & Time Actioned:</Form.Label>
              <DateField
                selected={correctionDate}
                onChange={(date) => setCorrectionDate(date)}
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
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Submit Form"}
          </SubmitButton>
        </div>

        <FormAlert variant="success" show={formSubmitted} className="mt-3">
          Incident Form submitted successfully! Generated Incident ID: <strong>{submittedIncidentId}</strong>. Redirecting to dashboard...
        </FormAlert>

        <FormAlert variant="danger" show={error !== ""} className="mt-3">
          {error}
        </FormAlert>
      </Form>
    </FormCard>
  );
};

export default IncidentReport;

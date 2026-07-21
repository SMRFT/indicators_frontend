import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import apiRequest from "../apiRequest";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const MAX_CHAR_LIMIT = 5000;

const GenericWardForm = ({ title, endpoint, fields }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Initialize form state dynamically from fields schema
  const getInitialState = () => {
    const state = {
      id: "",
      name: "",
      selectedDate: "",
    };
    fields.forEach((field) => {
      if (field.isDynamicTable) {
        state[field.id] = "";
        if (field.id === "numberOfUnitsTransfused") {
          state.numberOfUnitsTransfusedRemarks = {};
        } else if (field.id === "totalIVLineChanges") {
          state.ivLineChangeRemarks = {};
        } else if (field.id === "numberOfRestrainedPatients") {
          state.restrainedPatientsDetails = {};
        }
      } else {
        state[field.id] = "";
        if (field.remarksId) {
          state[field.remarksId] = "";
        }
      }
    });
    return state;
  };

  const [formData, setFormData] = useState(getInitialState);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  // Retrieve user credentials
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    if (id && name) {
      setFormData((prev) => ({ ...prev, id, name }));
    }
  }, []);

  // Update selected date string
  useEffect(() => {
    if (selectedDate) {
      const adjustedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      setFormData((prev) => ({
        ...prev,
        selectedDate: adjustedDate.toISOString().split("T")[0],
      }));
    }
  }, [selectedDate]);

  // Alert message auto-clear
  useEffect(() => {
    let errorTimeout;
    if (error) {
      errorTimeout = setTimeout(() => {
        setError("");
      }, 3000);
    }
    return () => clearTimeout(errorTimeout);
  }, [error]);

  // Standard input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (value.length > MAX_CHAR_LIMIT) {
      setError(`Ensure this value has at most ${MAX_CHAR_LIMIT} characters.`);
      return;
    }

    if (id.includes("transfused") || id.includes("remarks")) {
      setFormData((prev) => ({
        ...prev,
        numberOfUnitsTransfusedRemarks: {
          ...prev.numberOfUnitsTransfusedRemarks,
          [id]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Restraint dynamic table number input change
  const handleRestraintNumberChange = (e) => {
    const num = parseInt(e.target.value, 10) || 0;
    const newDetails = {};
    for (let i = 0; i < num; i++) {
      const key = `restrained-${i}`;
      newDetails[key] = formData.restrainedPatientsDetails[key] || {
        type: "",
        remark: "",
      };
    }
    setFormData((prev) => ({
      ...prev,
      numberOfRestrainedPatients: num,
      restrainedPatientsDetails: newDetails,
    }));
  };

  // Restraint dynamic fields detail change
  const handleRestraintDetailChange = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      restrainedPatientsDetails: {
        ...prev.restrainedPatientsDetails,
        [key]: {
          ...prev.restrainedPatientsDetails[key],
          [field]: value,
        },
      },
    }));
  };

  // IV Line dynamic table field change
  const handleivlineChange = (e) => {
    const { id, value } = e.target;
    if (value.length > MAX_CHAR_LIMIT) {
      setError(`Ensure this value has at most ${MAX_CHAR_LIMIT} characters.`);
      return;
    }

    if (id.includes("ExtravasationVIPScore")) {
      setFormData((prev) => ({
        ...prev,
        ivLineChangeRemarks: {
          ...prev.ivLineChangeRemarks,
          [id]: value,
        },
      }));
    } else {
      // Handles the main number input (totalIVLineChanges)
      setFormData((prev) => ({ ...prev, [id]: parseInt(value, 10) || 0 }));
    }
  };

  // Submission handler using apiRequest
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;

    if (!selectedDate) {
      setError("Please select a date");
      setIsSubmitting(false);
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setIsSubmitting(false);
    } else {
      try {
        const id = localStorage.getItem("userId");
        const name = localStorage.getItem("userName");
        const formDataWithUser = { ...formData, id, name };

        const response = await apiRequest(`${IndicatorBaseUrl}${endpoint}`, "POST", formDataWithUser);

        if (!response.success) {
          if (response.error === "Data already exists for this date.") {
            setError("Data already exists for this date.");
          } else {
            throw new Error(response.error || "Failed to submit data");
          }
          setIsSubmitting(false);
        } else {
          setFormSubmitted(true);
          setError("");
          setTimeout(() => setIsSubmitting(false), 3000);
        }
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message || "Failed to submit data");
        setIsSubmitting(false);
      }
    }
    setValidated(true);
  };

  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">{title}</h2>
      <div style={{ float: "right" }} className="mt-3">
        <div>
          <b>ID: </b> {formData.id}
        </div>
        <div>
          <b>Name: </b> {formData.name}
        </div>
      </div>
      <br />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="position-relative mb-3" controlId="selectedDate">
          <div className="position-relative">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "#6c757d",
              }}
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="form-control"
              placeholderText="Select Date"
              style={{ paddingLeft: "35px" }}
              required
            />
          </div>
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}
        {formSubmitted && <Alert variant="success">Submitted successfully!</Alert>}

        {fields.map((field) => {
          // 1. Dynamic Table - Restraint Patients
          if (field.isDynamicTable === "restraint") {
            return (
              <React.Fragment key={field.id}>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group controlId={field.id}>
                      <Form.Label>{field.label}</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={formData[field.id]}
                        onChange={handleRestraintNumberChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {Object.entries(formData.restrainedPatientsDetails || {}).map(([key, detail], index) => (
                  <Row className="mb-3 border p-3 rounded" key={key}>
                    <h5 className="mb-3">Patient {index + 1}</h5>
                    <Col md={6}>
                      <Form.Group controlId={`restrainedPatientType-${key}`}>
                        <Form.Label>Type of Restraint</Form.Label>
                        <Form.Select
                          value={detail.type || ""}
                          onChange={(e) => handleRestraintDetailChange(key, "type", e.target.value)}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="chemical">Chemical</option>
                          <option value="physical">Physical</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`restrainedPatientRemark-${key}`}>
                        <Form.Label>Remark</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={1}
                          value={detail.remark || ""}
                          onChange={(e) => handleRestraintDetailChange(key, "remark", e.target.value)}
                          required
                          maxLength={MAX_CHAR_LIMIT}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                ))}
              </React.Fragment>
            );
          }

          // 2. Dynamic Table - Units Transfused
          if (field.isDynamicTable === "transfusion") {
            return (
              <React.Fragment key={field.id}>
                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId={field.id}>
                      <Form.Label>{field.label}</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData[field.id]}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {Array.from({ length: parseInt(formData[field.id], 10) || 0 }).map((_, index) => (
                  <Row className="mb-3" key={index}>
                    <Col>
                      <Form.Group controlId={`transfused-${index}`}>
                        <Form.Label>{`Units Transfused ${index + 1}`}</Form.Label>
                        <Form.Control
                          required
                          as="textarea"
                          rows={1}
                          value={formData.numberOfUnitsTransfusedRemarks[`transfused-${index}`] || ""}
                          onChange={handleChange}
                          maxLength={MAX_CHAR_LIMIT}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId={`transfused-remarks-${index}`}>
                        <Form.Label>{`Remarks ${index + 1}`}</Form.Label>
                        <Form.Control
                          required
                          as="textarea"
                          rows={1}
                          value={formData.numberOfUnitsTransfusedRemarks[`transfused-remarks-${index}`] || ""}
                          onChange={handleChange}
                          maxLength={MAX_CHAR_LIMIT}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                ))}
              </React.Fragment>
            );
          }

          // 3. Dynamic Table - IV Line Changes
          if (field.isDynamicTable === "ivline") {
            return (
              <React.Fragment key={field.id}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId={field.id}>
                      <Form.Label>{field.label}</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={formData[field.id]}
                        onChange={handleivlineChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {Array.from({ length: formData[field.id] || 0 }).map((_, index) => (
                  <Row className="mb-3" key={index}>
                    <Col md={6}>
                      <Form.Group controlId={`ExtravasationVIPScore-${index}`}>
                        <Form.Label>{`Extravasation VIP Score ${index + 1}`}</Form.Label>
                        <Form.Select
                          required
                          value={formData.ivLineChangeRemarks[`ExtravasationVIPScore-${index}`] || ""}
                          onChange={handleivlineChange}
                        >
                          <option value="">Select Type</option>
                          <option value="1">A (1)</option>
                          <option value="2">B (2)</option>
                          <option value="3">C (3)</option>
                          <option value="4">D (4)</option>
                          <option value="5">E (5)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`ExtravasationVIPScoreRemarks-${index}`}>
                        <Form.Label>{`Remarks ${index + 1}`}</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={1}
                          required
                          maxLength={MAX_CHAR_LIMIT}
                          value={formData.ivLineChangeRemarks[`ExtravasationVIPScoreRemarks-${index}`] || ""}
                          onChange={handleivlineChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                ))}
              </React.Fragment>
            );
          }

          // 4. Standard Field with a side-by-side Remarks Field
          if (field.remarksId) {
            return (
              <Row className="mb-3" key={field.id}>
                <Col>
                  <Form.Group controlId={field.id}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData[field.id]}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId={field.remarksId}>
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      required
                      as="textarea"
                      rows={1}
                      value={formData[field.remarksId]}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            );
          }

          // 5. Normal Field without Remarks
          return (
            <Row className="mb-3" key={field.id}>
              <Col>
                <Form.Group controlId={field.id}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData[field.id]}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          );
        })}

        <div className="text-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Form>
    </StyledContainer>
  );
};

export default GenericWardForm;

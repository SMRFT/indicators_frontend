import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { message } from "antd";
import apiRequest from "../apiRequest";
import {
  FormCard,
  TextField,
  TextAreaField,
  NumberField,
  SelectField,
  DateField,
  SubmitButton,
  FormAlert,
} from "./fields";

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
        // Initialize count fields to 0 (not empty string) so number inputs are always valid
        state[field.id] = 0;
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
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedDate: "",
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
      const msg = `Ensure this value has at most ${MAX_CHAR_LIMIT} characters.`;
      setError(msg);
      message.error(msg);
      return;
    }

    if (id && id.startsWith("transfused-")) {
      setFormData((prev) => ({
        ...prev,
        numberOfUnitsTransfusedRemarks: {
          ...prev.numberOfUnitsTransfusedRemarks,
          [id]: value,
        },
      }));
    } else if (id) {
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
      const msg = `Ensure this value has at most ${MAX_CHAR_LIMIT} characters.`;
      setError(msg);
      message.error(msg);
      return;
    }

    if (id && id.startsWith("ExtravasationVIPScore")) {
      setFormData((prev) => ({
        ...prev,
        ivLineChangeRemarks: {
          ...prev.ivLineChangeRemarks,
          [id]: value,
        },
      }));
    } else if (id) {
      // Handles the main number input (totalIVLineChanges)
      setFormData((prev) => ({ ...prev, [id]: parseInt(value, 10) || 0 }));
    }
  };

  // Submission handler using apiRequest
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedDate) {
      const msg = "Please select a date";
      setError(msg);
      message.error(msg);
      setIsSubmitting(false);
      return;
    }

    try {
      const id = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");

      // Stringify nested object fields — backend stores them as CharField JSON strings
      const formDataWithUser = {
        ...formData,
        id,
        name,
        numberOfUnitsTransfusedRemarks: JSON.stringify(formData.numberOfUnitsTransfusedRemarks || {}),
        ivLineChangeRemarks: JSON.stringify(formData.ivLineChangeRemarks || {}),
        restrainedPatientsDetails: JSON.stringify(formData.restrainedPatientsDetails || {}),
      };

      const response = await apiRequest(`${IndicatorBaseUrl}${endpoint}`, "POST", formDataWithUser);

      if (!response || !response.success) {
        const rawErr = response?.error;
        const errMsg = typeof rawErr === "string" ? rawErr : (rawErr ? JSON.stringify(rawErr) : "Failed to submit data");
        setError(errMsg);
        message.error(errMsg);
        setIsSubmitting(false);
      } else {
        message.success("Submitted successfully!");
        setFormSubmitted(true);
        setError("");
        setSelectedDate(null);
        setFormData({
          ...getInitialState(),
          id,
          name,
        });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error:", err?.message || err);
      const errMsg = err?.message || "Failed to submit data";
      setError(errMsg);
      message.error(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard className="NumericalData">
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
          <DateField
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </Form.Group>

        {error && <FormAlert variant="danger">{error}</FormAlert>}
        {formSubmitted && <FormAlert variant="success">Submitted successfully!</FormAlert>}

        {fields.map((field) => {
          // 1. Dynamic Table - Restraint Patients
          if (field.isDynamicTable === "restraint") {
            return (
              <React.Fragment key={field.id}>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group controlId={field.id}>
                      <Form.Label>{field.label}</Form.Label>
                      <NumberField
                        id={field.id}
                        min="0"
                        value={formData[field.id]}
                        onChange={handleRestraintNumberChange}
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
                        <SelectField
                          id={`restrainedPatientType-${key}`}
                          value={detail.type || ""}
                          onChange={(e) => handleRestraintDetailChange(key, "type", e.target.value)}
                        >
                          <option value="">Select Type</option>
                          <option value="chemical">Chemical</option>
                          <option value="physical">Physical</option>
                        </SelectField>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`restrainedPatientRemark-${key}`}>
                        <Form.Label>Remark</Form.Label>
                        <TextAreaField
                          id={`restrainedPatientRemark-${key}`}
                          rows={1}
                          value={detail.remark || ""}
                          onChange={(e) => handleRestraintDetailChange(key, "remark", e.target.value)}
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
                      <TextField
                        id={field.id}
                        type="text"
                        value={formData[field.id]}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {Array.from({ length: parseInt(formData[field.id], 10) || 0 }).map((_, index) => (
                  <Row className="mb-3" key={index}>
                    <Col>
                      <Form.Group controlId={`transfused-${index}`}>
                        <Form.Label>{`Units Transfused ${index + 1}`}</Form.Label>
                        <TextAreaField
                          id={`transfused-${index}`}
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
                        <TextAreaField
                          id={`transfused-remarks-${index}`}
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
                      <NumberField
                        id={field.id}
                        min="0"
                        value={formData[field.id]}
                        onChange={handleivlineChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {Array.from({ length: formData[field.id] || 0 }).map((_, index) => (
                  <Row className="mb-3" key={index}>
                    <Col md={6}>
                      <Form.Group controlId={`ExtravasationVIPScore-${index}`}>
                        <Form.Label>{`Extravasation VIP Score ${index + 1}`}</Form.Label>
                        <SelectField
                          id={`ExtravasationVIPScore-${index}`}
                          value={formData.ivLineChangeRemarks[`ExtravasationVIPScore-${index}`] || ""}
                          onChange={handleivlineChange}
                        >
                          <option value="">Select Type</option>
                          <option value="1">A (1)</option>
                          <option value="2">B (2)</option>
                          <option value="3">C (3)</option>
                          <option value="4">D (4)</option>
                          <option value="5">E (5)</option>
                        </SelectField>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`ExtravasationVIPScoreRemarks-${index}`}>
                        <Form.Label>{`Remarks ${index + 1}`}</Form.Label>
                        <TextAreaField
                          id={`ExtravasationVIPScoreRemarks-${index}`}
                          rows={1}
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
                    <TextField
                      id={field.id}
                      type="text"
                      value={formData[field.id]}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId={field.remarksId}>
                    <Form.Label>Remarks</Form.Label>
                    <TextAreaField
                      id={field.remarksId}
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
                  <TextField
                    id={field.id}
                    type="text"
                    value={formData[field.id]}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          );
        })}

        <div className="text-center">
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </SubmitButton>
        </div>
      </Form>
    </FormCard>
  );
};

export default GenericWardForm;

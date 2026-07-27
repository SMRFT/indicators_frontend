import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { message } from "antd";
import apiRequest from "../apiRequest";
import { FormCard, TextField, TextAreaField, SubmitButton, FormAlert, DateField } from "../Common/fields";

function MRDForm() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    selectedDate: "",
    numberOfMedicalRecords: "",
    numberOfMedicalRecordsRemarks: "",
    numberOfDischarge: "",
    numberOfDeath: "",
    numberOfDeathRemarks: "",
  });

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    if (id && name) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id, // Updated field
        name, // Updated field
      }));
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      // Adjust date to UTC
      const adjustedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedDate: adjustedDate.toISOString().split("T")[0],
      }));
    }
  }, [selectedDate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ add this state at top

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Prevent multiple submissions
    if (isSubmitting) return; // ✅ added
    setIsSubmitting(true); // ✅ disable button immediately

    // Check if the date is selected
    if (!selectedDate) {
      message.warning("Please select a date.");
      setError("Please select a date");
      setIsSubmitting(false); // ✅ re-enable if validation fails
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
      message.warning("Please fill out all required fields.");
      setIsSubmitting(false); // ✅ re-enable if invalid form
    } else {
      try {
        const id = localStorage.getItem("userId");
        const name = localStorage.getItem("userName");
        const formDataWithUser = {
          ...formData,
          id,
          name,
        };
        const response = await apiRequest(`${IndicatorBaseUrl}MRD/`, "POST", formDataWithUser);

        if (!response.success) {
          const errMsg = response.error || "Failed to submit data";
          message.error(errMsg);
          setError(errMsg);
        } else {
          message.success("MRD data submitted successfully!");
          setFormSubmitted(true);
          setError("");
        }
      } catch (error) {
        console.error("Error:", error.message);
        const errMsg = error.message || "Failed to submit data";
        message.error(errMsg);
        setError(errMsg);
      } finally {
        // ✅ Re-enable after 3 seconds
        setTimeout(() => setIsSubmitting(false), 3000);
      }
    }

    setValidated(true);
  };


  return (
    <FormCard className="NumericalData">
      <h2 className="text-center">MRD</h2>
      <div style={{ float: "right" }} className="mt-3">
        <div>
          <b>ID: </b>
          {formData.id}
        </div>
        <div>
          <b>Name: </b>
          {formData.name}
        </div>
      </div>
      <br />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col sm="12">
            <Form.Group className="position-relative" controlId="selectedDate">
              <DateField
                id="datePicker"
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select Date"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfMedicalRecords">
              <Form.Label>
                Number of Medical Records having Incomplete and /or Improper
                Consent{" "}
              </Form.Label>
              <TextField
                id="numberOfMedicalRecords"
                required
                value={formData.numberOfMedicalRecords}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfMedicalRecordsRemarks">
              <Form.Label>Remarks</Form.Label>
              <TextAreaField
                id="numberOfMedicalRecordsRemarks"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfMedicalRecordsRemarks}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent form submission if applicable
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfDischarge">
              <Form.Label>Number of discharge</Form.Label>
              <TextField
                id="numberOfDischarge"
                required
                value={formData.numberOfDischarge}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfDeath">
              <Form.Label>Number of death</Form.Label>
              <TextField
                id="numberOfDeath"
                required
                value={formData.numberOfDeath}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfDeathRemarks">
              <Form.Label>Remarks</Form.Label>
              <TextAreaField
                id="numberOfDeathRemarks"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfDeathRemarks}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent form submission if applicable
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm="12">
            <SubmitButton
              type="submit"
              className="mb-3"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </SubmitButton>
          </Col>
        </Row>

        <FormAlert variant="success" show={formSubmitted}>
          Form submitted successfully.
        </FormAlert>

        <FormAlert variant="danger" show={error !== ""}>
          {error}
        </FormAlert>
      </Form>
    </FormCard>
  );
}

export default MRDForm;

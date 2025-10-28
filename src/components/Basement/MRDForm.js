import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Alert, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../apiRequest";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

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
      setError("Please select a date");
      setIsSubmitting(false); // ✅ re-enable if validation fails
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
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

        if (response?.error === "Data already exists for this date.") {
          setError("Data already exists for this date.");
        } else {
          setFormSubmitted(true);
          setError("");
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError(error.message || "Failed to submit data");
      } finally {
        // ✅ Re-enable after 3 seconds
        setTimeout(() => setIsSubmitting(false), 3000);
      }
    }

    setValidated(true);
  };


  return (
    <StyledContainer className="NumericalData">
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
              <div className="position-relative">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={{
                    cursor: "pointer",
                    color: "#EBB099",
                    fontSize: "25px",
                  }}
                  onClick={() => document.getElementById("datePicker").click()}
                />
                <DatePicker
                  id="datePicker"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  className="position-absolute top-100 start-0 d-none"
                  calendarClassName="position-absolute top-100 start-0"
                  placeholderText="Select Date"
                />
                {selectedDate && (
                  <div
                    className="position-absolute top-100 start-0 translate-middle-y"
                    style={{ marginLeft: "50px", marginTop: "-15px" }}
                  >
                    {selectedDate.toLocaleDateString("en-GB")}
                  </div>
                )}
              </div>
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
              <Form.Control
                required
                type="text"
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
              <Form.Control
                as="textarea"
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
              <Form.Control
                required
                type="text"
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
              <Form.Control
                required
                type="text"
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
              <Form.Control
                as="textarea"
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
            <button
              variant="primary"
              type="submit"
              className="mb-3"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </Col>
        </Row>

        <Alert variant="success" show={formSubmitted}>
          Form submitted successfully.
        </Alert>

        <Alert variant="danger" show={error !== ""}>
          {error}
        </Alert>
      </Form>
    </StyledContainer>
  );
}

export default MRDForm;

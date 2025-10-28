import React, { useState, useEffect } from "react";
import { Row, Form, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const CT = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    selectedDate: "",
    numberOfReportingErrors: "",
    numberOfReportingErrorsRemarks: "",
    numberOfCasePerformed: "",
    numberOfTestsPerformed: "",
    numberOfStaffAdheringToSafety: "",
    numberOfStaffAudited: "",
    waitingTimeForDiagnostics: "",
    numberOfPatientsReportedInDiagnostics: "",
  });

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    if (id && name) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id,
        name,
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

const [isSubmitting, setIsSubmitting] = useState(false); // new state

const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // Prevent multiple submissions
  setIsSubmitting(true);    // Disable button immediately

  const form = e.currentTarget;

  // Check if the date is selected
  if (!selectedDate) {
    setError("Please select a date");
    setIsSubmitting(false); // re-enable button if error
    return;
  }

  if (form.checkValidity() === false) {
    e.stopPropagation();
    setIsSubmitting(false); // re-enable button if form invalid
  } else {
    try {
      const id = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");

      const formDataWithUser = {
        ...formData,
        id,
        name,
      };

      const response = await fetch(`${IndicatorBaseUrl}CT/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token"),
        },
        body: JSON.stringify(formDataWithUser),
      });

      if (response.status === 400) {
        const errorText = await response.json();
        if (errorText.error === "Data already exists for this date.") {
          setError("Data already exists for this date.");
        } else {
          throw new Error(errorText.error || "Failed to submit data");
        }
        setIsSubmitting(false); // re-enable if error
      } else {
        setFormSubmitted(true);
        setError("");

        // Optional: auto-refresh or re-enable button after 2 seconds
        setTimeout(() => {
          setIsSubmitting(false); // or window.location.reload() if you want
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message || "Failed to submit data");
      setIsSubmitting(false); // re-enable on exception
    }
  }

  setValidated(true);
};

  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">CT</h2>
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
        <Form.Group className="position-relative mb-3" controlId="selectedDate">
          <div className="position-relative">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ cursor: "pointer", color: "#EBB099", fontSize: "25px" }}
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
        <br />
        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfReportingErrors">
              <Form.Label>Number of Reporting Errors</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfReportingErrors}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group controlId="numberOfReportingErrorsRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfReportingErrorsRemarks}
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
          <Form.Group controlId="numberOfCasePerformed">
            <Form.Label>Number of Case Performed</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfCasePerformed}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfTestsPerformed">
            <Form.Label>Number of Tests Performed</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfTestsPerformed}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfStaffAdheringToSafety">
            <Form.Label>
              Number of Staff Adhering to Safety Precautions
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfStaffAdheringToSafety}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfStaffAudited">
            <Form.Label>Number of Staff Audited</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfStaffAudited}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="waitingTimeForDiagnostics">
            <Form.Label>Waiting time for Diagnostics</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.waitingTimeForDiagnostics}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfPatientsReportedInDiagnostics">
            <Form.Label>Number of patients reported in Diagnostics</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfPatientsReportedInDiagnostics}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

<button
  type="submit"
  className="mb-3"
  onClick={handleSubmit}
  disabled={isSubmitting} // disables button after one submit
>
  {isSubmitting ? "Saving..." : "Save"}
</button>

        <Alert variant="success" show={formSubmitted}>
          Form submitted successfully.
        </Alert>

        <Alert variant="danger" show={error !== ""}>
          {error}
        </Alert>
      </Form>
    </StyledContainer>
  );
};

export default CT;

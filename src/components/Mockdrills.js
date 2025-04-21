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

const Mockdrills = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    selectedDate: "",
    totalNumberOfVariationsObservedInMockDrill: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const response = await fetch(
          "https://indicators.shinovadatabase.in/mockdrills/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          setFormSubmitted(true);
          setError("");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to submit data");
        }
      } catch (err) {
        setError(err.message);
      }
    }
    setValidated(true);
  };
  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">Mock Drill</h2>
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
        <Form.Group controlId="selectedDate" className="mb-3">
          <FontAwesomeIcon
            icon={faCalendarAlt}
            style={{ cursor: "pointer", color: "#EBB099", fontSize: "25px" }}
            onClick={() => document.getElementById("datePicker").click()}
          />
          <DatePicker
            id="datePicker"
            selected={selectedDate}
            onChange={handleDateChange}
            className="d-none"
          />
          {selectedDate && (
            <div style={{ marginLeft: "50px", marginTop: "-15px" }}>
              {selectedDate.toLocaleDateString("en-GB")}
            </div>
          )}
        </Form.Group>
        <Form.Group
          controlId="totalNumberOfVariationsObservedInMockDrill"
          className="mb-3"
        >
          <Form.Label>
            Total number of variations observed in mock drill
          </Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.totalNumberOfVariationsObservedInMockDrill}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Required field
          </Form.Control.Feedback>
        </Form.Group>
        <button variant="primary" type="submit" className="mb-3">
          Save
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
export default Mockdrills;

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

const HandHygenieAudit = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    auditBy: "",
    selectedDate: "",
    nameOfTheStaff: "",
    area: "",
    category: "",
    typeOfHandHygiencePractice: "",
    fiveMoments: [], // Change from "" to []
    ornamentsIfAny: "",
  });

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const auditBy = localStorage.getItem("userName");
    if (id && auditBy) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id,
        auditBy,
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

    // Check if the date is selected
    if (!selectedDate) {
      setError("Please select a date");
      return; // Prevent form submission if date is not selected
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const id = localStorage.getItem("userId");
        const auditBy = localStorage.getItem("userName");

        // Format the data properly
        const formDataWithUser = {
          ...formData,
          id,
          auditBy,
          // No need to include selectedDate separately as it's already in formData
          // Use formData.fiveMoments instead of fiveMoments
          fiveMoments: JSON.stringify(formData.fiveMoments),
        };

        const response = await fetch(
          "https://indicators.shinovadatabase.in/HandHygenieAudit/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataWithUser),
          }
        );

        if (response.status === 400) {
          const errorText = await response.json();
          if (
            errorText.error ===
            "Hand hygenie audit with this nameOfTheStaff already exists."
          ) {
            setError(
              "Hand hygenie audit with this nameOfTheStaff already exists."
            );
          } else {
            throw new Error(
              errorText.error ||
                "Hand hygenie audit with this nameOfTheStaff already exists."
            );
          }
        } else {
          setFormSubmitted(true); // Display success message
          setError(""); // Clear any previous errors
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError(
          error.message ||
            "Hand hygenie audit with this nameOfTheStaff already exists."
        );
      }
    }

    setValidated(true);
  };

  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">Hand Hygiene Audit</h2>
      <div style={{ float: "right" }} className="mt-3">
        <div>
          <b>ID: </b>
          {formData.id}
        </div>
        <div>
          <b>Name: </b>
          {formData.auditBy}
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
          <Form.Group controlId="nameOfTheStaff">
            <Form.Label>Name Of The Staff:</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.nameOfTheStaff}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="area">
            <Form.Label>Area:</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.area}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="category">
            <Form.Label>Category:</Form.Label>
            <Form.Select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">-- Select Category --</option>
              <option value="Staff Nurses">Staff Nurses</option>
              <option value="Doctors">Doctors</option>
              <option value="House keeping">House keeping</option>
              <option value="Para medical">Para medical</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Physiotherapy">Physiotherapy</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="typeOfHandHygiencePractice">
            <Form.Label>Type of Hand Hygiene Practice:</Form.Label>
            <Form.Select
              required
              value={formData.typeOfHandHygiencePractice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  typeOfHandHygiencePractice: e.target.value,
                })
              }
            >
              <option value="">-- Select Practice Type --</option>
              <option value="Hand Wash">Hand Wash</option>
              <option value="Hand rub">Hand rub</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="fiveMoments">
            <Form.Label>Five Moments:</Form.Label>
            {[
              "Before touching Patient",
              "Before Aseptic Procedure",
              "After body Fluid exposure",
              "After touching a Patient",
              "After touching patient Surroundings",
              "No Missed Movements",
            ].map((moment) => (
              <Form.Check
                key={moment}
                type="checkbox"
                label={moment}
                value={moment}
                checked={formData.fiveMoments.includes(moment)}
                onChange={(e) => {
                  const selected = [...formData.fiveMoments];
                  if (e.target.checked) {
                    selected.push(moment);
                  } else {
                    const index = selected.indexOf(moment);
                    if (index !== -1) selected.splice(index, 1);
                  }
                  setFormData({ ...formData, fiveMoments: selected });
                }}
              />
            ))}
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="ornamentsIfAny">
            <Form.Label>Ornaments If Any:</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.ornamentsIfAny}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <button
          variant="primary"
          type="submit"
          className="mb-3"
          onClick={handleSubmit}
        >
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

export default HandHygenieAudit;

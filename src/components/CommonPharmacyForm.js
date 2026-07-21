import React, { useState, useEffect } from "react";
import { Row, Form, Col } from "react-bootstrap";
import apiRequest from "./apiRequest";
import {
  FormCard,
  TextField,
  SubmitButton,
  FormAlert,
  DateField,
} from "./Common/fields";

const CommonPharmacyForm = ({ title, apiUrl, fields }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    selectedDate: "",
  });
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
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
        const response = await apiRequest(apiUrl, "POST", formData);

        if (response.success) {
          console.log("Data submitted successfully");
          setFormSubmitted(true);
        } else {
          throw new Error(response.error || "Failed to submit data");
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError("Failed to submit data");
      }
    }
    setValidated(true);
  };

  return (
    <FormCard>
      <h2 className="text-center">{title}</h2>
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
        <Form.Group className="mb-3" controlId="selectedDate">
          <DateField
            id="datePicker"
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select Date"
          />
        </Form.Group>

        {fields.map(({ id, label, type }) => (
          <Row className="mb-3" key={id}>
            <Form.Group controlId={id}>
              <Form.Label>{label}</Form.Label>
              <TextField
                required
                type={type}
                value={formData[id] || ""}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        ))}

        <SubmitButton type="submit" className="mb-3">
          Save
        </SubmitButton>

        <FormAlert variant="success" show={formSubmitted}>
          Form submitted successfully.
        </FormAlert>

        <FormAlert variant="danger" show={error !== ""}>
          {error}
        </FormAlert>
      </Form>
    </FormCard>
  );
};

export default CommonPharmacyForm;

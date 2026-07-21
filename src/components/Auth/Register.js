import React, { useState } from "react";
import { Row, Form, Col } from "react-bootstrap";
import styled from "styled-components";
import "./Register.css";
// Import the department options and role from constants.js
import { role, wardOptions } from "../constant";
import { TextField, SelectField, SubmitButton, FormAlert } from "../Common/fields";
const Register = () => {
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [touchedFields, setTouchedFields] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // Success message stat
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    department: "",
    role: "",
    email: "",
    password: "",
  });
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setTouchedFields({ ...touchedFields, [id]: true }); // Mark field as touched
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const response = await fetch(
          `${IndicatorBaseUrl}registration/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const result = await response.json();

        if (response.ok) {
          setFormSubmitted(true);
          setError(""); // Clear any existing errors
          setSuccessMessage(result.message || "Registration successful!"); // Set success message
        } else {
          // Separate handling for id and email errors
          let idError = result.id ? result.id[0] : "";
          let emailError = result.email ? result.email[0] : "";

          // Set the combined error message if both are present, otherwise set individual errors
          setError(
            idError || emailError
              ? `${idError} ${emailError}`.trim()
              : "Registration failed. Please try again."
          );
          setSuccessMessage(""); // Clear success message
          setFormSubmitted(false);
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError("An unexpected error occurred. Please try again.");
        setSuccessMessage(""); // Clear success message on error
      }
    }
    setValidated(true);
  };

  return (
    <div className="Registration">
      <StyledContainer>
        <h1 className="text-center mb-4">Registration</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="id">
                <Form.Label>ID</Form.Label>
                <TextField
                  required
                  type="text"
                  value={formData.id}
                  onChange={(e) => {
                    setId(e.target.value);
                    handleChange(e);
                  }}
                  pattern="[a-zA-Z0-9]+"
                  isInvalid={
                    (touchedFields.id && !formData.id) ||
                    (formData.id && !/^[a-zA-Z0-9]+$/.test(formData.id))
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formData.id && !/^[a-zA-Z0-9]+$/.test(formData.id)
                    ? "Please enter a valid ID."
                    : "ID is required."}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <TextField
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleChange(e);
                  }}
                  pattern="[A-Za-z\s]+"
                  isInvalid={
                    (touchedFields.name && !formData.name) ||
                    (formData.name && !/^[A-Za-z\s]+$/.test(formData.name))
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formData.name && !/^[A-Za-z\s]+$/.test(formData.name)
                    ? "Please enter a valid name."
                    : "Name is required."}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="department">
                <Form.Label>Department</Form.Label>
                <SelectField
                  id="departmentSelect"
                  required
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  {wardOptions.map((department, index) => (
                    <option key={index} value={department}>
                      {department}
                    </option>
                  ))}
                </SelectField>
                <Form.Control.Feedback type="invalid">
                  Department is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="role">
                <Form.Label>Role</Form.Label>
                <SelectField
                  id="roleselect"
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="">Select Role</option>
                  {role.map((roleOption, index) => (
                    <option key={index} value={roleOption}>
                      {roleOption}
                    </option>
                  ))}
                </SelectField>
                <Form.Control.Feedback type="invalid">
                  Role is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <TextField
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleChange(e);
                  }}
                  // isInvalid={(touchedFields.password && !formData.password) || (formData.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password))}
                  autoComplete="new-password" // Prevent browser autocomplete and generate a new password
                />
                <Form.Control.Feedback type="invalid">
                  Password is required
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <center>
            <SubmitButton type="submit" className="mb-3">
              Save
            </SubmitButton>
          </center>
          {/* Combined Error Alert */}
          {error && <FormAlert variant="danger">{error}</FormAlert>}
          {/* Success Message Alert */}
          {successMessage && <FormAlert variant="success">{successMessage}</FormAlert>}
        </Form>
      </StyledContainer>
    </div>
  );
};
const StyledContainer = styled.div`
  margin: 5px auto 0;
  padding: 10px;
  max-height: 500px;
  max-width: 500px;
  align-items: center;
  background-color: white;
  border-radius: 10px;
`;
export default Register;

import React, { useState, useEffect } from "react";
import { Row, Form, Col } from "react-bootstrap";
import apiRequest from "./apiRequest";
import {
  FormCard,
  TextField,
  SelectField,
  DateField,
  SubmitButton,
  FormAlert,
} from "./Common/fields";

const HandHygenieAudit = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const [formData, setFormData] = useState({
    ID: "",
    auditBy: "",
    selectedDate: "",
    nameOfTheStaff: "",
    area: "",
    category: "",
    typeOfHandHygiencePractice: "",
    fiveMoments: [], // Change from "" to []
    ornamentsIfAny: "",
    totalNumberOfActionsPerformed: "",
    totalNumberOfHandHygieneOpportunities: "",
  });

  useEffect(() => {
    const ID = localStorage.getItem("userId");
    const auditBy = localStorage.getItem("userName");
    if (ID && auditBy) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ID,
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
const [isSubmitting, setIsSubmitting] = useState(false); // new state

const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return; // prevent multiple clicks
  setIsSubmitting(true);    // disable submit immediately

  const form = e.currentTarget;

  // Check if the date is selected
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
      const ID = localStorage.getItem("userId");
      const auditBy = localStorage.getItem("userName");

      const formDataWithUser = {
        ...formData,
        ID,
        auditBy,
        fiveMoments: JSON.stringify(formData.fiveMoments),
      };
      const response = await apiRequest(`${IndicatorBaseUrl}HandHygenieAudit/`, "POST", formDataWithUser);

      if (!response.success) {
        if (response.status === 400 && response.data?.error === "Failed to Submit.") {
          setError("Failed to Submit.");
        } else {
          throw new Error(response.error || "Failed to Submit.");
        }
        setIsSubmitting(false);
      } else {
        setFormSubmitted(true);
        setError("");

        // Auto-refresh after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message || "Failed to submit.");
      setIsSubmitting(false);
    }
  }

  setValidated(true);
};

  return (
    <FormCard className="NumericalData">
      <h2 className="text-center">Hand Hygiene Audit</h2>
      <div style={{ float: "right" }} className="mt-3">
        <div>
          <b>ID: </b>
          {formData.ID}
        </div>
        <div>
          <b>Name: </b>
          {formData.auditBy}
        </div>
      </div>
      <br />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="position-relative mb-3" controlId="selectedDate">
          <DateField
            id="datePicker"
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select Date"
          />
        </Form.Group>
        <br />
        <Row className="mb-3">
          <Form.Group controlId="nameOfTheStaff">
            <Form.Label>Name Of The Staff:</Form.Label>
            <TextField
              required
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
            <TextField
              required
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
            <SelectField
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
            </SelectField>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="typeOfHandHygiencePractice">
            <Form.Label>Type of Hand Hygiene Practice:</Form.Label>
            <SelectField
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
            </SelectField>
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
            <TextField
              required
              value={formData.ornamentsIfAny}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfActionsPerformed">
            <Form.Label>Total Number Of Actions Performed:</Form.Label>
            <TextField
              required
              value={formData.totalNumberOfActionsPerformed}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfHandHygieneOpportunities">
            <Form.Label>Total Number Of Hand Hygiene Opportunities:</Form.Label>
            <TextField
              required
              value={formData.totalNumberOfHandHygieneOpportunities}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

<SubmitButton
  type="submit"
  className="mb-3"
  onClick={handleSubmit}
  disabled={isSubmitting}  // disables button after one submit
>
  {isSubmitting ? "Saving..." : "Save"}
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

export default HandHygenieAudit;

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

const MOMENTS = [
  "Before touching Patient",
  "Before Aseptic Procedure",
  "After body Fluid exposure",
  "After touching a Patient",
  "After touching patient Surroundings",
  "No Missed Movements",
];

const PRACTICE_OPTIONS = [
  "Hand Wash",
  "Hand Rub",
  "Miss Perform",
  "Missed",
];

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
    observer: "",
    area: "",
    category: "",
    typeOfHandHygiencePractice: "",
    fiveMoments: [], // Array of { moment: string, practice: string }
    ornamentsIfAny: "",
    totalNumberOfActionsPerformed: "0",
    totalNumberOfHandHygieneOpportunities: "0",
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

  const getMomentObj = (momentName) => {
    return formData.fiveMoments.find((item) =>
      typeof item === "object" && item !== null
        ? item.moment === momentName
        : item === momentName
    );
  };

  const handleMomentToggle = (moment, isChecked) => {
    let updatedMoments = [...formData.fiveMoments];
    if (isChecked) {
      if (!updatedMoments.some((m) => (typeof m === "object" ? m.moment : m) === moment)) {
        updatedMoments.push({ moment, practice: "" });
      }
    } else {
      updatedMoments = updatedMoments.filter(
        (m) => (typeof m === "object" ? m.moment : m) !== moment
      );
    }
    recalculateCounts(updatedMoments);
  };

  const handlePracticeChange = (moment, practiceOption) => {
    const updatedMoments = formData.fiveMoments.map((m) => {
      const itemMoment = typeof m === "object" ? m.moment : m;
      if (itemMoment === moment) {
        return { moment, practice: practiceOption };
      }
      return m;
    });
    recalculateCounts(updatedMoments);
  };

  const recalculateCounts = (momentsList) => {
    // Total Opportunities = total number of checkboxes clicked in Five Moments
    const opportunitiesCount = momentsList.length;

    // Total Actions Performed = count of checkboxes clicked with option (Hand Wash, Hand Rub)
    const actionsCount = momentsList.filter(
      (m) => typeof m === "object" && (m.practice === "Hand Wash" || m.practice === "Hand Rub")
    ).length;

    setFormData((prev) => ({
      ...prev,
      fiveMoments: momentsList,
      totalNumberOfHandHygieneOpportunities: opportunitiesCount.toString(),
      totalNumberOfActionsPerformed: actionsCount.toString(),
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
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
          <Col md={6}>
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
          </Col>
          <Col md={6}>
            <Form.Group controlId="observer">
              <Form.Label>Observer:</Form.Label>
              <TextField
                required
                value={formData.observer}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
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
          <Form.Group controlId="fiveMoments">
            <Form.Label style={{ fontWeight: "600", fontSize: "15px", color: "var(--color-text-primary)" }}>
              Five Moments:
            </Form.Label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
              {MOMENTS.map((moment) => {
                const momentObj = getMomentObj(moment);
                const isChecked = !!momentObj;
                const currentPractice = momentObj && typeof momentObj === "object" ? momentObj.practice : "";

                return (
                  <div
                    key={moment}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: isChecked ? "1px solid var(--color-accent, #0d9488)" : "1px solid var(--color-border, #e2e8f0)",
                      backgroundColor: isChecked ? "var(--color-hover-overlay, rgba(13, 148, 136, 0.08))" : "var(--color-surface, #ffffff)",
                      transition: "all 0.15s ease-in-out"
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`moment-${moment}`}
                      label={<span style={{ fontWeight: "500", color: "var(--color-text-primary)" }}>{moment}</span>}
                      checked={isChecked}
                      onChange={(e) => handleMomentToggle(moment, e.target.checked)}
                    />

                    {isChecked && (
                      <div style={{ marginTop: "10px", paddingLeft: "24px" }}>
                        <Form.Label style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-secondary)", marginBottom: "6px" }}>
                          Type of Hand Hygiene Practice:
                        </Form.Label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                          {PRACTICE_OPTIONS.map((option) => (
                            <Form.Check
                              inline
                              key={option}
                              type="radio"
                              name={`practice-${moment}`}
                              id={`practice-${moment}-${option}`}
                              label={<span style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>{option}</span>}
                              value={option}
                              checked={currentPractice === option}
                              onChange={() => handlePracticeChange(moment, option)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
              readOnly
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
              readOnly
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
          disabled={isSubmitting}
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

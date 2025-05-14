import React, { useState, useEffect } from "react";
import { Row, Form, Col, Alert, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const ValidationMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const TrainingFeedBack = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [trainingTopicError, setTrainingTopicError] = useState(false);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const [formData, setFormData] = useState({
    ID: "",
    name: "",
    selectedDate: "",
    department: "",
    trainingTopic: "",
    duration: "",
    detailsOfTrainingTopic: {
      relevance: "",
      content: "",
      clarity: "",
    },
    trainer: {
      communicationskill: "",
      knowledge: "",
    },
    nameOfTheTrainer: "",
    qualityOfAudioVisuals: "",
    gainInKnowledge: "",
    suggestionToImprove: "",
    ifSoPleaseSpecify: "",
  });

  useEffect(() => {
    const ID = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    if (ID && name) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ID,
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

  const handleTrainingTopicRating = (aspect, rating) => {
    if (["relevance", "content", "clarity"].includes(aspect)) {
      setFormData({
        ...formData,
        detailsOfTrainingTopic: {
          ...formData.detailsOfTrainingTopic,
          [aspect]: rating,
        },
      });
    } else if (["communicationskill", "knowledge"].includes(aspect)) {
      setFormData({
        ...formData,
        trainer: {
          ...formData.trainer,
          [aspect]: rating,
        },
      });
    }
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
        const ID = localStorage.getItem("userId");
        const name = localStorage.getItem("userName");
        // Inside handleSubmit, before making the fetch request:
        const formDataWithUser = {
          ...formData,
          ID,
          name,
          // Convert objects to strings
          detailsOfTrainingTopic: JSON.stringify({
            relevance: formData.detailsOfTrainingTopic.relevance,
            content: formData.detailsOfTrainingTopic.content,
            clarity: formData.detailsOfTrainingTopic.clarity,
          }),
          trainer: JSON.stringify({
            communicationskill: formData.trainer.communicationskill,
            knowledge: formData.trainer.knowledge,
          }),
        };
        const response = await fetch(
          `${IndicatorBaseUrl}TrainingFeedBack/`,
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
          if (errorText.error === "Data already exists for this date.") {
            setError("Data already exists for this date.");
          } else {
            throw new Error(errorText.error || "Failed to submit data");
          }
        } else {
          setFormSubmitted(true); // Display success message
          setError(""); // Clear any previous errors
          // Auto-refresh after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError(error.message || "Failed to submit data");
      }
    }

    setValidated(true);
  };
  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">Training Feed Back Form</h2>
      <div style={{ float: "right" }} className="mt-3">
        <div>
          <b>ID: </b>
          {formData.ID}
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
          <Form.Group controlId="department">
            <Form.Label>Department:</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.department}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="trainingTopic">
            <Form.Label>Training Topic:</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.trainingTopic}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="duration">
            <Form.Label>Duration (Hrs):</Form.Label>
            <div className="d-flex gap-3 flex-wrap">
              {["1", "2", "3"].map((option) => (
                <Form.Check
                  key={option}
                  type="radio"
                  label={option}
                  name="duration"
                  value={option}
                  checked={formData.duration === option}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                />
              ))}
            </div>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <div>Details of Training-Topic:</div>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th className="text-center">Very Good</th>
                  <th className="text-center">Good</th>
                  <th className="text-center">Satisfactory</th>
                  <th className="text-center">Poor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Relevance</td>
                  {["Very Good", "Good", "Satisfactory", "Poor"].map(
                    (rating) => (
                      <td key={`relevance-${rating}`} className="text-center">
                        <Form.Check
                          type="radio"
                          name="relevance"
                          checked={
                            formData.detailsOfTrainingTopic.relevance === rating
                          }
                          onChange={() =>
                            handleTrainingTopicRating("relevance", rating)
                          }
                        />
                      </td>
                    )
                  )}
                </tr>
                <tr>
                  <td>Content</td>
                  {["Very Good", "Good", "Satisfactory", "Poor"].map(
                    (rating) => (
                      <td key={`content-${rating}`} className="text-center">
                        <Form.Check
                          type="radio"
                          name="content"
                          checked={
                            formData.detailsOfTrainingTopic.content === rating
                          }
                          onChange={() =>
                            handleTrainingTopicRating("content", rating)
                          }
                        />
                      </td>
                    )
                  )}
                </tr>
                <tr>
                  <td>Clarity</td>
                  {["Very Good", "Good", "Satisfactory", "Poor"].map(
                    (rating) => (
                      <td key={`clarity-${rating}`} className="text-center">
                        <Form.Check
                          type="radio"
                          name="clarity"
                          checked={
                            formData.detailsOfTrainingTopic.clarity === rating
                          }
                          onChange={() =>
                            handleTrainingTopicRating("clarity", rating)
                          }
                        />
                      </td>
                    )
                  )}
                </tr>
              </tbody>
            </Table>
            {trainingTopicError && (
              <ValidationMessage>
                <div className="d-flex align-items-center">
                  <span className="text-danger me-2">⚠</span>
                  This question requires one response per row
                </div>
              </ValidationMessage>
            )}
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <div>Trainer:</div>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th className="text-center">Very Good</th>
                  <th className="text-center">Good</th>
                  <th className="text-center">Satisfactory</th>
                  <th className="text-center">Poor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Communication Skill</td>
                  {["Very Good", "Good", "Satisfactory", "Poor"].map(
                    (rating) => (
                      <td
                        key={`communicationskill-${rating}`}
                        className="text-center"
                      >
                        <Form.Check
                          type="radio"
                          name="communicationskill"
                          checked={
                            formData.trainer.communicationskill === rating
                          }
                          onChange={() =>
                            handleTrainingTopicRating(
                              "communicationskill",
                              rating
                            )
                          }
                        />
                      </td>
                    )
                  )}
                </tr>
                <tr>
                  <td>Knowledge</td>
                  {["Very Good", "Good", "Satisfactory", "Poor"].map(
                    (rating) => (
                      <td key={`knowledge-${rating}`} className="text-center">
                        <Form.Check
                          type="radio"
                          name="knowledge"
                          checked={formData.trainer.knowledge === rating}
                          onChange={() =>
                            handleTrainingTopicRating("knowledge", rating)
                          }
                        />
                      </td>
                    )
                  )}
                </tr>
              </tbody>
            </Table>
            {trainingTopicError && (
              <ValidationMessage>
                <div className="d-flex align-items-center">
                  <span className="text-danger me-2">⚠</span>
                  This question requires one response per row
                </div>
              </ValidationMessage>
            )}
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="nameOfTheTrainer">
            <Form.Label>Name of the Trainer:</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.nameOfTheTrainer}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="qualityOfAudioVisuals">
            <Form.Label>Quality of Audio Visuals (AV Method):</Form.Label>
            <div className="d-flex gap-3 flex-wrap">
              {["Very Good", "Good", "Satisfactory", "Poor"].map((option) => (
                <Form.Check
                  key={option}
                  type="radio"
                  label={option}
                  name="qualityOfAudioVisuals"
                  value={option}
                  checked={formData.qualityOfAudioVisuals === option}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qualityOfAudioVisuals: e.target.value,
                    })
                  }
                  required
                />
              ))}
            </div>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="gainInKnowledge">
            <Form.Label>Gain in Knowledge:</Form.Label>
            <div className="d-flex gap-3 flex-wrap">
              {["Very Good", "Good", "Satisfactory", "Poor"].map((option) => (
                <Form.Check
                  key={option}
                  type="radio"
                  label={option}
                  name="gainInKnowledge"
                  value={option}
                  checked={formData.gainInKnowledge === option}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gainInKnowledge: e.target.value,
                    })
                  }
                  required
                />
              ))}
            </div>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="suggestionToImprove">
            <Form.Label>Suggestion To Improve:</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.suggestionToImprove}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group controlId="ifSoPleaseSpecify">
            <Form.Label>
              Do you need training in any other area? If So Please Specify:
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.ifSoPleaseSpecify}
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

export default TrainingFeedBack;

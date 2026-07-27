import React, { useState, useEffect } from "react";
import { Row, Form, Col } from "react-bootstrap";
import { message } from "antd";
import apiRequest from "../apiRequest";
import {
  FormCard,
  TextField,
  TextAreaField,
  DateField,
  SubmitButton,
  FormAlert,
} from "../Common/fields";

const Lab = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ new state
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    selectedDate: "",
    numberOfReportingErrors: "",
    numberOfReportingErrorsRemarks: "",
    numberOfTestsPerformed: "",
    numberOfStaffAdheringToSafety: "",
    numberOfStaffAudited: "",
    waitingTimeForDiagnostics: "",
    numberOfPatientsReportedInDiagnostics: "",
    numberOfRegistrations: "",
    numberOfIncidentOrAccidentOccur: "",
    numberOfSampleRejections: "",
    numberOfRepeats: "",
    numberOfTurnAroundTimeAndShortTurnAroundCriticalReporting: "",
    numberOfEquipmentDownTime: "",
    numberOfPerformanceInILC: "",
    customerFeedBack: "",
    numberOfCriticalReporting: "",
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

    if (!selectedDate) {
      message.warning("Please select a date.");
      setError("Please select a date");
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
      message.warning("Please fill out all required fields.");
    } else {
      if (isSubmitting) return; // ✅ prevent multiple clicks
      setIsSubmitting(true); // ✅ disable button

      try {
        const id = localStorage.getItem("userId");
        const name = localStorage.getItem("userName");
        const formDataWithUser = { ...formData, id, name };

        const response = await apiRequest(`${IndicatorBaseUrl}Lab/`, "POST", formDataWithUser);

        if (!response.success) {
          const errMsg = response.error || "Failed to submit data";
          message.error(errMsg);
          setError(errMsg);
        } else {
          message.success("Lab data submitted successfully!");
          setFormSubmitted(true);
          setError("");
        }
      } catch (error) {
        console.error("Error:", error.message);
        const errMsg = error.message || "Failed to submit data";
        message.error(errMsg);
        setError(errMsg);
      } finally {
        // ✅ re-enable button after 3 seconds
        setTimeout(() => setIsSubmitting(false), 3000);
      }
    }

    setValidated(true);
  };

  return (
    <FormCard className="NumericalData">
      <h2 className="text-center">Lab</h2>
      <div style={{ float: "right" }} className="mt-3">
        <div><b>ID: </b>{formData.id}</div>
        <div><b>Name: </b>{formData.name}</div>
      </div>
      <br />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="position-relative mb-3" controlId="selectedDate">
          <div className="position-relative">
            <DateField
              id="datePicker"
              selected={selectedDate}
              onChange={handleDateChange}
              placeholderText="Select Date"
            />
          </div>
        </Form.Group>

        {/* all your existing fields unchanged */}
        {/* ... */}

        <br />
        <h4 className="text-center mb-4" style={{ backgroundColor: "#EBB099", color: "white" }}>PRE ANALYTICAL</h4>

        <Row className="mb-3">
          <Col >
            {/* <Col sm="8"> */}

            <Form.Group controlId="numberOfRegistrations">
              <Form.Label>Number of Registrations</Form.Label>
              <TextField
                required
                type="text"
                value={formData.numberOfRegistrations}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* <Col sm="4">
            <Form.Group controlId="numberOfReportingErrorsRemarks">
              <Form.Label>Remarks</Form.Label>
              <TextAreaField
                required
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
          </Col> */}
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfTestsPerformed">
            <Form.Label>Number of Tests Performed</Form.Label>
            <TextField
              // required
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
          <Form.Group controlId="numberOfIncidentOrAccidentOccur">
            <Form.Label>Number of Incidant/Accident Occurs</Form.Label>
            <TextField
              // required
              type="text"
              value={formData.numberOfIncidentOrAccidentOccur}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfSampleRejections">
            <Form.Label>Number of Sample Rejections</Form.Label>
            <TextField
              // required
              type="text"
              value={formData.numberOfSampleRejections}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <h4 className="text-center mb-4" style={{ backgroundColor: "#EBB099", color: "white" }}>ANALYTICAL</h4>

        <Row className="mb-3">
          <Form.Group controlId="numberOfRepeats">
            <Form.Label>Number of Repeats (or redos)</Form.Label>
            <TextField
              // required
              type="text"
              value={formData.numberOfRepeats}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfEquipmentDownTime">
            <Form.Label>Number of Equipment Down Time</Form.Label>
            <TextField
              // required
              type="text"
              value={formData.numberOfEquipmentDownTime}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfPerformanceInILC">
            <Form.Label>Number of Performance in ILC</Form.Label>
            <TextField
              // required
              type="text"
              value={formData.numberOfPerformanceInILC}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <h4 className="text-center mb-4" style={{ backgroundColor: "#EBB099", color: "white" }}>POST ANALYTICAL</h4>

        <Row className="mb-3">
          <Form.Group controlId="customerFeedBack">
            <Form.Label>Customer Feed Back</Form.Label>
            <TextField
              // required
              type="text"
              value={formData.customerFeedBack}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfTurnAroundTimeAndShortTurnAroundCriticalReporting">
            <Form.Label>Number of Turn Around Time & Short Turn Around Critical reporting</Form.Label>
            <TextField
              // required
              type="text"
              value={formData.numberOfTurnAroundTimeAndShortTurnAroundCriticalReporting}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfReportingErrors">
              <Form.Label>Number of Reporting Errors</Form.Label>
              <TextField
                // required
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
              <TextAreaField
                // required
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
          <Form.Group controlId="numberOfCriticalReporting">
            <Form.Label>Number of Critical reporting</Form.Label>
            <TextField
              // required
              type="text"
              value={formData.numberOfCriticalReporting}
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
            <TextField
              // required
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
            <TextField
              // required
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
            <TextField
              // required
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
            <TextField
              // required
              type="text"
              value={formData.numberOfPatientsReportedInDiagnostics}
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
          disabled={isSubmitting} // ✅ disable when submitting
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

export default Lab;

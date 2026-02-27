import React, { useState, useEffect } from "react";
import { Row, Form, Col, Alert, Container,Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

function MICU() {
  const MAX_CHAR_LIMIT = 5000; // Define the max character limit
  const [validated, setValidated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    selectedDate: "",
    sumOfTimeTakenforInitialAssessment: "",
    totalNumberOfAdmissions: "",
    numberOfPatientsDischargedInsurance: "",
    sumOfTimeTakenForDischargeInsurance: "",
    numberOfPatientsDischargedPay: "",
    sumOfTimeTakenForDischargePay: "",
    // numberOfInPatients: "",
    numberOfBedsOccupied: "",
    totalNumberOfMedicationErrors: "",
    totalNumberOfMedicationErrorsRemarks: "",
    totalNumberOfOpportunitiesOfMedicationErrors: "",
    // numberOfMedicationChartsReviewed: "",
    // numberOfMedicationChartsReviewedRemarks: "",
    numberOfPatientsDevelopingAdverseDrugReactions: "",
    numberOfPatientsDevelopingAdverseDrugReactionsRemarks: "",
    numberOfTransfusionReaction: "",
    numberOfTransfusionReactionRemarks: "",
    numberOfUnitsTransfused: "",
    numberOfUnitsTransfusedRemarks: {},
    sumOfTimeTakenForBloodAndBloodComponents: "",
    totalNumberOfBloodAndBloodComponentsCrossMatchedOrReserved: "",
    numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcer: "",
    numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcerRemarks: "",
    numberOfUrinaryCatheterAssociatedUtisInThatMonth: "",
    numberOfUrinaryCatheterAssociatedUtisInThatMonthRemarks: "",
    numberOfUrinaryCatheterDaysInThatMonth: "",
    numberOfUrinaryCatheterDaysInThatMonthRemarks: "",
    numberCentralLineAssociatedBloodStreamInfectionsInAMonth: "",
    numberCentralLineAssociatedBloodStreamInfectionsInAMonthRemarks: "",
    numberOfCentralLineDaysInThatMonth: "",
    numberOfCentralLineDaysInThatMonthRemarks: "",
    numberOfSurgicalSiteInfectionsInAGivenMonth: "",
    numberOfSurgicalSiteInfectionsInAGivenMonthRemarks: "",
    numberOfNursingStaff: "",
    numberOfPatientFalls: "",
    numberOfPatientFallsRemarks: "",
    numberOfNearMissReported: "",
    numberOfNearMissReportedRemarks: "",
    numberOfIncidentsReported: "",
    numberOfIncidentsReportedRemarks: "",
    numberOfParenteralExposures: "",
    numberOfParenteralExposuresRemarks: "",
    totalNumberOfHandoversDoneAppropriately: "",
    totalNumberOfHandoverOpportunities: "",
    totalNumberOfPatientsDevelopingPhlebitis: "",
    totalNumberOfPatientsDevelopingPhlebitisRemarks: "",
    numberOfRestraintInjuriesOrStrangulation: "",
    actualDeathsInICU: "",
    actualDeathsInICURemarks: "",
    predictedDeathsInICU: "",
    predictedDeathsInICURemarks: "",
    numberOfVentilatorAssociatedPneumonia: "",
    numberOfVentilatorAssociatedPneumoniaRemarks: "",
    numberOfVentilatorDays: "",
    numberOfVentilatorDaysRemarks: "",
    numberOfRestraintInjuriesOrStrangulationRemarks: "",
    totalNumberOfRestraintPatientsDays: "",
    totalNumberOfRestraintPatientsDaysRemarks: "",
    numberOfPatientsOnIVTherapy: "",
    totalIVLineChanges:"",
    ivLineChangeRemarks:{},
    incidentsOfDelining: "",
    incidentsOfDeliningRemarks: "",
    NumberofreturnstoICUwithin48hours: "",
    NumberofreturnstoICUwithin48hoursRemarks: "",
    NumberofdischargestransfersfromtheICU: "",
    NumberofdischargestransfersfromtheICURemarks: "",
    NumberofReintubation: "",
    NumberofReintubationRemarks: "",
    NumberofExtubation: "",
    NumberofExtubationRemarks: "",
    numberOfPatientCatheter:"",
    numberOfPatientCatheterRemarks:"",
    numberOfPatientCentralLine:"",
    numberOfPatientCentralLineRemarks:"",
    numberOfPatientVentilator:"",
    numberOfPatientVentilatorRemarks:"",
    numberOfRestrainedPatients: "",
    restrainedPatientsDetails: {},

  });

const apacheScores = [
  { score: 1, factor: 1 / 100 },
  { score: 3, factor: 3 / 100 },
  { score: 7, factor: 7 / 100 },
  { score: 4, factor: 4 / 100 },
  { score: 8, factor: 8 / 100 },
  { score: 12, factor: 12 / 100 },
  { score: 15, factor: 15 / 100 },
  { score: 24, factor: 24 / 100 },
  { score: 30, factor: 30 / 100 },
  { score: 35, factor: 35 / 100 },
  { score: 40, factor: 40 / 100 },
  { score: 55, factor: 55 / 100 },
  { score: 73, factor: 73 / 100 },
  { score: 85, factor: 85 / 100 },
  { score: 88, factor: 88 / 100 },
];

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
      const adjustedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedDate: adjustedDate.toISOString().split("T")[0],
      }));
    }
  }, [selectedDate]);

   // 1. COMPLETE the handleNumberChange function (around line 105)
// Handles number input change
const handleNumberChange = (e) => {
  const num = parseInt(e.target.value, 10) || 0;

  const newDetails = {};
  for (let i = 0; i < num; i++) {
    newDetails[`restrained-${i}`] =
      formData.restrainedPatientsDetails[`restrained-${i}`] || {
        type: "",
        remark: "",
      };
  }

  setFormData((prev) => ({
    ...prev,
    numberOfRestrainedPatients: num,
    restrainedPatientsDetails: newDetails,
  }));
};

// Handles individual field change
const handleDetailChange = (key, field, value) => {
  setFormData((prev) => ({
    ...prev,
    restrainedPatientsDetails: {
      ...prev.restrainedPatientsDetails,
      [key]: {
        ...prev.restrainedPatientsDetails[key],
        [field]: value,
      },
    },
  }));
};

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (value.length > MAX_CHAR_LIMIT) {
      setError(`Ensure this value has at most ${MAX_CHAR_LIMIT} characters.`);
      return;
    }
    if (id.includes("transfused")) {
      const index = parseInt(id.split("-")[1]);
      setFormData({
        ...formData,
        numberOfUnitsTransfusedRemarks: {
          ...formData.numberOfUnitsTransfusedRemarks,
          [`transfused-${index}`]: value,
        },
      });
    } else if (id.includes("remarks")) {
      const index = parseInt(id.split("-")[1]);
      setFormData({
        ...formData,
        numberOfUnitsTransfusedRemarks: {
          ...formData.numberOfUnitsTransfusedRemarks,
          [`remarks-${index}`]: value,
        },
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

      const handleivlineChange = (e) => {
    const { id, value } = e.target;
    if (value.length > MAX_CHAR_LIMIT) {
      setError(`Ensure this value has at most ${MAX_CHAR_LIMIT} characters.`);
      return;
    }
    if (id.includes("ExtravasationVIPScore")) {
      setFormData((prevFormData) => ({
        ...prevFormData,
       ivLineChangeRemarks: {
      ...prevFormData.ivLineChangeRemarks,
      [id]: value
    },     
      }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [patients, setPatients] = useState({});

const handlePatientChange = (score, value) => {
  const updatedPatients = {
    ...patients,
    [score]: Number(value) || 0,
  };

  setPatients(updatedPatients);

  const totalPredictedDeaths = apacheScores.reduce(
    (sum, item) =>
      sum + (updatedPatients[item.score] || 0) * item.factor,
    0
  );

  setFormData((prev) => ({
    ...prev,
    predictedDeathsInICU: totalPredictedDeaths.toFixed(2),
  }));
};


const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // Prevent multiple clicks
  setIsSubmitting(true); // Disable button immediately

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
      const id = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");
      const formDataWithUser = {
        ...formData,
        id,
        name,
      };

      const response = await fetch(`${IndicatorBaseUrl}MICU/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token"),
        },
        body: JSON.stringify(formDataWithUser),
      });

      if (response.status === 400) {
        const errorText = await response.json();
        console.error("errorText:", errorText);
        if (errorText.error === "Data already exists for this date.") {
          setError("Data already exists for this date.");
        } else {
          throw new Error(errorText.error || "Failed to submit data");
        }
        setIsSubmitting(false);
      } else {
        setFormSubmitted(true);
        setError("");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message || "Failed to submit data");
      setIsSubmitting(false);
    }
  }

  setValidated(true);
};

useEffect(() => {
  if (formSubmitted) {
    const timeout = setTimeout(() => {
      window.location.reload(); // Refresh the page
    }, 5000); // 5 seconds

    return () => clearTimeout(timeout);
  }
}, [formSubmitted]);


  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">MICU</h2>
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
          <Form.Group controlId="sumOfTimeTakenforInitialAssessment">
            <Form.Label>
              Sum of Time Taken for Initial Assessment (Minutes)
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.sumOfTimeTakenforInitialAssessment}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfAdmissions">
            <Form.Label>Total Number of Admissions</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfAdmissions}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfPatientsDischargedInsurance">
            <Form.Label>Number of Patients Discharged (Insurance) </Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfPatientsDischargedInsurance}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="sumOfTimeTakenForDischargeInsurance">
            <Form.Label>Sum of Time Taken for Discharge (Insurance)</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.sumOfTimeTakenForDischargeInsurance}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group controlId="numberOfPatientsDischargedPay">
            <Form.Label>Number of Patients Discharged (Pay) </Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfPatientsDischargedPay}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="sumOfTimeTakenForDischargePay">
            <Form.Label>Sum of Time Taken for Discharge (Pay)</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.sumOfTimeTakenForDischargePay}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {/* <Row className="mb-3">
          <Form.Group controlId="numberOfInPatients">
            <Form.Label>Number of IP Patients</Form.Label>
            <Form.Control
              type="text"
              required
              value={formData.numberOfInPatients}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row> */}

        <Row className="mb-3">
          <Form.Group controlId="numberOfBedsOccupied">
            <Form.Label>Number Of Beds Occupied</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfBedsOccupied}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="totalNumberOfMedicationErrors">
              <Form.Label>Total Number of Medication Errors</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.totalNumberOfMedicationErrors}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group controlId="totalNumberOfMedicationErrorsRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.totalNumberOfMedicationErrorsRemarks}
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
          <Form.Group controlId="totalNumberOfOpportunitiesOfMedicationErrors">
            <Form.Label>
              Total Number of Opportunities of Medication Errors
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfOpportunitiesOfMedicationErrors}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {/* <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfMedicationChartsReviewed">
              <Form.Label>Number of Medication Charts Reviewed</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfMedicationChartsReviewed}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfMedicationChartsReviewedRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfMedicationChartsReviewedRemarks}
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
        </Row> */}

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfPatientsDevelopingAdverseDrugReactions">
              <Form.Label>
                Number of Patients Developing Adverse Drug Reactions
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfPatientsDevelopingAdverseDrugReactions}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group controlId="numberOfPatientsDevelopingAdverseDrugReactionsRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={
                  formData.numberOfPatientsDevelopingAdverseDrugReactionsRemarks
                }
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
          <Col>
            <Form.Group controlId="numberOfUnitsTransfused">
              <Form.Label>Number of Units Transfused (Blood/Blood Products)</Form.Label>
              <Form.Control
                required
                value={formData.numberOfUnitsTransfused}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        {Array.from(
          { length: parseInt(formData.numberOfUnitsTransfused) },
          (_, index) => (
            <Row key={index} className="mb-3">
              <Col sm="8">
                <Form.Group controlId={`transfused-${index}`}>
                  <Form.Label>Units Transfused {index + 1}</Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={1} // Adjust the number of visible rows
                    value={
                      formData.numberOfUnitsTransfusedRemarks[
                        `transfused-${index}`
                      ] || ""
                    }
                    onChange={handleChange}
                    maxLength={MAX_CHAR_LIMIT}
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
              <Col sm="4">
                <Form.Group controlId={`remarks-${index}`}>
                  <Form.Label>Remarks {index + 1}</Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={1} // Adjust the number of visible rows
                    value={
                      formData.numberOfUnitsTransfusedRemarks[
                        `remarks-${index}`
                      ] || ""
                    }
                    onChange={handleChange}
                    maxLength={MAX_CHAR_LIMIT}
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
          )
        )}

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfTransfusionReaction">
              <Form.Label>Number of Transfusion Reaction (Blood/Blood Products)</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfTransfusionReaction}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfTransfusionReactionRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfTransfusionReactionRemarks}
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
          <Form.Group controlId="sumOfTimeTakenForBloodAndBloodComponents">
            <Form.Label>
              Sum of Time Taken for Blood & Blood Components (Minutes)
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.sumOfTimeTakenForBloodAndBloodComponents}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfBloodAndBloodComponentsCrossMatchedOrReserved">
            <Form.Label>
              Total No of Blood & Blood Components Cross-Matched/ Reserved
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={
                formData.totalNumberOfBloodAndBloodComponentsCrossMatchedOrReserved
              }
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcer">
              <Form.Label>
                Number of Patients Who Develop New / Worsening of Pressure Ulcer
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={
                  formData.numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcer
                }
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group controlId="numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcerRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={
                  formData.numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcerRemarks
                }
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
            <Form.Group controlId="numberOfUrinaryCatheterAssociatedUtisInThatMonth">
              <Form.Label>
                Number of uninary cather Infection (CAUTI) In a month
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={
                  formData.numberOfUrinaryCatheterAssociatedUtisInThatMonth
                }
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfUrinaryCatheterAssociatedUtisInThatMonthRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={
                  formData.numberOfUrinaryCatheterAssociatedUtisInThatMonthRemarks
                }
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
            <Form.Group controlId="numberOfUrinaryCatheterDaysInThatMonth">
              <Form.Label>
                Number of Urinary Catheter Days in that Month
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfUrinaryCatheterDaysInThatMonth}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfUrinaryCatheterDaysInThatMonthRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfUrinaryCatheterDaysInThatMonthRemarks}
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
          <Col>
            <Form.Group controlId="numberOfPatientCatheter">
              <Form.Label>
                Number of Patients in Catheter (new)
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.numberOfPatientCatheter}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="numberOfPatientCatheterRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfPatientCatheterRemarks}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent form submission if applicable
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberCentralLineAssociatedBloodStreamInfectionsInAMonth">
              <Form.Label>
                Number Central Line - Associated Blood Stream Infections in a
                Month
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={
                  formData.numberCentralLineAssociatedBloodStreamInfectionsInAMonth
                }
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberCentralLineAssociatedBloodStreamInfectionsInAMonthRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={
                  formData.numberCentralLineAssociatedBloodStreamInfectionsInAMonthRemarks
                }
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
            <Form.Group controlId="numberOfCentralLineDaysInThatMonth">
              <Form.Label>Number of Central Line Days in that Month</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfCentralLineDaysInThatMonth}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group controlId="numberOfCentralLineDaysInThatMonthRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfCentralLineDaysInThatMonthRemarks}
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
          <Col>
            <Form.Group controlId="numberOfPatientCentralLine">
              <Form.Label>
                Number of Patients in Central Line (new)
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.numberOfPatientCentralLine}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="numberOfPatientCentralLineRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfPatientCentralLineRemarks}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent form submission if applicable
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfSurgicalSiteInfectionsInAGivenMonth">
              <Form.Label>
                Number of Surgical Site Infections in a Given Month
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfSurgicalSiteInfectionsInAGivenMonth}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfSurgicalSiteInfectionsInAGivenMonthRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={
                  formData.numberOfSurgicalSiteInfectionsInAGivenMonthRemarks
                }
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
          <Form.Group controlId="numberOfNursingStaff">
            <Form.Label>Number of Nursing Staff</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfNursingStaff}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfPatientFalls">
              <Form.Label>Number of Patient Falls</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfPatientFalls}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfPatientFallsRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfPatientFallsRemarks}
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
            <Form.Group controlId="numberOfNearMissReported">
              <Form.Label>Number of Near Miss Reported</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfNearMissReported}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfNearMissReportedRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfNearMissReportedRemarks}
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
            <Form.Group controlId="numberOfIncidentsReported">
              <Form.Label>Number of Incidents Reported</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfIncidentsReported}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfIncidentsReportedRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfIncidentsReportedRemarks}
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
            <Form.Group controlId="numberOfParenteralExposures">
              <Form.Label>Number of Parenteral Exposures</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfParenteralExposures}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfParenteralExposuresRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfParenteralExposuresRemarks}
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
          <Form.Group controlId="totalNumberOfHandoversDoneAppropriately">
            <Form.Label>
              Total Number of Handovers Done Appropriately
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfHandoversDoneAppropriately}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfHandoverOpportunities">
            <Form.Label>Total Number of Handover Opportunities</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfHandoverOpportunities}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="totalNumberOfPatientsDevelopingPhlebitis">
              <Form.Label>
                Total Number of Patients Developing Phlebitis
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.totalNumberOfPatientsDevelopingPhlebitis}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="totalNumberOfPatientsDevelopingPhlebitisRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.totalNumberOfPatientsDevelopingPhlebitisRemarks}
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

{/* RESTRAINED PATIENTS SECTION - START */}
        {/* DYNAMIC RESTRAINED PATIENTS FIELDS */}{/* Number input */}
<Row className="mb-3">
  <Col md={4}>
    <Form.Group controlId="numberOfRestrainedPatients">
      <Form.Label>Number of Restrained Patients</Form.Label>
      <Form.Control
        type="number"
        min="0"
        value={formData.numberOfRestrainedPatients}
        onChange={handleNumberChange}
        required
      />
    </Form.Group>
  </Col>
</Row>

{/* Dynamic fields */}
{Object.entries(formData.restrainedPatientsDetails).map(([key, detail], index) => (
  <Row className="mb-3 border p-3 rounded" key={key}>
    <h5 className="mb-3">Patient {index + 1}</h5>

    <Col md={6}>
      <Form.Group controlId={`restrainedPatientType-${key}`}>
        <Form.Label>Type of Restraint</Form.Label>
        <Form.Select
          value={detail.type || ""}
          onChange={(e) => handleDetailChange(key, "type", e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="chemical">Chemical</option>
          <option value="physical">Physical</option>
        </Form.Select>
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group controlId={`restrainedPatientRemark-${key}`}>
        <Form.Label>Remark</Form.Label>
        <Form.Control
          as="textarea"
          rows={1}
          value={detail.remark || ""}
          onChange={(e) => handleDetailChange(key, "remark", e.target.value)}
          required
          maxLength={MAX_CHAR_LIMIT}
        />
      </Form.Group>
    </Col>
  </Row>
))}


        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="numberOfRestraintInjuriesOrStrangulation">
              <Form.Label>Number of Restraint Injuries</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfRestraintInjuriesOrStrangulation}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfRestraintInjuriesOrStrangulationRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfRestraintInjuriesOrStrangulationRemarks}
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
            <Form.Group controlId="actualDeathsInICU">
              <Form.Label>Actual Deaths In ICU</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.actualDeathsInICU}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="actualDeathsInICURemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.actualDeathsInICURemarks}
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

<Table bordered size="sm" className="text-center">
  <thead>
    <tr>
      <th>APACHE Score</th>
      {apacheScores.map((item) => (
        <th key={item.score}>{item.score}</th>
      ))}
    </tr>
  </thead>

  <tbody>
    <tr>
      <th>No. of Patients</th>
      {apacheScores.map((item) => (
        <td key={item.score}>
          <Form.Control
            type="text"
            min="0"
            value={patients[item.score] || ""}
            onChange={(e) =>
              handlePatientChange(item.score, e.target.value)
            }
          />
        </td>
      ))}
    </tr>
  </tbody>
</Table>

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="predictedDeathsInICU">
              <Form.Label>Predicted Deaths In ICU</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.predictedDeathsInICU}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="predictedDeathsInICURemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.predictedDeathsInICURemarks}
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
            <Form.Group controlId="numberOfVentilatorAssociatedPneumonia">
              <Form.Label>Number Of Ventilator Associated Pneumonia</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfVentilatorAssociatedPneumonia}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfVentilatorAssociatedPneumoniaRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfVentilatorAssociatedPneumoniaRemarks}
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
            <Form.Group controlId="numberOfVentilatorDays">
              <Form.Label>Number Of Ventilator Days (new)</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.numberOfVentilatorDays}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="numberOfVentilatorDaysRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfVentilatorDaysRemarks}
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
          <Col>
            <Form.Group controlId="numberOfPatientVentilator">
              <Form.Label>
                Number of Patients in Ventilator
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.numberOfPatientVentilator}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="numberOfPatientVentilatorRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.numberOfPatientVentilatorRemarks}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent form submission if applicable
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>


        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="totalNumberOfRestraintPatientsDays">
              <Form.Label>Total Number of Restraint Patients Days</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.totalNumberOfRestraintPatientsDays}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group controlId="totalNumberOfRestraintPatientsDaysRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.totalNumberOfRestraintPatientsDaysRemarks}
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
          <Form.Group controlId="numberOfPatientsOnIVTherapy">
            <Form.Label>Number of Patients on IV Therapy</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfPatientsOnIVTherapy}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
   
<Row className="mb-3">
  <Col md={6}>
    <Form.Group controlId="totalIVLineChanges">
      <Form.Label>Total Number of IV Line Changes</Form.Label>
      <Form.Control
        type="number"
        min="0"
        value={formData.totalIVLineChanges}
        onChange={handleivlineChange}
        required
      />
    </Form.Group>
  </Col>
</Row>

{Array.from({ length: formData.totalIVLineChanges || 0 }).map(
  (_, index) => (
    <Row className="mb-3" key={index}>
      <Col md={6}>
        <Form.Group controlId={`ExtravasationVIPScore-${index}`}>
          <Form.Label>{`Extravasation VIP Score ${index + 1}`}</Form.Label>
          <Form.Select
            required
            value={
              formData.ivLineChangeRemarks?.[
                `ExtravasationVIPScore-${index}`
              ] || ""
            }
            onChange={handleivlineChange}
          >
            <option value="">Select Type</option>
            <option value="1">A (1)</option>
            <option value="2">B (2)</option>
            <option value="3">C (3)</option>
            <option value="4">D (4)</option>
            <option value="5">E (5)</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group controlId={`ExtravasationVIPScoreRemarks-${index}`}>
          <Form.Label>{`Remarks ${index + 1}`}</Form.Label>
          <Form.Control
            as="textarea"
            rows={1}
            required
            maxLength={MAX_CHAR_LIMIT}
            value={
              formData.ivLineChangeRemarks?.[
                `ExtravasationVIPScoreRemarks-${index}`
              ] || ""
            }
            onChange={handleivlineChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
          />
        </Form.Group>
      </Col>
    </Row>
  )
)}

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="incidentsOfDelining">
              <Form.Label>Incidents Of Delining</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.incidentsOfDelining}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="incidentsOfDeliningRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.incidentsOfDeliningRemarks}
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
        <br />

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="NumberofreturnstoICUwithin48hours">
              <Form.Label>Number of Returns to ICU within 48 hours</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.NumberofreturnstoICUwithin48hours}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="NumberofreturnstoICUwithin48hoursRemarks">
              <Form.Label> Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.NumberofreturnstoICUwithin48hoursRemarks}
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
        <br />

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="NumberofdischargestransfersfromtheICU">
              <Form.Label>
                Number of discharges /transfers from the ICU
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.NumberofdischargestransfersfromtheICU}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="NumberofdischargestransfersfromtheICURemarks">
              <Form.Label> Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.NumberofdischargestransfersfromtheICURemarks}
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
        <br />

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="NumberofReintubation">
              <Form.Label>Number of Reintubation</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.NumberofReintubation}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="NumberofReintubationRemarks">
              <Form.Label> Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.NumberofReintubationRemarks}
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
        <br />

        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="NumberofExtubation">
              <Form.Label>Number of Extubation</Form.Label>
              <Form.Control
                required
                type="text"
                value={formData.NumberofExtubation}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm="4">
            <Form.Group controlId="NumberofExtubationRemarks">
              <Form.Label> Remarks</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.NumberofExtubationRemarks}
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
        <br />

<button
  variant="primary"
  type="submit"
  className="mb-3"
  onClick={handleSubmit}
  disabled={isSubmitting}
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
}

export default MICU;

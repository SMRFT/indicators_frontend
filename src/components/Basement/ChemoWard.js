import React, { useState, useEffect } from "react";
import { Row, Form, Col, Alert, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../apiRequest"; // Adjust the import path as necessary

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

function ChemoWard() {
  const MAX_CHAR_LIMIT = 5000; // Define the max character limit
  const [validated, setValidated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    selectedDate: "",
    sumOfTimeTakenforInitialAssessment: "",
    totalNumberOfAdmissions: "",
    numberOfBedsOccupied: "",
    numberOfPatientsDischargedInsurance: "",
    sumOfTimeTakenForDischargeInsurance: "",
    numberOfPatientsDischargedPay: "",
    sumOfTimeTakenForDischargePay: "",
    // numberOfInPatients: "",
    totalNumberOfMedicationErrors: "",
    totalNumberOfMedicationErrorsRemarks: "",
    totalNumberOfOpportunitiesOfMedicationErrors: "",
    numberOfMedicationChartsReviewed: "",
    numberOfPatientsDevelopingAdverseDrugReactions: "",
    numberOfPatientsDevelopingAdverseDrugReactionsRemarks: "",
    numberOfUnitsTransfused: "",
    numberOfUnitsTransfusedRemarks: {},
    numberOfTransfusionReaction: "",
    numberOfTransfusionReactionRemarks: "",
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
    numberOfPatientCatheter:"",
    numberOfPatientCatheterRemarks:"",
    numberOfPatientCentralLine:"",
    numberOfPatientCentralLineRemarks:"",
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
    totalnumberOfPatientsDevelopingPhlebitisRemarks: "",
    numberOfRestraintInjuriesOrStrangulation: "",
    numberOfRestraintInjuriesOrStrangulationRemarks: "",
    totalNumberOfRestraintPatientsDays: "",
    totalNumberOfRestraintPatientsDaysRemarks: "",
    numberOfPatientsOnIVTherapy: "",
    totalIVLineChanges:"",
    ivLineChangeRemarks:{},
    incidentsOfDelining: "",
    incidentsOfDeliningRemarks: "",
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
          [`transfused-${index}`]: value, // Updating reaction
        },
      });
    } else if (id.includes("remarks")) {
      const index = parseInt(id.split("-")[1]);
      setFormData({
        ...formData,
        numberOfUnitsTransfusedRemarks: {
          ...formData.numberOfUnitsTransfusedRemarks,
          [`remarks-${index}`]: value, // Updating remarks
        },
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;

  if (!selectedDate) {
    setError("Please select a date");
    return;
  }

  if (form.checkValidity() === false) {
    e.stopPropagation();
  } else {
    setIsSubmitting(true); // 🔒 disable submit immediately
    try {
      const id = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");
      const formDataWithUser = {
        ...formData,
        id,
        name,
      };

      const response = await apiRequest(
        `${IndicatorBaseUrl}ChemoWard/`,
        "POST",
        formDataWithUser
      );

      setFormSubmitted(true);
      setError("");
    } catch (error) {
      if (error.message === "Data already exists for this date.") {
        setError("Data already exists for this date.");
      } else {
        setError(error.message || "Failed to submit data");
      }
      console.error("Error:", error.message);
    }
    finally {
      // 🔓 Re-enable after 3 seconds
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  }

  setValidated(true);
};

  useEffect(() => {
    if (formSubmitted) {
      const timeout = setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 6000); // 6 seconds

      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [formSubmitted]);

  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">Chemo Ward</h2>
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
            <Form.Label>Number of Patients Discharged (Insurance)</Form.Label>
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
            <Form.Label>Number of Patients Discharged (Pay)</Form.Label>
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
            <Form.Label>Number of In Patients</Form.Label>
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

        <Row className="mb-3">
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
        </Row>

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
              <Form.Label>Enter the Number of Units Transfused</Form.Label>
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
                  <Form.Label>Units Trancsfused {index + 1}</Form.Label>
                  <Form.Control
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
              <Form.Label>Number of Transfusion Reaction</Form.Label>
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
          <Col>
            <Form.Group controlId="numberOfUrinaryCatheterAssociatedUtisInThatMonth">
              <Form.Label>
                Number of uninary cather Infection (CAUTI) In a month
              </Form.Label>
              <Form.Control
                type="text"
                value={
                  formData.numberOfUrinaryCatheterAssociatedUtisInThatMonth
                }
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
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
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="numberOfUrinaryCatheterDaysInThatMonth">
              <Form.Label>
                Number of Urinary Catheter Days in that Month
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.numberOfUrinaryCatheterDaysInThatMonth}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
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
          <Col>
            <Form.Group controlId="numberCentralLineAssociatedBloodStreamInfectionsInAMonth">
              <Form.Label>
                Number Central Line - Associated Blood Stream Infections in a
                Month
              </Form.Label>
              <Form.Control
                type="text"
                value={
                  formData.numberCentralLineAssociatedBloodStreamInfectionsInAMonth
                }
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

 
          <Col>
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
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="numberOfCentralLineDaysInThatMonth">
              <Form.Label>Number of Central Line Days in that Month</Form.Label>
              <Form.Control
                type="text"
                value={formData.numberOfCentralLineDaysInThatMonth}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
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
            <Form.Group controlId="totalnumberOfPatientsDevelopingPhlebitisRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={1} // Adjust the number of visible rows
                value={formData.totalnumberOfPatientsDevelopingPhlebitisRemarks}
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
              <Form.Label>Incidents of Delining</Form.Label>
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
        <button
          variant="primary"
          type="submit"
          className="mb-3"
          onClick={handleSubmit}        
          disabled={isSubmitting} // ✅ prevents duplicate clicks
        >
        {isSubmitting ? "Saving..." : "Save"}
          {/* Save */}
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

export default ChemoWard;

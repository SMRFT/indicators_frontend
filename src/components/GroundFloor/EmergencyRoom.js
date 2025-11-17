import React, { useState, useEffect } from 'react';
import { Row, Form, Alert, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const EmergencyRoom = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ new state
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  const [formData, setFormData] = useState({
    id: '',  
    name: '',
    selectedDate: '',
    sumOfTimeTakenforInitialAssessment: '',
    numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaints: '',
    numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaintsRemarks: '',
    numberOfPatientsWhoHaveComeToTheEmergency: '',
    totalNumberOfSurgicalSiteInfectionInAGivenMonth: '',
    totalNumberOfSurgicalSiteInfectionInAGivenMonthRemarks: '',
    numberOfParenteralExposures: '',
    numberOfParenteralExposuresRemarks: '',
    numberOfIncidents: '',
    numberOfIncidentsRemarks: '',
    timeTakenforIndoorPatientsNurses: '',
    timeTakenforIndoorPatientsDoctors: '',
  });

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
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
      const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedDate: adjustedDate.toISOString().split('T')[0],
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

    // ✅ Disable button immediately
    setIsSubmitting(true);

    if (!selectedDate) {
      setError('Please select a date');
      setIsSubmitting(false);
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setIsSubmitting(false);
    } else {
      try {
        const id = localStorage.getItem('userId');
        const name = localStorage.getItem('userName');
        const formDataWithUser = {
          ...formData,
          id,
          name,
        };
        const response = await fetch(`${IndicatorBaseUrl}EmergencyRoom/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("access_token"),
          },
          body: JSON.stringify(formDataWithUser),
        });

        if (response.status === 400) {
          const errorText = await response.json();
          if (errorText.error === 'Data already exists for this date.') {
            setError('Data already exists for this date.');
          } else {
            throw new Error(errorText.error || 'Failed to submit data');
          }
        } else {
          setFormSubmitted(true); // success
          setError(''); // clear errors
        }
      } catch (error) {
        setError(error.message || 'Failed to submit data');
      }
    }

    setValidated(true);

    // ✅ Re-enable after 2 seconds
    setTimeout(() => setIsSubmitting(false), 2000);
  };
    
  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">Emergency Room</h2>
      <div style={{ float: "right" }} className='mt-3'>
         <div><b>ID: </b>{formData.id}</div>
         <div><b>Name: </b>{formData.name}</div>
       </div>
      <br/>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="position-relative mb-3" controlId="selectedDate">        
          <div className="position-relative">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ cursor: 'pointer',  color: '#EBB099',  fontSize: '25px' }}
              onClick={() => document.getElementById('datePicker').click()}
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
              <div className="position-absolute top-100 start-0 translate-middle-y" style={{ marginLeft: '50px', marginTop:"-15px" }}>
                {selectedDate.toLocaleDateString('en-GB')}
              </div>
            )}
          </div>
        </Form.Group>

        {/* ... All other input fields remain unchanged ... */}
        
<br/>

      <Form.Group className="mb-3" controlId="sumOfTimeTakenforInitialAssessment">
          <Form.Label>Time Taken for Initial Assesment</Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.sumOfTimeTakenforInitialAssessment}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaints">
            <Form.Label>Number of Returns to Emergency within 72 hours with Similar Presenting Complaints</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaints}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaintsRemarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={1} // Adjust the number of visible rows
              value={formData.numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaintsRemarks}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent form submission if applicable
                }
              }}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfPatientsWhoHaveComeToTheEmergency">
            <Form.Label>Number of Patients who Have come to the Emergency</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfPatientsWhoHaveComeToTheEmergency}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="totalNumberOfSurgicalSiteInfectionInAGivenMonth">
            <Form.Label>Total Number of Surgical Site Infection in a Given Month (Within 30 days)</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfSurgicalSiteInfectionInAGivenMonth}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="totalNumberOfSurgicalSiteInfectionInAGivenMonthRemarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={1} // Adjust the number of visible rows
              value={formData.totalNumberOfSurgicalSiteInfectionInAGivenMonthRemarks}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent form submission if applicable
                }
              }}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="numberOfParenteralExposures">
            <Form.Label>Number of Parenteral Exposures (Injury due to any sharp)</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfParenteralExposures}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="numberOfParenteralExposuresRemarks">
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
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="numberOfIncidents">
            <Form.Label>Number of incidents</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfIncidents}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="numberOfIncidentsRemarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={1} // Adjust the number of visible rows
              value={formData.numberOfIncidentsRemarks}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent form submission if applicable
                }
              }}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group controlId="timeTakenforIndoorPatientsNurses">
            <Form.Label>Time Taken for Indoor Patients Nurses (Mins)</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.timeTakenforIndoorPatientsNurses}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group controlId="timeTakenforIndoorPatientsDoctors">
            <Form.Label>Time Taken for Indoor Patients Doctors (Mins)</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.timeTakenforIndoorPatientsDoctors}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <button 
          variant="primary" 
          type="submit" 
          className="mb-3"
          disabled={isSubmitting} // ✅ disable button
        >
          {isSubmitting ? 'Saving...' : 'Save'} {/* Show submitting text */}
        </button>

        <Alert variant="success" show={formSubmitted}>
          Form submitted successfully.
        </Alert>

        <Alert variant="danger" show={error !== ''}>
          {error}
        </Alert>
      </Form>
    </StyledContainer>
  );
};

export default EmergencyRoom;

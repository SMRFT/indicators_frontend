import React, { useState, useEffect } from 'react';
import { Row, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import apiRequest from "../apiRequest";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const HR = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ New state
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  const [formData, setFormData] = useState({
    id: '',  
    name: '',
    selectedDate: '',
    numberOfAbsenteeism: '',
    numberOfNewJoinees: '',
    totalNumberOfStaffNursing: '',
    totalNumberOfPharamedicalStaff: '',
    totalNumberOfDoctors: '',
    totalNumberOfAdminStaff: '',
    totalNumberOfHouseKeepingStaff: '',
    numberOfStaffLeftTheOrganization: '',
    totalNumberOfStaff: '',
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

    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      setIsSubmitting(true); // 🔒 disable submit immediately

      try {
        const id = localStorage.getItem('userId');
        const name = localStorage.getItem('userName');
        const formDataWithUser = {
          ...formData,
          id,
          name,
        };

        const response = await apiRequest(
          `${IndicatorBaseUrl}HR/`,
          'POST',
          formDataWithUser
        );

         if (response?.error === 'Data already exists for this date.') {
    setError('Data already exists for this date.');
  } else {
    setFormSubmitted(true);
    setError('');
  }

} catch (error) {
  console.error('Error:', error.message);
  setError(error.message || 'Failed to submit data');
} finally {
        // 🔓 Re-enable after 3 seconds
        setTimeout(() => {
          setIsSubmitting(false);
        }, 3000);
      }
    }

    setValidated(true);
  };

  return (
    <StyledContainer className="NumericalData">
      <h2 className="text-center">HR</h2>
      <div style={{ float: "right" }} className="mt-3">
        <div><b>ID: </b>{formData.id}</div>
        <div><b>Name: </b>{formData.name}</div>
      </div>
      <br/>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="position-relative mb-3" controlId="selectedDate">
          <div className="position-relative">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ cursor: 'pointer', color: '#EBB099', fontSize: '25px' }}
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
              <div className="position-absolute top-100 start-0 translate-middle-y" style={{ marginLeft: '50px', marginTop: '-15px' }}>
                {selectedDate.toLocaleDateString('en-GB')}
              </div>
            )}
          </div>
        </Form.Group>
        <br />

        <Row className="mb-3">
          <Form.Group controlId="numberOfAbsenteeism">
            <Form.Label>No of Absenteeism</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfAbsenteeism}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfNewJoinees">
            <Form.Label>No of New Joinees</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfNewJoinees}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfStaffNursing">
            <Form.Label>Total No Of Nursing Staff</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfStaffNursing}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfPharamedicalStaff">
            <Form.Label>Total Number Of Paramedical Staff</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfPharamedicalStaff}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfDoctors">
            <Form.Label>Total Number Of Doctors</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfDoctors}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfAdminStaff">
            <Form.Label>Total Number Of Admin Staff</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfAdminStaff}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfHouseKeepingStaff">
            <Form.Label>Total Number Of HouseKeeping Staff</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfHouseKeepingStaff}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="numberOfStaffLeftTheOrganization">
            <Form.Label>No. of Staff left the Organization</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.numberOfStaffLeftTheOrganization}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="totalNumberOfStaff">
            <Form.Label>Total No of Staff</Form.Label>
            <Form.Control
              required
              type="text"
              value={formData.totalNumberOfStaff}
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
          disabled={isSubmitting} // ✅ disable after submit
        >
          {isSubmitting ? 'Saving...' : 'Save'}
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

export default HR;

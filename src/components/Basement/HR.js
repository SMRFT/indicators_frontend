import React, { useState, useEffect } from 'react';
import { Row, Form } from 'react-bootstrap';
import { message } from 'antd';
import apiRequest from "../apiRequest";
import { FormCard, TextField, DateField, SubmitButton, FormAlert } from "../Common/fields";

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
      message.warning('Please select a date.');
      setError('Please select a date');
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
      message.warning('Please fill out all required fields.');
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

        if (!response.success) {
          const errMsg = response.error || 'Failed to submit data';
          message.error(errMsg);
          setError(errMsg);
        } else {
          message.success('HR data submitted successfully!');
          setFormSubmitted(true);
          setError('');
        }
      } catch (error) {
        console.error('Error:', error.message);
        const errMsg = error.message || 'Failed to submit data';
        message.error(errMsg);
        setError(errMsg);
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
    <FormCard className="NumericalData">
      <h2 className="text-center">HR</h2>
      <div style={{ float: "right" }} className="mt-3">
        <div><b>ID: </b>{formData.id}</div>
        <div><b>Name: </b>{formData.name}</div>
      </div>
      <br/>

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
          <Form.Group controlId="numberOfAbsenteeism">
            <Form.Label>No of Absenteeism</Form.Label>
            <TextField
              required
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
            <TextField
              required
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
            <TextField
              required
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
            <TextField
              required
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
            <TextField
              required
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
            <TextField
              required
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
            <TextField
              required
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
            <TextField
              required
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
            <TextField
              required
              value={formData.totalNumberOfStaff}
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
          disabled={isSubmitting} // ✅ disable after submit
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </SubmitButton>

        <FormAlert variant="success" show={formSubmitted}>
          Form submitted successfully.
        </FormAlert>

        <FormAlert variant="danger" show={error !== ''}>
          {error}
        </FormAlert>
      </Form>
    </FormCard>
  );
};

export default HR;

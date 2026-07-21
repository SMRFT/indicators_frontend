import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiRequest from '../apiRequest';
import { FormCard, TextField, DateField, SubmitButton, FormAlert } from '../Common/fields';

function FrontOffice() {
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
    sumTotalPatientInTimeForConsultation: '',
    NumberOfOutPatients: '',
    OutPatientECHS: '',
    OutPatientESI: '',
    OutPatientRailway: '',
    OutPatientTNCM: '',
    OutPatientPAY: '',
    totalNumberOfOutPatients: 0,
    InPatientECHS: '',
    InPatientESI: '',
    InPatientRailway: '',
    InPatientTNCM: '',
    InPatientPAY: '',
    totalNumberOfInPatients: 0,
    MRI: '',
    CT: '',
    USG: '',
    ECHO: '',
    LAB: '',
    Xray: '',
    sumOfTotalPatientReportingtime: 0,
    DialysisInsurance: '',
    DialysisPay: '',
    DialysisTotal: 0,
  });

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    if (id && name) {
      setFormData((prevFormData) => ({ ...prevFormData, id, name }));
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
    const updatedValue = parseInt(value, 10) || 0;

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [id]: updatedValue };

      const totalNumberOfOutPatients = ['OutPatientECHS', 'OutPatientESI', 'OutPatientRailway', 'OutPatientTNCM', 'OutPatientPAY']
        .reduce((sum, field) => sum + (parseInt(updatedFormData[field], 10) || 0), 0);

      const sumOfTotalPatientReportingtime = ['MRI', 'CT', 'USG', 'ECHO', 'LAB', 'Xray']
        .reduce((sum, field) => sum + (parseInt(updatedFormData[field], 10) || 0), 0);

      const totalNumberOfInPatients = ['InPatientECHS', 'InPatientESI', 'InPatientRailway', 'InPatientTNCM', 'InPatientPAY']
        .reduce((sum, field) => sum + (parseInt(updatedFormData[field], 10) || 0), 0);

      const DialysisTotal = ['DialysisInsurance', 'DialysisPay']
        .reduce((sum, field) => sum + (parseInt(updatedFormData[field], 10) || 0), 0);

      return { ...updatedFormData, totalNumberOfOutPatients, sumOfTotalPatientReportingtime, totalNumberOfInPatients, DialysisTotal };
    });
  };

  const handleDateChange = (date) => setSelectedDate(date);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submits
    setIsSubmitting(true); // ✅ Disable submit

    const form = e.currentTarget;
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
        const formDataWithUser = { ...formData, id, name };

        const response = await apiRequest(`${IndicatorBaseUrl}FrontOffice/`, 'POST', formDataWithUser);

        if (!response.success) {
          if (response.status === 400 && response.data?.error === 'Data already exists for this date.') {
            setError('Data already exists for this date.');
          } else {
            throw new Error(response.error || 'Failed to submit data');
          }
        } else {
          setFormSubmitted(true);
          setError('');
        }
      } catch (err) {
        setError(err.message || 'Failed to submit data');
      }
    }

    setValidated(true);

    // ✅ Re-enable submit after 2 seconds
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <FormCard className="NumericalData">
      <h1 className="text-center mb-4">Front Office</h1>
      <div style={{ float: "right" }} className='mt-3'>
        <div><b>ID: </b>{formData.id}</div>
        <div><b>Name: </b>{formData.name}</div>
      </div>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="selectedDate">
          <DateField
            id="datePicker"
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select Date"
          />
        </Form.Group>

        {/* All your other form groups remain the same */}
        
        <br />
        <Form.Group className="mb-3" controlId="sumTotalPatientInTimeForConsultation">
          <Form.Label>Sum total Patient - in time for Consultation</Form.Label>
          <TextField
            required
            type="text"
            value={formData.sumTotalPatientInTimeForConsultation}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>
        <br />

        <Form.Group className="mb-3" controlId="NumberOfOutPatients">
          <Form.Label>Number of OP Patients</Form.Label>
          <TextField
            required
            type="text"
            value={formData.NumberOfOutPatients}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>
        <br />
        <h4 className="text-center mb-4" style={{ backgroundColor: "#EBB099", color: "white" }}>Total No of Out-Patients</h4>

        <Form.Group className="mb-3" controlId="OutPatientECHS">
          <Form.Label>ECHS</Form.Label>
          <TextField
            required
            type="text"
            value={formData.OutPatientECHS}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="OutPatientESI">
          <Form.Label>ESI</Form.Label>
          <TextField
            required
            type="text"
            value={formData.OutPatientESI}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="OutPatientRailway">
          <Form.Label>Railway</Form.Label>
          <TextField
            required
            type="text"
            value={formData.OutPatientRailway}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="OutPatientTNCM">
          <Form.Label>TNCM</Form.Label>
          <TextField
            required
            type="text"
            value={formData.OutPatientTNCM}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="OutPatientPAY">
          <Form.Label>PAY</Form.Label>
          <TextField
            required
            type="text"
            value={formData.OutPatientPAY}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="totalNumberOfOutPatients">
          <Form.Label>Total Number of Out Patients</Form.Label>
          <TextField
            type="text"
            value={formData.totalNumberOfOutPatients}
            readOnly />
        </Form.Group>

        <h4 className="text-center mb-4" style={{ backgroundColor: "#EBB099", color: "white" }}>Total No of In-Patients</h4>

        <Form.Group className="mb-3" controlId="InPatientECHS">
          <Form.Label>ECHS</Form.Label>
          <TextField
            required
            type="text"
            value={formData.InPatientECHS}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="InPatientESI">
          <Form.Label>ESI</Form.Label>
          <TextField
            required
            type="text"
            value={formData.InPatientESI}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="InPatientRailway">
          <Form.Label>Railway</Form.Label>
          <TextField
            required
            type="text"
            value={formData.InPatientRailway}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="InPatientTNCM">
          <Form.Label>TNCM</Form.Label>
          <TextField
            required
            type="text"
            value={formData.InPatientTNCM}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="InPatientPAY">
          <Form.Label>PAY</Form.Label>
          <TextField
            required
            type="text"
            value={formData.InPatientPAY}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="totalNumberOfInPatients">
          <Form.Label>Total Number of In Patients</Form.Label>
          <TextField
            type="text"
            value={formData.totalNumberOfInPatients}
            readOnly />
        </Form.Group>

        <h4 className="text-center mb-4" style={{ backgroundColor: "#EBB099", color: "white" }}>Sum of total patients reporting time</h4>

        <Form.Group className="mb-3" controlId="MRI">
          <Form.Label>MRI</Form.Label>
          <TextField
            required
            type="text"
            value={formData.MRI}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="CT">
          <Form.Label>CT</Form.Label>
          <TextField
            required
            type="text"
            value={formData.CT}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="USG">
          <Form.Label>USG</Form.Label>
          <TextField
            required
            type="text"
            value={formData.USG}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="ECHO">
          <Form.Label>ECHO</Form.Label>
          <TextField
            required
            type="text"
            value={formData.ECHO}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="LAB">
          <Form.Label>LAB</Form.Label>
          <TextField
            required
            type="text"
            value={formData.LAB}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Xray">
          <Form.Label>Xray</Form.Label>
          <TextField
            required
            type="text"
            value={formData.Xray}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="sumOfTotalPatientReportingtime">
          <Form.Label>Sum of total patients reporting time</Form.Label>
          <TextField
            type="text"
            value={formData.sumOfTotalPatientReportingtime}
            readOnly />
        </Form.Group>

        <h4 className="text-center mb-4" style={{ backgroundColor: "#EBB099", color: "white" }}>Dialysis</h4>

        <Form.Group className="mb-3" controlId="DialysisInsurance">
          <Form.Label>Insurance</Form.Label>
          <TextField
            required
            type="text"
            value={formData.DialysisInsurance}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="DialysisPay">
          <Form.Label>PAY</Form.Label>
          <TextField
            required
            type="text"
            value={formData.DialysisPay}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            Please fill out this field
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="DialysisTotal">
          <Form.Label>Dialysis Total</Form.Label>
          <TextField
            type="text"
            value={formData.DialysisTotal}
            readOnly />
        </Form.Group>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </SubmitButton>
      </Form>

      {formSubmitted && <FormAlert variant="success" className="mt-3">Form submitted successfully!</FormAlert>}
      {error && <FormAlert variant="danger" className="mt-3">{error}</FormAlert>}
    </FormCard>
  );
}

export default FrontOffice;

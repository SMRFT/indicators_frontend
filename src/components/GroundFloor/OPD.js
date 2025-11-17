import React, { useState ,useEffect} from 'react';
import { Row, Form, Button ,Alert} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const OPD=()=>{
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ added
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  const [formData, setFormData] = useState({
      id: '',  
      name: '',
      selectedDate:'',
      sumOfTimeTakenforInitialAssessment:'',
      sumOfTimeTakenForConsultation:'',
      totalNumberOfOutPatients:'',
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
    if (isSubmitting) return; // ✅ prevent multiple clicks
    setIsSubmitting(true); // ✅ disable button immediately

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
        const formDataWithUser = {
          ...formData,
          id,
          name,
        };
        const response = await fetch(`${IndicatorBaseUrl}OPD/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:localStorage.getItem("access_token"),
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
          setIsSubmitting(false); // ✅ re-enable if failed
        } else {
          setFormSubmitted(true);
          setError('');
        
          // ✅ Re-enable submit after 3 seconds
          setTimeout(() => {
            setIsSubmitting(false);
            // setFormSubmitted(false); // optionally hide success alert too
          }, 2000);
        }
      } catch (error) {
        console.error('Error:', error.message);
        setError(error.message || 'Failed to submit data');
        setIsSubmitting(false); // ✅ re-enable if error
      }
    }
  
    setValidated(true);
  };

  return (
    <StyledContainer className="NumericalData">
    <h2 className="text-center">OPD</h2>
    <div style={{float:"right"}} className='mt-3'>
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

        <Row className="mb-3">
          <Form.Group controlId="sumOfTimeTakenforInitialAssessment">
                <Form.Label >
                Sum of Time Taken for Initial Assessment (Minutes)
                </Form.Label>
                <Form.Control
                required
                type="text"
                value={formData.sumOfTimeTakenforInitialAssessment}
                onChange={handleChange} />
                <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="sumOfTimeTakenForConsultation">
                <Form.Label >
                Sum of Time Taken For Consultation
                </Form.Label>
                <Form.Control
                required
                type="text"
                value={formData.sumOfTimeTakenForConsultation}
                onChange={handleChange} />
                <Form.Control.Feedback type="invalid">
                Please fill out this field
              </Form.Control.Feedback>
            </Form.Group>
        </Row>

        <Row className="mb-3">
        <Form.Group controlId="totalNumberOfOutPatients">
              <Form.Label >
              Total Numberof OP
              </Form.Label>
              <Form.Control
              required
              type="text"
              value={formData.totalNumberOfOutPatients}
              onChange={handleChange} />
              <Form.Control.Feedback type="invalid">
               Please fill out this field
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

      {/* ✅ Just added disabled attribute here */}
      <button
        variant="primary"
        type="submit"
        className="mb-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
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
}
export default OPD;

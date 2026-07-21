import React, { useState, useEffect } from 'react';
import { Row, Form, Col, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiRequest from "../apiRequest";
import {
  FormCard,
  TextField,
  SubmitButton,
  FormAlert,
  DateField,
} from "../Common/fields";

const ChemoWardRawData = ({ showHeading = true }) => {
    const [noOfPatients, setNoOfPatients] = useState('1');
    const [selectedDate, setSelectedDate] = useState(null);
    const [validated, setValidated] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState([]);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
    const patientFields = [
        { key: 'patientName', label: 'Patient Name' },
        { key: 'age', label: 'Age' },
        { key: 'uhidNo', label: 'U H I D No' },
        { key: 'wardTransferSheet', label: 'Patient Time to be Ward Time Entered In Ward Transfer Sheet By Dmo' },
        { key: 'timeByDmo', label: 'Assesment Completed Time By Dmo' },
        { key: 'timeHrsmts', label: 'Time Hr/ Mts By Dmo' },
        { key: 'carePlanPlanDoc', label: 'Care Plan Documented By Dmo Yes / No' },
        { key: 'nutritionAssessment', label: 'Nutrition Assesment Completed By Dmo Yes / No' },
        { key: 'initialAssessment', label: 'Name of the Doctor Who perform Initial Assesment' },
        { key: 'transferSheet', label: 'Patient Time to Entered With Transfer Sheet By Dmo' },
        { key: 'assessmentCompletedTimeBy', label: 'Assessment Completed Time By Nurse' },
        { key: 'nursingCarePlan', label: 'Nursing Care Plan Documented Yes / No' },
        { key: 'primaryConsultant', label: 'Name Of The Primary Consultant' },
        { key: 'staffSign', label: 'Name Of The Staff Sign - Id No' },
        { key: 'inchargeStaffName', label: 'Incharge Staff Name - Id No' },
    ];

    useEffect(() => {
        setFormData([{ selectedDate: null }]);
    }, []);

    useEffect(() => {
        if (selectedDate) {
            setFormData((prevFormData) => {
                return prevFormData.map((patient, index) => {
                    if (index === 0) {
                        return { ...patient, selectedDate: selectedDate.toISOString().split('T')[0] };
                    }
                    return patient;
                });
            });
        }
    }, [selectedDate]);
    

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handlePatientCountChange = (e) => {
        const value = parseInt(e.target.value, 10) || '';
        setNoOfPatients(value.toString());
        const patients = Array.from({ length: value }, () => ({
            patientName: '',
            age: '',
            uhidNo: '',
            wardTransferSheet: '',
            timeByDmo: '',
            timeHrsmts: '',
            carePlanPlanDoc: '',
            nutritionAssessment: '',
            initialAssessment: '',
            transferSheet: '',
            assessmentCompletedTimeBy: '',
            nursingCarePlan: '',
            primaryConsultant: '',
            staffSign: '',
            inchargeStaffName: '',
        }));
        setFormData(patients);
    };

    useEffect(() => {
        const id = localStorage.getItem('userId');
        const name = localStorage.getItem('userName');
        if (id && name) {
            setUserId(id);
            setUserName(name);
        }
    }, []);
    
    const handlePatientDataChange = (index, field, value) => {
        const newPatients = [...formData];
        newPatients[index] = { ...newPatients[index], [field]: value };
        setFormData(newPatients);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
    
        // Check if the date is selected
        if (!selectedDate) {
            setError('Please select a date');
            return; // Prevent form submission if date is not selected
        }
    
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            try {
                // Adjusting the date by removing timezone offset
                const adjustedDate = selectedDate
                    ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
                        .toISOString()
                        .split('T')[0]
                    : null;
    
                const formDataWithUser = {
                    id: userId,
                    name: userName,
                    selectedDate: adjustedDate, // Ensure adjusted date is sent here
                    raw_data: formData.map(patient => {
                        const { selectedDate, ...rest } = patient; // Exclude selectedDate from patient data
                        return rest;
                    }),
                };
    
                    const response = await apiRequest(
                    `${IndicatorBaseUrl}ChemowardRawData/`,
                    'POST',
                    formDataWithUser
                    );

    
                if (response.status === 400) {
                    const errorText = await response.json();
                    console.error('errorText:', errorText);
                    if (errorText.error === 'Data already exists for this date.') {
                        setError('Data already exists for this date.');
                    } else {
                        throw new Error(errorText.error || 'Failed to submit data');
                    }
                } else {
                    // Set success message after successful submission
                    setFormSubmitted(true);
                    setError('');
                }
            } catch (error) {
                console.error('Error:', error.message);
                setError(error.message || 'Failed to submit data');
            }
        }
        setValidated(true);
    };
    
    return (
        <FormCard className="RawData">
            <div>
                {showHeading && <h2 className="text-center">ChemoWard RawData</h2>}
                <div style={{ float: "right" }} className='mt-3'>
                    <div><b>ID: </b>{userId}</div>
                    <div><b>Name: </b>{userName}</div>
                </div>
                <br/>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group controlId="selectedDate">
                        <DateField
                            id="datePicker"
                            selected={selectedDate}
                            onChange={handleDateChange}
                            placeholderText="Select Date"
                        />
                    </Form.Group>
                    <br />
                    <Row>
                        <Col xs="2">
                            <Form.Label htmlFor="noOfPatients" style={{ fontWeight: "bold" }}>No of Patients</Form.Label>
                        </Col>
                        <Col xs="1" style={{ marginLeft: "-6%", marginTop: "-0.5%" }}>
                            <TextField
                                required
                                id="noOfPatients"
                                value={noOfPatients}
                                onChange={handlePatientCountChange}
                                pattern="\d*"
                            />
                            <Form.Control.Feedback type="invalid">Please fill out this field</Form.Control.Feedback>
                        </Col>
                    </Row>
    
                    <Table bordered className="align-middle mt-2">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: 'rgb(149,188,176)', color: '#FFFFFF' }}>Field</th>
                                <th style={{ backgroundColor: 'rgb(149,188,176)', color: '#FFFFFF' }}>Patient 1</th>
                                {[...Array(parseInt(noOfPatients) - 1 || 0)].map((_, index) => (
                                    <th style={{ backgroundColor: 'rgb(149,188,176)', color: '#FFFFFF' }} key={index + 2}>Patient {index + 2}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {patientFields.map(({ key, label }, fieldIndex) => (
                                <tr key={fieldIndex}>
                                    <td style={{ textAlign: 'left' }}>{label}</td>
                                    {formData.map((patient, patientIndex) => (
                                        <td key={patientIndex} style={{ textAlign: 'left' }}>
                                            <TextField
                                                style={{ border: "white" }}
                                                value={patient[key]}
                                                onChange={(e) => handlePatientDataChange(patientIndex, key, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <SubmitButton type="submit">Save</SubmitButton>
                    {formSubmitted && <FormAlert variant="success" className="mt-2">Form submitted successfully!</FormAlert>}
                    {error && <FormAlert variant="danger" className="mt-2">{error}</FormAlert>}
                </Form>
            </div>
        </FormCard>
    );
};

export default ChemoWardRawData;

import React, { useState } from 'react';
import { Row, Form, Col, Table } from 'react-bootstrap';
import './Availability.css';
import { bedOptions } from '../constant';
import apiRequest from '../apiRequest';
import { SelectField } from '../Common/fields';

function Availability() {
  const [selectedWard, setSelectedWard] = useState('');
  const [numberOfBedsOccupied, setNumberOfBedsOccupied] = useState(0);
  const [numberOfBedsAvailable, setNumberOfBedsAvailable] = useState(0);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const handleWardChange = async (value) => {
    setSelectedWard(value);
    // Fetch data from backend API based on selected ward
    try {
      const response = await apiRequest(`${IndicatorBaseUrl}availabilityofroomsandbeds/${value}/`);
      if (response.success) {
        setNumberOfBedsOccupied(response.data.numberOfBedsOccupied);
        console.log('numberOfBedsOccupied:', response.data.numberOfBedsOccupied);
        setNumberOfBedsAvailable(response.data.numberOfBedsAvailable);
        console.log('numberOfBedsAvailable:', response.data.numberOfBedsAvailable);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <div className="availability-container">
        <form className="availability-form">
          <h1 className="text-center mt-4">Availability</h1>
          <br/>
          <Row className="justify-content-center align-items-center mb-2">
            <Col xs="auto" className="d-flex align-items-center">
              <Form.Label className="mb-0 mr-3" style={{whiteSpace:"nowrap"}}><b>Ward</b></Form.Label>
              <SelectField
                style={{ minWidth: "220px", margin: "0 1rem" }}
                value={selectedWard}
                onChange={(e) => handleWardChange(e.target.value)}
              >
                <option value="">Select Ward</option>
                {bedOptions.map((ward, index) => (
                  <option key={index} value={ward}>
                    {ward}
                  </option>
                ))}
              </SelectField>
            </Col>
          </Row>
          <br/>
          <Table
            bordered
            style={{
              backgroundColor: 'var(--color-surface-inset)',
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-border)',
            }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: 'var(--color-surface-raised)', borderBottom: '2px solid var(--color-accent)' }}>No of Occupied</th>
                <th style={{ backgroundColor: 'var(--color-surface-raised)', borderBottom: '2px solid var(--color-accent)' }}>No of availability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{numberOfBedsOccupied}</td>
                <td>{numberOfBedsAvailable}</td>
              </tr>
            </tbody>
          </Table>
        </form>
      </div>
    </div>
  );
}

export default Availability;
import React, { useState, useEffect } from 'react';
import { Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './Login.css';

const Login = ({ title, endpoint, setUserRole }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionName } = location.state || {};
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Section name before login:', sectionName);
    console.log('id after login:', employeeId);
    console.log('name after login:', username);
  }, [location.state, sectionName,employeeId,username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login request with endpoint:', endpoint);
    try {
      const response = await fetch(`${IndicatorBaseUrl}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ employeeId,password, endpoint }), // Added employeeId
      });

      if (response.ok) {
        const responseData = await response.json();
        const userRole = responseData.role;
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userId', responseData.id);
        localStorage.setItem('userName', responseData.name);
        console.log('User Role after login:', userRole);
        console.log('id after login:', responseData.id);
        console.log('name after login:', responseData.name);


        setUserRole(userRole);
        if (sectionName) {
          navigate(`/${sectionName}`);
        } else {
          navigate('/Report');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid employee ID, username, or password');
      }
    } catch (error) {
      setError('An error occurred while logging in');
    }
};


  return (
    <div>
    <div className="top-container"></div>
    <div className="login mt-5">
      <StyledContainer className="login-container">
        <h2 className="text-center mb-5">{title}</h2>
        <Form onSubmit={handleSubmit}>
          {/* Employee ID Field */}
          <Row className="mb-3">
            <Form.Group controlId="formEmployeeId">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                autoComplete="off"
                required
              />
              <Form.Control.Feedback type="invalid">Employee ID is required.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          {/* Password Field */}
          <Row className="mb-3">
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          {/* Error Message */}
          {error && <div className="text-danger mb-3">{error}</div>}

          {/* Submit Button */}
          <center>
            <button type="submit" className="mb-3">Login</button>
          </center>
        </Form>
      </StyledContainer>
    </div>
    </div>
  );
};

const StyledContainer = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 350px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const EmployeeLogin = ({ setUserRole }) => <Login title="Employee Login" endpoint="EmployeeLogin" setUserRole={setUserRole} />;
const AdminLogin = ({ setUserRole }) => <Login title="Admin Login" endpoint="AdminLogin" setUserRole={setUserRole} />;

export { EmployeeLogin, AdminLogin };





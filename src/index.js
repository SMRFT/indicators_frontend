import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';

function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMjM0NTY3IiwiZW1haWwiOiJwYXJ0aGliYW4ubUBzaGlub3ZhLmluIiwibmFtZSI6InRlc3RpbmcgbWFpbCIsImFsbG93ZWQtYWN0aW9ucyI6WyJTSEktUC1DVC1SVyIsIlNISS1QLUYyUy1SVyIsIlNULVAtTlRGLVIiLCJTVC1QLURFUy1SIiwiU0hJLVAtR0VUUkFXLVJXIiwiU0hJLVAtQ0hFTU9SLVJXIiwiU0QtUC1SQi1SVyIsIlNISS1QLVRSQUlOUi1SVyIsIlNULVItQ0RSIiwiTURDLVAtR1NQLVIiLCJTRC1QLUlOVi1SVyIsIk1EQy1QLUdDUC1SIiwiU0hJLVAtT1QtUlciLCJTSEktUC1OSUNVLVJXIiwiU0hJLVAtU1VQSU5DLVJXIiwiU0hJLVAtRU1SLVJXIiwiU0hJLVAtTUlDVS1SVyIsIlNISS1QLUYzLVJXIiwiTURDLUFQSS1QR1AtUlciLCJTSEktUC1TSUNVUi1SVyIsIlNISS1QLUNIRU1PLVJXIiwiU0hJLVAtTUlDVVItUlciLCJTSEktUC1TSUNVLVJXIiwiU0hJLVAtRjFSLVJXIiwiU0hJLVAtWFJBWS1SVyIsIlNISS1QLUVNUlItUlciLCJTSEktUC1PUEQtUlciLCJNREMtQVBJLUwtUlciLCJNREMtUC1BRC1SVyIsIk1EQy1SLVBEQyIsIk1EQy1QLUFBVS1SVyIsIlNISS1QLUhBTkQtUlciLCJNREMtUC1HT0EtUlciLCJTVC1SLUEiLCJTSEktUC1FWFAtUlciLCJTSEktUC1UUkFJTi1SVyIsIlNISS1QLVBIQVJNLVJXIiwiU1QtQVBJLUNSRC1SVyIsIk1EQy1BUEktU0dQLVJXIiwiU0hJLVAtREVMLVJXIiwiU0hJLVAtSU5DIiwiR1AtUC1HQ04tUiIsIk1EQy1BUEktT0dQLVJXIiwiU0hJLVAtRjEtUlciLCJTRC1QLUNULVIiLCJTSEktUC1SRUMtUlciLCJTSEktUC1GMlNSLVJXIiwiTURDLUFQSS1BR1AtUlciLCJTVC1QLVRETC1SIiwiU0hJLVAtVVBELVJXIiwiU1QtQVBJLUFNQy1SVyIsIk1EQy1QLUdBUC1SIiwiU0hJLVAtRlJOVC1SVyIsIlNISS1QLUYyLVJXIiwiU1QtUC1ERVMtUlciLCJTSEktUC1IUi1SVyIsIlNISS1QLVBIWS1SVyIsIlNISS1QLUhBTkRSLVJXIiwiU0hJLVAtTVJELVJXIiwiU0hJLVAtUkVDUi1SVyIsIlNULUFQSS1CUkQtUlciLCJNREMtQVBJLVBEQy1SVyIsIlNISS1QLURFTFJBVy1SVyIsIlNISS1QLVVQRFJBVy1SVyIsIk1EQy1BUEktQVQtUiIsIlNISS1QLURJQS1SVyIsIlNISS1QLUYyUi1SVyIsIlNISS1QLUFWQUlMLVJXIiwiU0hJLVAtRk9STS1SVyIsIlNULUFQSS1FTVAtUiIsIlNULVAtQ01ULVIiLCJTVC1QLVRETC1SVyIsIlNULVAtQlJELVIiLCJNREMtUC1HUFAtUiIsIlNISS1QLUlOQ0MtUlciLCJTSEktUC1JTkMtUlciLCJTSEktUC1NT0NLLVJXIiwiU1QtUC1DTVQtUlciLCJTSEktUC1MQUItUlciLCJTRC1QLUlWTS1SVyIsIlNISS1QLUYzUi1SVyIsIlNISS1QLU5JQ1VSLVJXIiwiU0hJLVAtRjFTUi1SVyIsIlNISS1QLVNVUElOVi1SVyIsIlNJLVItSU5EIiwiU1QtUC1TTk8tUlciLCJTSEktUC1NUkktUlciLCJNREMtUC1QTlBSLVIiLCJNREMtUC1HT1AtUiIsIlNISS1QLUYxUy1SVyIsIk1EQy1BUEktQ0dQLVJXIiwiU1QtUC1OVEYtUlciLCJTSEktUC1HSS1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODQwMTY4NjcsImV4cCI6MTc4NDEwMzg2N30.RrYCOKJhsds0HguFlj_CIPzxe1BjTzIXEXV3nxJ8-BkERQ9n63EIiVsQVUJDTp7AtyDLSyCaYjtF_p-o-SgqIN_4qyG2SYnW5B-5yHXLkLBX3lJlWRXj84fSinbAleARxrjWMyxteJBlvEFZLMavOY3yX93AK97NF6WP4UEG1QitsjlsFSHVKosmuJtqW0LuFYHwlgqPurDa6ZN86gTLi15z42GbJWLRED-vd46JHkUQ2KjumWcunvyWYoSA8BNjJy2xO6F9Gm4_eGZQS83pxksTzAoGkJIngtvfE7WzQ-wfUw78iiq6iGvaEm0Ey99ixxJa7Nex9WKeBSh7ydTvVQ";
  const selectedBranch = "SHB001";
  localStorage.setItem("access_token", dev_token);
  localStorage.setItem("selected_branch", selectedBranch);
  return dev_token;
}

function validate(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

function RootRenderer() {
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    let accessToken = localStorage.getItem("access_token");

    // set dev token only when your env flag is true (string check)
    if (!accessToken && process.env.REACT_APP_LOCAL_DEV_ENVIRONMENT === 'true') {
      accessToken = setForLocalDev();
    }

    try {
      if (!accessToken) throw new Error("No token found");
      const payload = validate(accessToken);

      // store raw payload and a few convenient fields
      localStorage.setItem("user_payload", JSON.stringify(payload));
      localStorage.setItem("access_token", accessToken);

      // safe extraction of common claims
      const userId = payload.aud ?? null;
      const userName = payload.name ?? payload.full_name ?? null;
      const userEmail = payload.email ?? payload.em ?? null;
      const allowedActions = payload["allowed-actions"] ?? [];

      // Default role
      let userRole = "Employee";

      // If allowed-actions contains Admin code
      if (allowedActions.includes("SI-R-IND")) {
        userRole = "Admin";
      }
      // Else if contains Employee code
      else if (allowedActions.includes("SI-R-INDE")) {
        userRole = "Employee";
      }
      else if (allowedActions.includes("SI-R-INDIN")) {
        userRole = "In-Charge";
      }
      localStorage.setItem("role", userRole);

      if (!userId || !userName) {
        throw new Error("Missing required user data (employeeId or name)");
      }

      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      if (userEmail) localStorage.setItem("userEmail", userEmail);
      if (userRole) localStorage.setItem("userRole", userRole);

      setIsValidToken(true);
    } catch (err) {
      console.error("Token validation failed:", err.message);

      // clear any potentially-broken data
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_payload");
      localStorage.removeItem("userId");
      localStorage.removeItem("useName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");

      // fallback redirect - ensure you have REACT_APP_LOGIN_REDIRECT_URL set
      const redirectUrl = process.env.REACT_APP_LOGIN_REDIRECT_URL || '/login';
      window.location.href = redirectUrl;
    }
  }, []);

  return isValidToken ? (
 <BrowserRouter basename={process.env.PUBLIC_URL || "/"}>
    <App />
  </BrowserRouter>
  ) : null;
}

// mount root
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <RootRenderer />
  </StrictMode>
);
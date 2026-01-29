import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';

function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJHTC1QLVAtUlciLCJHTC1QLUVCVC1SVyIsIlNISS1QLUYyLVJXIiwiU0hJLVAtSEFORFItUlciLCJTSEktUC1NT0NLLVJXIiwiTURDLVAtUkVHLVJXIiwiU0hJLVAtRlJOVC1SVyIsIlNISS1QLVRSQUlOLVJXIiwiU0hJLVAtWFJBWS1SVyIsIlNISS1QLUNULVJXIiwiU0hJLVAtTEFCLVJXIiwiU0hJLVAtRU1SLVJXIiwiTURDLUFQSS1BVC1SIiwiTURDLVAtU09SLVIiLCJTVC1QLU5URi1SIiwiU0hJLVAtREVMLVJXIiwiU0hJLVAtVFJBSU5SLVJXIiwiU0hJLVAtTUlDVVItUlciLCJTSEktUC1FWFAtUlciLCJTSEktUC1GMVNSLVJXIiwiU0hJLVAtTklDVVItUlciLCJTVC1QLVNOTy1SVyIsIlNULVAtQ01ULVIiLCJTSEktUC1ERUxSQVctUlciLCJNREMtUC1QTlAtUlciLCJTSEktUC1NSUNVLVJXIiwiU0ktUi1JTkQiLCJTVC1QLURFUy1SVyIsIkdMLVAtQU5ELVJXIiwiTURDLVAtQ0RFLVJXIiwiU0hJLVAtSFItUlciLCJTSEktUC1PVC1SVyIsIlNULVAtTlRGLVJXIiwiU0hJLVAtSU5DIiwiR0wtUC1OREMtUlciLCJTVC1QLVRETC1SIiwiR0wtUC1FRC1SVyIsIlNISS1QLUYxUy1SVyIsIk1EQy1QLVJFRy1SIiwiU0hJLVAtSEFORC1SVyIsIk1EQy1QLU9TQi1SVyIsIlNISS1QLUdFVFJBVy1SVyIsIlNISS1QLUZPUk0tUlciLCJTSEktUC1PUEQtUlciLCJNREMtQVBJLUxCTi1SIiwiU0hJLVAtRjEtUlciLCJTSEktUC1GMlMtUlciLCJTSEktUC1GMlItUlciLCJTSEktUC1FTVJSLVJXIiwiU0hJLVAtRjNSLVJXIiwiTURDLVAtUkRFLVJXIiwiTURDLVAtQVNNLVJXIiwiU0hJLVAtRjMtUlciLCJTSEktUC1DSEVNT1ItUlciLCJTVC1SLUEiLCJHUC1QLUdDTi1SIiwiR0wtUC1FQUQtUlciLCJNREMtUC1QTlAtUiIsIlNISS1QLUFWQUlMLVJXIiwiU0hJLVAtU0lDVVItUlciLCJTVC1QLURFUy1SIiwiU0hJLVAtVVBEUkFXLVJXIiwiU0hJLVAtTVJJLVJXIiwiTURDLVAtUFRFLVJXIiwiTURDLVAtUE5QUi1SIiwiTURDLVAtVFJCLVJXIiwiU0hJLVAtUEhZLVJXIiwiU0hJLVAtVVBELVJXIiwiU0hJLVAtRjFSLVJXIiwiTURDLUFQSS1DRFItUiIsIlNISS1QLVBIQVJNLVJXIiwiU1QtUC1DTVQtUlciLCJTSEktUC1ESUEtUlciLCJTSEktUC1GMlNSLVJXIiwiTURDLUFQSS1QQVQtUiIsIlNULVAtQlJELVIiLCJTVC1QLVRETC1SVyIsIlNISS1QLVJFQy1SVyIsIlNISS1QLUNIRU1PLVJXIiwiU0hJLVAtTklDVS1SVyIsIk1EQy1BUEktVEhSLVIiLCJHTC1QLUVQLVJXIiwiR0wtUC1FTC1SVyIsIlNULUFQSS1FTVAtUiIsIk1EQy1BUEktUkRMLVIiLCJNREMtQVBJLVJUUy1SIiwiU1QtQVBJLUNSRC1SVyIsIk1EQy1BUEktR0FTLVIiLCJNREMtQVBJLUFULVJXIiwiU0hJLVAtU0lDVS1SVyIsIlNULUFQSS1CUkQtUlciLCJTVC1BUEktQU1DLVJXIiwiU0hJLVAtUkVDUi1SVyIsIlNISS1QLU1SRC1SVyIsIkdMLVAtUlNFLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3Njk1ODQ3OTAsImV4cCI6MTc2OTY3MTc5MCwianRpIjoiYmY3ODhlOTAtNjU2MC00NGViLTg0YmYtZTUwZWUwNmJhZWExIn0.AFGD9p3V9uvUa6aa0aRHWSGD4xARGwn6ZAlwqy4sthXD8rcnZDCeberDCi6E5jPAYHJ1LiX4iY2O1ZJluixSB78UEIgfDd8IjvlNiHDKCeok7Id0AxWh20cdM_9K_1HmgGTyim2UvqMBWyUx0xpiuRPdogGSqu0WjUGrYC0DHTjrorZ4-VHDssE-nE4T61RXvqnPiiAVdlg3zpw99WwKKz4QU2T57x2GnTcbRCzscUmYAsBSmIAhtew0C7IQKevjV-oFxjwwYoGI1cVbuzE-dJkPoedUC9SyMrbbjv9BcBcZjMh-FCTC5rwXUOR-FYOm_Qjdy4OJ1kzuY1L2cyNppg";
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
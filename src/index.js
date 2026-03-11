import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';

function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJHTC1QLUFORC1SVyIsIk1EQy1QLVBOUFItUiIsIk1EQy1QLVRSQi1SVyIsIlNISS1QLVhSQVktUlciLCJTSEktUC1GMlNSLVJXIiwiU0hJLVAtR0VUUkFXLVJXIiwiTURDLUFQSS1BVC1SIiwiRVItUC1FUkItUlciLCJTSEktUC1DVC1SVyIsIlNISS1QLUFWQUlMLVJXIiwiRVItUC1FUlZCLVJXIiwiU1QtUC1OVEYtUlciLCJTSEktUC1GMVNSLVJXIiwiU0hJLVAtTVJJLVJXIiwiU0hJLVAtTklDVVItUlciLCJTVC1SLUhPRCIsIlNULUFQSS1FTVAtUiIsIlNISS1QLVVQRC1SVyIsIlNJLVItSU5ESU4iLCJTVC1QLURFUy1SVyIsIlNULVAtU05PLVJXIiwiTURDLVAtT1NCLVJXIiwiTURDLUFQSS1USFItUiIsIlNISS1QLUhBTkRSLVJXIiwiU0hJLVAtT1QtUlciLCJTSEktUC1PUEQtUlciLCJTSEktUC1GMVItUlciLCJTSEktUC1DSEVNTy1SVyIsIkVSLUFQSS1FUlVCLVJXIiwiU1QtQVBJLUNSRC1SVyIsIlNULVAtTlRGLVIiLCJFUi1QLUVSR0FTLVJXIiwiTURDLVAtUE5QLVIiLCJTSEktUC1ESUEtUlciLCJTSEktUC1GMi1SVyIsIlNULUFQSS1BTUMtUlciLCJTSEktUC1GMVMtUlciLCJTSEktUC1NT0NLLVJXIiwiTURDLVAtUE5QLVJXIiwiR0wtUC1QLVJXIiwiU0hJLVAtUkVDUi1SVyIsIlNISS1QLUYzUi1SVyIsIlNISS1QLUZSTlQtUlciLCJFUi1QLUVSUkVQLVJXIiwiTURDLUFQSS1MQk4tUiIsIlNISS1QLVVQRFJBVy1SVyIsIk1EQy1QLVJERS1SVyIsIlNISS1QLUxBQi1SVyIsIkdMLVAtRUFELVJXIiwiTURDLUFQSS1SVFMtUiIsIlNISS1QLU5JQ1UtUlciLCJHTC1QLUVMLVJXIiwiU0hJLVAtUEhBUk0tUlciLCJTSEktUC1IUi1SVyIsIlNISS1QLUVYUC1SVyIsIlNISS1QLUYzLVJXIiwiTURDLUFQSS1QQVQiLCJHTC1QLUVELVJXIiwiU1QtUC1CUkQtUiIsIlNISS1QLUVNUlItUlciLCJNREMtUC1BU00tUlciLCJTSEktUC1GT1JNLVJXIiwiTURDLUFQSS1HQVMtUiIsIlNISS1QLUYyUy1SVyIsIlNULVAtREVTLVIiLCJTVC1QLVRETC1SVyIsIlNISS1QLVNJQ1VSLVJXIiwiRVItUC1FUkFTLVJXIiwiU0hJLVAtVFJBSU5SLVJXIiwiR0wtUC1FQlQtUlciLCJTSEktUC1GMlItUlciLCJTSEktUC1GMS1SVyIsIk1EQy1QLVJFRy1SIiwiU0hJLVAtRU1SLVJXIiwiU0hJLVAtQ0hFTU9SLVJXIiwiR1AtUC1HQ04tUiIsIlNISS1QLVNJQ1UtUlciLCJTSEktUC1QSFktUlciLCJFUi1SLUVSU0EiLCJNREMtQVBJLVJETC1SVyIsIkVSLVAtRVJHUFItUlciLCJTSEktUC1NUkQtUlciLCJNREMtQVBJLUNEUi1SIiwiU0hJLVAtUkVDLVJXIiwiTURDLVAtUkVHLVJXIiwiU0hJLVAtREVMUkFXLVJXIiwiTURDLVItUkVDIiwiU0hJLVAtTUlDVVItUlciLCJTSEktUC1NSUNVLVJXIiwiTURDLVAtUFRFLVJXIiwiU0hJLVAtREVMLVJXIiwiU1QtUC1UREwtUiIsIlNULVAtQ01ULVJXIiwiTURDLVAtQ0RFLVJXIiwiTURDLUFQSS1BVC1SVyIsIlNISS1QLUlOQyIsIlNISS1QLUhBTkQtUlciLCJHTC1QLVJTRS1SVyIsIlNISS1QLVRSQUlOLVJXIiwiTURDLUFQSS1QQVQtUiIsIlNULVAtQ01ULVIiLCJHTC1QLU5EQy1SVyIsIlNULUFQSS1CUkQtUlciLCJHTC1QLUVQLVJXIiwiTURDLVAtU09SLVIiXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwNSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc3MzIyODgwMCwiZXhwIjoxNzczMzE1ODAwLCJqdGkiOiJiNzlmYTRlNC0wYTA5LTQzNTktYjczOC04NjI5NTUzNTRhNWUifQ.fZDWXdiBwyloUe_-KxRGUkxeEdUudBi9ou0dQtRSqCk4vGTMRBBq6GnBXiWa1lyR1ik01_2IiND7xhy9hJzVnrn6d4CyaDA18t8fd3_jWnX3u96YLBI5buexCGTyYTnIlscIifaxp-BMI6v-Ghwkebm4tnB-AtkyQROH2IhJeYy2y3AXxTp8oFYQ6l3wPy27NtXEkQc6gEIIHnEA7nSGpAbCJLbCIcj_EwxsJJMOk2PTCqiXLZBglMF5LAFwcczpOoMYecTQC00oHgEX4H4jmWDuq9F7kvtWWOF6PScf6PlhBBvIimrxYAYEvKLLYPiZgzaQCubxbgy6Fq7VysDQIg";
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
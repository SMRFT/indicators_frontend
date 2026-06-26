import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';

function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTVFItQVBJLVRSTC1SIiwiU0lOLUFQSS1JRi1SVyIsIk1EQy1QLVBURS1SVyIsIlNULVAtTlRGLVJXIiwiU1RSLVItQSIsIlNJLVItSU5EIiwiU1QtUC1UREwtUiIsIlNISS1QLURFTC1SVyIsIlNISS1QLVBIWS1SVyIsIlNISS1QLUVNUlItUlciLCJTSEktUC1GUk5ULVJXIiwiU1QtUC1ERVMtUlciLCJTSEktUC1NUkktUlciLCJTVC1QLUNNVC1SIiwiU0lOLUFQSS1PUi1SVyIsIlNUUi1BUEktSUwiLCJTVC1BUEktQ1JELVJXIiwiU0hJLVAtRk9STS1SVyIsIk1EQy1QLVJFRy1SIiwiU0lOLVAtR0lDLVIiLCJTSEktUC1GMlNSLVJXIiwiU0hJLVAtRjJSLVJXIiwiU0hJLVAtRjEtUlciLCJTSU4tQVBJLU9SUi1SIiwiU1RSLVAtSUNTLVIiLCJTSU4tUC1FTlFMLVJXIiwiU0lOLUFQSS1GVS1SVyIsIlNISS1QLU9ULVJXIiwiU0hJLVAtVFJBSU4tUlciLCJTSEktUC1NSUNVLVJXIiwiU0hJLVAtREVMUkFXLVJXIiwiU0lOLUFQSS1TRi1SIiwiU1QtQVBJLVRSTFItUlciLCJNREMtUC1QTlBSLVIiLCJTSEktUC1NT0NLLVJXIiwiU1RSLVAtVElOUi1SVyIsIk1EQy1BUEktTEJOLVIiLCJTSEktUC1QSEFSTS1SVyIsIk1EQy1QLU9TQi1SVyIsIkdQLVAtR0NOLVIiLCJFUi1QLUVSR1BSLVJXIiwiU0hJLVAtR0VUUkFXLVJXIiwiU1QtUC1DTVQtUlciLCJTSEktUC1IQU5ELVJXIiwiR0wtUC1FUC1SVyIsIlNISS1QLUNIRU1PUi1SVyIsIkdMLVAtUC1SVyIsIk1EQy1QLVRSQi1SVyIsIkVSLVItRVJTQSIsIk1EQy1QLVBOUC1SIiwiU1QtQVBJLUFNQy1SVyIsIlNUUi1BUEktVElOLVIiLCJTVFItUC1USU5SLVIiLCJNREMtUC1TT1ItUiIsIkdMLVAtRUwtUlciLCJTSEktUC1GMVNSLVJXIiwiU1QtQVBJLUVNUC1SIiwiU0hJLVAtRjMtUlciLCJTSEktUC1VUERSQVctUlciLCJTSEktUC1FTVItUlciLCJTSU4tUi1TVEEiLCJTVC1QLUJSRC1SIiwiU1QtUC1ERVMtUiIsIlNISS1QLVNJQ1VSLVJXIiwiTURDLVAtQ0RFLVJXIiwiU0lOLVAtR0RMLVJXIiwiTURDLUFQSS1QQVQtUiIsIkVSLVAtRVJHQVMtUlciLCJTSEktUC1OSUNVLVJXIiwiU1RSLUFQSS1WTC1SIiwiTURDLVAtUkRFLVJXIiwiU0hJLVAtRjFTLVJXIiwiRVItQVBJLUVSVUItUlciLCJTVC1QLVRETC1SVyIsIlNULVAtU05PLVJXIiwiR0wtUC1SU0UtUlciLCJTVFItQVBJLVZMLVJXIiwiU1RSLUFQSS1JTC1SVyIsIlNISS1QLUVYUC1SVyIsIlNJTi1QLUVOUS1SVyIsIk1EQy1QLUFTTS1SVyIsIk1EQy1QLVJFRy1SVyIsIlNISS1QLVVQRC1SVyIsIlNISS1QLUYxUi1SVyIsIkdMLVAtRUQtUlciLCJTSEktUC1SRUNSLVJXIiwiU0hJLVAtSEFORFItUlciLCJTVFItQVBJLVRJTi1SVyIsIlNISS1QLUNIRU1PLVJXIiwiU0hJLVAtSU5DIiwiTURDLUFQSS1HQVMtUiIsIkdMLVAtRUJULVJXIiwiU0hJLVAtRElBLVJXIiwiU0hJLVAtTUlDVVItUlciLCJNREMtUC1QTlAtUlciLCJTSEktUC1UUkFJTlItUlciLCJTVFItQVBJLVRSTFItUiIsIlNISS1QLUxBQi1SVyIsIkVSLVAtRVJSRVAtUlciLCJTSEktUC1PUEQtUlciLCJTVC1BUEktQlJELVJXIiwiRVItUC1FUkFTLVJXIiwiTURDLUFQSS1SVFMtUiIsIlNISS1QLUYyUy1SVyIsIkdMLVAtTkRDLVJXIiwiRVItUC1FUkItUlciLCJNREMtQVBJLUFULVIiLCJTSEktUC1SRUMtUlciLCJTVFItQVBJLVRSTC1SVyIsIlNISS1QLU1SRC1SVyIsIk1EQy1BUEktVEhSLVIiLCJTVC1SLUEiLCJTSEktUC1IUi1SVyIsIlNISS1QLU5JQ1VSLVJXIiwiU1QtUC1OVEYtUiIsIlNISS1QLVNJQ1UtUlciLCJTVFItQVBJLUlMLVIiLCJNREMtQVBJLUFULVJXIiwiTURDLUFQSS1DRFItUiIsIkdMLVAtQU5ELVJXIiwiR0wtUC1FQUQtUlciLCJTSEktUC1GM1ItUlciLCJFUi1QLUVSVkItUlciLCJNREMtQVBJLVJETC1SIiwiU0hJLVAtRjItUlciLCJTSEktUC1YUkFZLVJXIiwiU0hJLVAtQVZBSUwtUlciLCJTSEktUC1DVC1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6W10sImFsbG93ZWQtb3V0bGV0cyI6W10sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzgyNDQ0MzUwLCJleHAiOjE3ODI1MzEzNTB9.E_PT5f2USo4Ja2iOo9UhhW2M4HqM8cusVT7SdWUSXA84jI7OXlJYvhdFCThpBU8avkC4RJ7gzcsmYCUpcS7W9u0blXYrEL8QcEdOa9E5ldj-hDRgkKvaeRRhY2qpt-kYhklJSrdlbmYwW_PsPoPg3yhUSO6X8GI-IgD7YwAJgxrRB1JVJHQVJxRahuv8xDDVIPISMuDFL19ZDIWqBYDiu1H2BuHRdnCdJWGFyz7sG4VrsWLNF6J5AMNeLChBqc3n_yETD9p4GQK97yPr_upBU_wrT__d6B8e629UygfIq-SEwhr-hbLGuUtL8WtlgdSOSBFM6EhXbr1SDUtcKm4NWw";
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
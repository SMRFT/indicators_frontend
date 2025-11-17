import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';

function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTSEktUC1ERUxSQVctUlciLCJTSEktUC1SRUMtUlciLCJTSEktUC1FWFAtUlciLCJTVC1SLUNEUiIsIlNULUFQSS1FTVAtUiIsIk1EQy1BUEktQVQtUlciLCJNREMtQVBJLVBBVC1SIiwiU0hJLVAtRjJTUi1SVyIsIk1EQy1QLVBOUC1SIiwiU0hJLVAtU0lDVS1SVyIsIlNISS1QLUYxU1ItUlciLCJTSEktUC1VUERSQVctUlciLCJTSEktUC1NT0NLLVJXIiwiU0hJLVAtTUlDVS1SVyIsIlNULVAtQlJELVIiLCJHTC1QLUFORC1SVyIsIlNULVAtQ01ULVJXIiwiU0hJLVAtWFJBWS1SVyIsIlNISS1QLUZPUk0tUlciLCJTSEktUC1BVkFJTC1SVyIsIlNISS1QLVRSQUlOLVJXIiwiU1QtUC1OVEYtUiIsIlNISS1QLUxBQi1SVyIsIlNISS1QLUYzLVJXIiwiTURDLVAtU09SLVIiLCJTSEktUC1DVC1SVyIsIlNISS1QLUYyLVJXIiwiU0hJLVAtRjFTLVJXIiwiU1QtUC1ERVMtUlciLCJHTC1QLUVQLVJXIiwiTURDLUFQSS1HQVMtUiIsIlNISS1QLVRSQUlOUi1SVyIsIlNISS1QLVVQRC1SVyIsIkdMLVAtUC1SVyIsIlNISS1QLUYyUy1SVyIsIlNISS1QLUYzUi1SVyIsIlNISS1QLVBIWS1SVyIsIlNISS1QLUhBTkRSLVJXIiwiU0hJLVAtRjFSLVJXIiwiTURDLUFQSS1USFItUiIsIlNISS1QLUNIRU1PUi1SVyIsIk1EQy1BUEktUlRTLVIiLCJTSEktUC1OSUNVLVJXIiwiTURDLVAtQVNNLVJXIiwiU0hJLVAtSU5DIiwiR0wtUC1FQlQtUlciLCJTVC1BUEktQU1DLVJXIiwiTURDLVAtUkVHLVIiLCJTVC1BUEktQlJELVJXIiwiTURDLVAtUE5QLVJXIiwiR0wtUC1FQUQtUlciLCJNREMtUC1QTlBSLVIiLCJTSEktUC1ERUwtUlciLCJTSEktUC1PVC1SVyIsIkdMLVAtRUwtUlciLCJNREMtQVBJLUFULVIiLCJTSEktUC1PUEQtUlciLCJTSEktUC1FTVItUlciLCJHTC1QLU5EQy1SVyIsIk1EQy1BUEktTEJOLVIiLCJTSEktUC1NSUNVUi1SVyIsIlNISS1QLUYxLVJXIiwiU0hJLVAtSEFORC1SVyIsIlNISS1QLUYyUi1SVyIsIlNISS1QLUdFVFJBVy1SVyIsIlNJLVItSU5EIiwiTURDLVAtT1NCLVJXIiwiU1QtUC1UREwtUlciLCJTVC1QLU5URi1SVyIsIlNISS1QLUZSTlQtUlciLCJTSEktUC1OSUNVUi1SVyIsIkdMLVAtUlNFLVJXIiwiU0hJLVAtRElBLVJXIiwiTURDLVItUkVDIiwiU1QtUC1TTk8tUlciLCJTVC1QLURFUy1SIiwiTURDLUFQSS1QQVQiLCJTSEktUC1NUkQtUlciLCJTSEktUC1QSEFSTS1SVyIsIlNISS1QLUVNUlItUlciLCJTVC1SLUEiLCJTVC1QLUNNVC1SIiwiU1QtQVBJLUNSRC1SVyIsIkdMLVAtRUQtUlciLCJTSEktUC1NUkktUlciLCJTSEktUC1SRUNSLVJXIiwiTURDLUFQSS1DRFItUiIsIlNISS1QLUNIRU1PLVJXIiwiTURDLVAtVFJCLVJXIiwiTURDLVAtUkVHLVJXIiwiU1QtUC1UREwtUiIsIlNISS1QLVNJQ1VSLVJXIiwiTURDLUFQSS1SREwtUlciLCJTSEktUC1IUi1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDA1Il0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzYzMzY0MTY0LCJleHAiOjE3NjM0NTExNjQsImp0aSI6IjhmY2EwZTRhLTViZTgtNGM0MS1hNDQ3LTFhMzFjNWVkMTYzYiJ9.eujX-1-F2e7NuFZaZhx15WYQ996atVWgUx500BhiyAxKbHNIxB46_c49to4QGBSBpKfqiknbgagFxIDuP8tsutMP45XtU1j1VEyyGIt_VSJFpXsfXwgKm2o4PulLftgt8_QhPICAtXPeD10DlF2_lZzPqokrIMxh-IOoBqMi0aSpWZQQ427uubRX0-WzUYlVcOa0heZsmhqC-WmkEed9R0NetqjZ4KY4RuWKc9StLe0-iNsqkn8PzZS628XvtawaLk-plYMhEx_6j-F3Rgg4z1Pjy2pe1WszsLIcBJ4-CAcbnTEfTzmpmuvzLyiWrzE_E5PQE0QT5lSp07bM6tiwxA";
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
    <BrowserRouter>
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
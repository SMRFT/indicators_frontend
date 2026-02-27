import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';

function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJHTC1QLUVBRC1SVyIsIlNULVAtQlJELVIiLCJNREMtUC1SRUctUlciLCJHTC1QLUVCVC1SVyIsIkdMLVAtUlNFLVJXIiwiRVItUC1FUlNELVJXIiwiR0wtUC1FRC1SVyIsIkdMLVAtUC1SVyIsIlNULVAtREVTLVIiLCJTSEktUC1VUEQtUlciLCJTSU4tQVBJLVNGLVIiLCJTSU4tUi1TVEEiLCJTVC1QLU5URi1SIiwiU0hJLVAtRjFTLVJXIiwiU0hJLVAtRVhQLVJXIiwiU0hJLVAtTUlDVVItUlciLCJTSEktUC1TSUNVUi1SVyIsIlNJTi1QLUdETC1SIiwiTURDLVAtU09SLVIiLCJTSEktUC1GMVItUlciLCJTSEktUC1NT0NLLVJXIiwiU0hJLVAtTVJELVJXIiwiU0hJLVAtT1QtUlciLCJTSEktUC1UUkFJTlItUlciLCJHTC1QLUFORC1SVyIsIlNISS1QLURJQS1SVyIsIkVSLVAtRVJVUy1SVyIsIlNJTi1BUEktSUYtUlciLCJTSEktUC1GMlNSLVJXIiwiU0hJLVAtUkVDLVJXIiwiU1QtUC1TTk8tUlciLCJFUi1QLUVSR0FTLVJXIiwiTURDLUFQSS1BVC1SIiwiTURDLUFQSS1USFItUiIsIlNISS1QLUNIRU1PUi1SVyIsIlNULVAtQ01ULVJXIiwiRVItUi1FUlAiLCJNREMtQVBJLUdBUy1SIiwiRVItUC1FUlZCLVJXIiwiTURDLUFQSS1SREwtUiIsIlNJTi1BUEktT1JSLVIiLCJTSEktUC1QSFktUlciLCJTSU4tQVBJLU9SLVJXIiwiU0hJLVAtT1BELVJXIiwiU0hJLVAtRjFTUi1SVyIsIlNULVAtVERMLVIiLCJNREMtUC1QTlAtUiIsIlNISS1QLUZPUk0tUlciLCJTVC1BUEktQ1JELVJXIiwiU0hJLVAtQVZBSUwtUlciLCJNREMtUC1QVEUtUlciLCJTSEktUC1ERUwtUlciLCJTSU4tQVBJLUZVLVJXIiwiU0hJLVAtTEFCLVJXIiwiU0hJLVAtSEFORC1SVyIsIlNISS1QLUVNUlItUlciLCJNREMtUC1QTlBSLVIiLCJTSEktUC1GM1ItUlciLCJTSEktUC1GMy1SVyIsIlNJTi1QLUdJQy1SIiwiU0hJLVAtVVBEUkFXLVJXIiwiU0hJLVAtRjEtUlciLCJTSEktUC1TSUNVLVJXIiwiTURDLVAtUkVHLVIiLCJNREMtUC1PU0ItUlciLCJTVC1BUEktQU1DLVJXIiwiU0hJLVAtQ0hFTU8tUlciLCJTSEktUC1GUk5ULVJXIiwiU1QtUC1UREwtUlciLCJTSEktUC1SRUNSLVJXIiwiTURDLVAtQ0RFLVJXIiwiTURDLUFQSS1QQVQtUiIsIk1EQy1BUEktTEJOLVIiLCJFUi1QLUVSUC1SIiwiU0hJLVAtTklDVS1SVyIsIlNULVAtTlRGLVJXIiwiTURDLVAtVFJCLVJXIiwiU0hJLVAtSFItUlciLCJTSEktUC1OSUNVUi1SVyIsIlNISS1QLUYyLVJXIiwiU0hJLVAtRU1SLVJXIiwiU0hJLVAtRjJTLVJXIiwiU1QtQVBJLUVNUC1SIiwiU1QtQVBJLUJSRC1SVyIsIlNISS1QLVRSQUlOLVJXIiwiR1AtUC1HQ04tUiIsIlNULVItQSIsIlNISS1QLVhSQVktUlciLCJTVC1QLURFUy1SVyIsIlNULVAtQ01ULVIiLCJHTC1QLU5EQy1SVyIsIlNISS1QLU1JQ1UtUlciLCJHTC1QLUVQLVJXIiwiTURDLVAtUkRFLVJXIiwiTURDLVAtQVNNLVJXIiwiU0hJLVAtRjJSLVJXIiwiU0hJLVAtQ1QtUlciLCJNREMtUC1QTlAtUlciLCJTSEktUC1JTkMiLCJNREMtQVBJLUFULVJXIiwiU0hJLVAtSEFORFItUlciLCJHTC1QLUVMLVJXIiwiRVItUC1FUkdQUi1SVyIsIlNISS1QLURFTFJBVy1SVyIsIk1EQy1BUEktQ0RSLVIiLCJTSS1SLUlORCIsIk1EQy1BUEktUlRTLVIiLCJTSEktUC1NUkktUlciLCJTSEktUC1HRVRSQVctUlciLCJTSEktUC1QSEFSTS1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzcyMTYzNDQwLCJleHAiOjE3NzIyNTA0NDAsImp0aSI6ImVlN2IxMTdhLWZjYzQtNDMxZi1hOTQ4LTNlYTI1ZTc0Nzc2OSJ9.HBgn3qQYeo6zHA_Y0G575Iqol3z95I1fA0Ry1wpDmj-yqi0b178_18_emKyplXvbC6daO0bQ7EiuoiXFr0W2m2Ww1Sb1K_581kRxPGZZLs5zMYsH2g5XyJ0bnHa7BGatVJyJAdu0wMo9JAVpnBhvjTTXK_taBZobGaAh5CVVnY0RQCQby1okSo5hN4hnMLSldnrIW6uftUdnhX_ytG3_LEai9TkOL_otqcBsFAqcxkwezSk-4_Iu0J3rHJ9EjwhdeamJo8S-DsWcMYuo0QojWyYf-1BNcqmBbREllh0P_h4hDiNmG_RMPjEm3aNUJ8Zr-6Cs597fiCP9fvsM6QdpaQ";
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
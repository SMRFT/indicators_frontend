import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTVFItQVBJLVRJTi1SIiwiU0hJLVAtU0lDVS1SVyIsIlNULVAtQ01ULVIiLCJNREMtQVBJLVJETC1SIiwiU0ktUi1JTkQiLCJTSEktUC1PVC1SVyIsIk1EQy1QLUdBVC1SVyIsIkVSLVAtRVJCLVJXIiwiU1QtQVBJLUVNUC1SIiwiR0wtUC1FTC1SVyIsIlNISS1QLUZPUk0tUlciLCJTSEktUC1IQU5ELVJXIiwiTURDLUFQSS1QQVQtUiIsIlNUUi1BUEktSUwtUiIsIlNISS1QLU1PQ0stUlciLCJHTC1QLUVBRC1SVyIsIkVSLVAtRVJHQVMtUlciLCJTSEktUC1JTkMtUlciLCJNREMtUC1SRUctUiIsIlNISS1QLUYxUy1SVyIsIlNJTi1QLUVOUUwtUlciLCJTSEktUC1GMVItUlciLCJNREMtUC1PU0ItUlciLCJNREMtUC1QTlAtUlciLCJTSU4tQVBJLU9SLVJXIiwiU0hJLVAtT1BELVJXIiwiR0wtUC1FRC1SVyIsIk1EQy1QLVBOUC1SIiwiU1QtUC1ERVMtUlciLCJTVFItQVBJLVZMLVJXIiwiU0hJLVAtTVJJLVJXIiwiU0lOLVItU1RBIiwiU0hJLVAtQ0hFTU9SLVJXIiwiU1RSLUFQSS1UUkxSLVIiLCJTSEktUC1DVC1SVyIsIk1EQy1QLVJERS1SVyIsIlNISS1QLUZSTlQtUlciLCJFUi1QLUVSVkItUlciLCJTSU4tQVBJLVNGLVIiLCJTSEktUC1YUkFZLVJXIiwiU1QtUC1TTk8tUlciLCJHUC1QLUdDTi1SIiwiU1QtUC1UREwtUiIsIk1EQy1BUEktQVQtUlciLCJTSU4tQVBJLUdJQy1SIiwiTURDLVAtUE5QUi1SIiwiU0lOLUFQSS1JRi1SVyIsIkVSLVItRVJTQSIsIlNISS1QLUhBTkRSLVJXIiwiU0hJLVAtTklDVVItUlciLCJTSEktUC1GMi1SVyIsIlNISS1QLURJQS1SVyIsIlNJTi1QLUdETC1SVyIsIk1EQy1QLUdEVFMtUiIsIlNULVItQSIsIkdMLVAtUlNFLVJXIiwiU0hJLVAtRjJTLVJXIiwiU0hJLVAtUkVDUi1SVyIsIlNISS1QLUYzLVJXIiwiU0hJLVAtVFJBSU4tUlciLCJTVFItQVBJLVRSTC1SIiwiU0hJLVAtRjEtUlciLCJTSEktUC1GMlNSLVJXIiwiTURDLUFQSS1USFItUiIsIkVSLVAtRVJSRVAtUlciLCJTSEktUC1DSEVNTy1SVyIsIlNJTi1BUEktRlUtUlciLCJTVFItUC1USU5SLVIiLCJTSEktUC1QSEFSTS1SVyIsIlNUUi1BUEktSUwiLCJNREMtUC1VQVMtUlciLCJTSEktUC1QSFktUlciLCJTVFItUC1USU5SLVJXIiwiU0lOLUFQSS1PUlItUiIsIk1EQy1BUEktQ0RSLVIiLCJHTC1QLVAtUlciLCJTVC1QLURFUy1SIiwiU1RSLUFQSS1USU4tUlciLCJFUi1BUEktRVJVQi1SVyIsIlNISS1QLVVQRFJBVy1SVyIsIk1EQy1QLVJFRy1SVyIsIlNISS1QLVNVUElOVi1SVyIsIk1EQy1QLVNPUi1SIiwiU1QtQVBJLUJSRC1SVyIsIk1EQy1QLUFTTS1SVyIsIlNISS1QLVJFQy1SVyIsIk1EQy1QLUVGLVJXIiwiTURDLUFQSS1MQk4tUiIsIk1EQy1QLUNERS1SVyIsIlNISS1QLU1SRC1SVyIsIk1EQy1QLUNBLVJXIiwiU1RSLVAtSUNTLVIiLCJNREMtQVBJLUdBUy1SIiwiU0hJLVAtRjNSLVJXIiwiU0hJLVAtU0lDVVItUlciLCJTVC1QLU5URi1SVyIsIk1EQy1BUEktUlRTLVIiLCJHTC1QLUFORC1SVyIsIlNISS1QLUYxU1ItUlciLCJTSEktUC1NSUNVUi1SVyIsIlNISS1QLUVYUC1SVyIsIkdMLVAtTkRDLVJXIiwiU0hJLVAtQVZBSUwtUlciLCJTSEktUC1FTVJSLVJXIiwiU0hJLVAtREVMUkFXLVJXIiwiU1QtUC1CUkQtUiIsIlNISS1QLURFTC1SVyIsIlNUUi1BUEktVkwtUiIsIkdMLVAtRVAtUlciLCJNREMtQVBJLUFULVIiLCJFUi1QLUVSR1BSLVJXIiwiRVItUC1FUkFTLVJXIiwiTURDLVAtUFRFLVJXIiwiU1QtUC1UREwtUlciLCJTSEktUC1HRVRSQVctUlciLCJTSEktUC1GMlItUlciLCJTSEktUC1VUEQtUlciLCJTSEktUC1JTkMiLCJTSEktUC1UUkFJTlItUlciLCJTSEktUC1MQUItUlciLCJTSEktUC1NSUNVLVJXIiwiU1QtQVBJLUNSRC1SVyIsIk1EQy1QLUdBRC1SVyIsIlNISS1QLUdJLVIiLCJTVC1QLUNNVC1SVyIsIlNISS1QLUhSLVJXIiwiU1RSLVItQSIsIlNISS1QLUVNUi1SVyIsIlNISS1QLUlOQ0MtUlciLCJNREMtUC1UUkItUlciLCJNREMtUC1BRC1SVyIsIlNULUFQSS1UUkxSLVJXIiwiU1RSLUFQSS1JTC1SVyIsIlNULUFQSS1BTUMtUlciLCJHTC1QLUVCVC1SVyIsIlNJTi1QLUVOUS1SVyIsIlNULVAtTlRGLVIiLCJTSEktUC1OSUNVLVJXIiwiU1RSLUFQSS1UUkwtUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJob3NwaXRhbF9jb2RlIjoiU0gwMDEiLCJobXNfcGFnZXMiOltdLCJhbGxvd2VkLW91dGxldHMiOltdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc4NDcxODM4NiwiZXhwIjoxNzg0ODA1Mzg2fQ.W16FWXqsp13Q9bwrCn66zENSUplxAuc_OqDDOjli0iNNRrHIYib5WOmNTwxKdCp4B7wtVCzoKUgj_7a7csgmYqsEBcg8EfFiDFqOSMYJyZQCkLa1ihvhWNzfEwkKXEiWu-hBnzV74H2rQH9dnqmTYHTEI86bY_0pgv4V6rES0U6AAwGD6TOOCQROsvkbsnR3MSpxkplB9If0aPCzNOAKM20InLevc0uGjzL3f2_jOUJi9Omy_yInPaCT6xMRlIcDW2etJTPk8dhVaj8UYhfMmiQi-121AY-ogWtILJeCm8OO7g9Ja-PDY1yDdIP12lIkJq1LFG46Nv5VJfWDOX0Vww";
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
      <ThemeProvider>
        <App />
      </ThemeProvider>
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
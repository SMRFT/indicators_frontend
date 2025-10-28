import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';

function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoiUGFydGhpcGFuMzEyMTQ2MUBnbWFpbC5jb20iLCJuYW1lIjoiTS5QYXJ0aGliYW4iLCJhbGxvd2VkLWFjdGlvbnMiOlsiRVItUC1FUkRTSC1SIiwiU0QtUC1ERi1SIiwiU1QtUC1DTVQtUlciLCJTRC1QLVBELVIiLCJHTC1QLVAtUlciLCJHTC1QLUVCVC1SVyIsIlNULVAtQ01ULVIiLCJTRC1QLUJURC1SIiwiU0QtUC1QT1YtUlciLCJTRC1QLVNTVS1SVyIsIlNELVAtU1MtUiIsIlNELVAtUE9WLVIiLCJTVC1QLUJSRC1SIiwiU0QtQVBJLVJCLVIiLCJTRC1QLVRELVJXIiwiU0QtQVBJLVRWLVIiLCJTVC1QLVRETC1SVyIsIlNULVAtREVTLVJXIiwiRVItUi1FUkEiLCJTVC1SLUEiLCJTSEktUC1UUkFJTi1SVyIsIkdMLVAtRUFELVJXIiwiR0wtUC1BTkQtUlciLCJFUi1QLUVSUi1SVyIsIkdMLVAtRVAtUlciLCJTVC1QLURFUy1SIiwiR0wtUC1FTC1SVyIsIlNULUFQSS1FTVAtUiIsIlNELVAtVEQtUiIsIlNULVAtTlRGLVJXIiwiU0QtUC1NSVMtUiIsIlNISS1QLUlOQyIsIkdMLVAtTkRDLVJXIiwiU0QtUC1HUEQtUiIsIlNELUFQSS1DTi1SIiwiU0QtUC1DSEMtUlciLCJTVC1QLVRETC1SIiwiR0wtUC1FRC1SVyIsIlNELVAtQlRELVJXIiwiU0QtUC1TU1UtUiIsIlNELVAtREYtUlciLCJTVC1BUEktQ1JELVJXIiwiU1QtUC1OVEYtUiIsIlNELVItQ0VPIiwiU0QtUC1QTC1SIiwiU0QtUC1CRy1SIiwiU0QtUC1DSEMtUiIsIlNISS1QLUVYUC1SVyIsIlNULUFQSS1CUkQtUlciLCJTRC1QLVNTLVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNULVAtU05PLVJXIiwiR0wtUC1SU0UtUlciLCJTRC1BUEktVEQtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzYxNTM0NzM2LCJleHAiOjE3NjE2MjE3MzYsImp0aSI6ImM0YjI4MTQzLTM2NTQtNGIwYi1iYTA3LTAwZmI0MTlhNDY4MCJ9.Wa_GTdTxeQ-R0Jm2zVpAlOfnlpewLxYP87jArS-NLoftfP95QoXbDhEnsCDDC1LQnPj-SK5Kd5XdFl50wgAbaBL6XXqHW6RtQpyJ0-Xo1nsCYGly2X9WOgG8CB_w3501WnNeKW7bRUQAom1gKbMUVMxwTrSI5w338bsCx82bzAiDleHmF-L9cZN2nQvWrHLFdTfLuJCBrXRhFU_NO4PchAu96XcihA_vBGoZK1posqxDeQkpZLhHc5g_VmknOH0-KBDLaawOmOBz9y1Pkg1GKnaaCCgoUpm_NZ68c84yK4c9N9TLVoGFH_Gm2Jr4XV4bYUSTMEY7H6zpR2O8OqXKMw";
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

    if (!accessToken && process.env.REACT_APP_LOCAL_DEV_ENVIRONMENT === 'true') {
      accessToken = setForLocalDev();
    }

    try {
      if (!accessToken) throw new Error("No token found");
      const payload = validate(accessToken);
      localStorage.setItem("user_payload", JSON.stringify(payload));
      setIsValidToken(true);
    } catch (err) {
      console.error("Token validation failed:", err.message);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_payload");
      // window.location.href = process.env.REACT_APP_LOGIN_REDIRECT_URL;
    }
  }, []);

  return isValidToken ? (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ) : null;
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <RootRenderer />
  </StrictMode>
);

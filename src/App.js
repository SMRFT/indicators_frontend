import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from "./components/Homepage/LandingPage";
import QualityIndicatorsLanding from "./components/Homepage/QualityIndicatorsLanding";
import IncidentDashboard from "./components/Homepage/IncidentDashboard";
import { AdminLogin, EmployeeLogin } from "./components/Auth/Login";
import Logo from "./components/images/shanmuga-hospital-logo.jpg";
import Sidebar from "./components/Homepage/VerticalNavbar";
import "./App.css";

// Lazy-loaded components
const Availability = lazy(() => import("./components/Report/Availability"));
const Formula = lazy(() => import("./components/Report/Formula"));
const Physiotherapy = lazy(() => import("./components/Others/Physiotherapy"));
const FirstSuit = lazy(() => import("./components/Firstfloor/FirstSuit"));
const FirstFloor = lazy(() => import("./components/Firstfloor/FirstFloor"));
const FrontOffice = lazy(() => import("./components/GroundFloor/FrontOffice"));
const SecondSuit = lazy(() => import("./components/Secondfloor/SecondSuit"));
const ThirdFloor = lazy(() => import("./components/Thirdfloor/ThirdFloor"));
const CT = lazy(() => import("./components/Others/CT"));
const ChemoWard = lazy(() => import("./components/Basement/ChemoWard"));
const EmergencyRoom = lazy(() => import("./components/GroundFloor/EmergencyRoom"));
const Lab = lazy(() => import("./components/Basement/Lab"));
const OTForm = lazy(() => import("./components/Firstfloor/OTForm"));
const XRay = lazy(() => import("./components/Basement/X-Ray"));
const MRDForm = lazy(() => import("./components/Basement/MRDForm"));
const MICUForm = lazy(() => import("./components/Firstfloor/MICUForm"));
const NICUForm = lazy(() => import("./components/Firstfloor/NICUForm"));
const Dialysis = lazy(() => import("./components/Firstfloor/Dialysis"));
const RecoveryWard = lazy(() => import("./components/Firstfloor/RecoveryWard"));
const SecondFloor = lazy(() => import("./components/Secondfloor/SecondFloor"));
const SICUForm = lazy(() => import("./components/Secondfloor/SICUForm"));
const MRI = lazy(() => import("./components/Others/MRI"));
const Report = lazy(() => import("./components/Report/Report"));
const Register = lazy(() => import("./components/Auth/Register"));
const FirstFloorRawData = lazy(() => import("./components/Firstfloor/FirstFloorRawData"));
const SecondFloorRawData = lazy(() => import("./components/Secondfloor/SecondFloorRawData"));
const SecondSuitRawData = lazy(() => import("./components/Secondfloor/SecondSuitRawData"));
const FirstSuitRawData = lazy(() => import("./components/Firstfloor/FirstSuitRawData"));
const MasterDataReport = lazy(() => import("./components/Report/MasterDataReport"));
const OPD = lazy(() => import("./components/GroundFloor/OPD"));
const HR = lazy(() => import("./components/Basement/HR"));
const RecoveryWardRawData = lazy(() => import("./components/Firstfloor/RecoveryWardRawData"));
const SICURawData = lazy(() => import("./components/Secondfloor/SICURawData"));
const NICURawData = lazy(() => import("./components/Firstfloor/NICURawData"));
const MICURawData = lazy(() => import("./components/Firstfloor/MICURawData"));
const ThirdFloorRawData = lazy(() => import("./components/Thirdfloor/ThirdFloorRawData"));
const EmergencyRoomRawData = lazy(() => import("./components/GroundFloor/EmergencyRoomRawData"));
const ChemoWardRawData = lazy(() => import("./components/Basement/ChemoWardRawData"));
const HandHygieneAudit = lazy(() => import("./components/HandHygenieAudit"));
const HandHygieneReport = lazy(() => import("./components/Report/HandHygieneReport"));
const TrainingFeedBack = lazy(() => import("./components/TrainingFeedBack"));
const TrainingFeedbackReport = lazy(() => import("./components/Report/TrainingFeedBackReport"));
const Pharmacy = lazy(() => import("./components/Basement/Pharmacy"));
const Mockdrills = lazy(() => import("./components/Others/Mockdrills"));
const OPDRawData = lazy(() => import("./components/GroundFloor/OPDRawData"));
const IncidentReport = lazy(() => import("./components/IncitendInvestForms/IncidentReport"));
const SupervisorInvestigation = lazy(() => import("./components/IncitendInvestForms/SupervisorInvestigation"));
const IncidentReportReport = lazy(() => import("./components/Report/IncidentReportReport"));
const SupervisorInvestigationReport = lazy(() => import("./components/Report/SupervisorInvestigationReport"));
const IncidentClassificationManager = lazy(() => import("./components/IncitendInvestForms/IncidentClassificationManager"));

function App() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, [location]);

  const showSidebar =
    userRole &&
    !["/", "/Login", "/AdminLogin", "/EmployeeLogin", "/QualityIndicators", "/IncidentDashboard"].includes(
      location.pathname
    );
  const showLogo = !showSidebar && !["/", "/QualityIndicators", "/IncidentDashboard"].includes(location.pathname);
  const hideMainContent = [
    "/",
    "/Login",
    "/AdminLogin",
    "/EmployeeLogin",
    "/Register",
    "/Availability",
    "/Report",
    "/MasterDataReport",
    "/FirstFloorRawData",
    "/FirstSuitRawData",
    "/SecondFloorRawData",
    "./SecondSuitRawData",
    "/ThirdFloorRawData",
    "/RecoveryWardRawData",
    "/ChemoWardRawData",
    "/EmergencyRoomRawData",
    "/SICURawData",
    "/NICURawData",
    "/MICURawData",
    "/OPDRawData",
    "/QualityIndicators",
    "/IncidentDashboard",
  ].includes(location.pathname);


  return (
    <div className="App">
      {showLogo && (
        <div className="logo-container">
          <img src={Logo} alt="Shanmuga Hospital Logo" className="logo" />
        </div>
      )}
      {showSidebar && (
        <div className="top-container">
          <Sidebar userRole={userRole} location={location} />
        </div>
      )}

      <div className={hideMainContent ? "" : "main-content"}>
        <Suspense fallback={<div className="text-center p-5">Loading component...</div>}>
          <Routes >
            <Route path="/" element={<LandingPage />} />
            <Route path="/QualityIndicators" element={<QualityIndicatorsLanding />} />
            <Route path="/IncidentDashboard" element={<IncidentDashboard />} />
            <Route
              path="/EmployeeLogin"
              element={<EmployeeLogin setUserRole={setUserRole} />}
            />
            <Route
              path="/AdminLogin"
              element={<AdminLogin setUserRole={setUserRole} />}
            />
            <Route path="/Register" element={<Register />} />
            <Route path="/Availability" element={<Availability />} />
            <Route path="/Report" element={<Report />} />
            <Route path="/MasterDataReport" element={<MasterDataReport />} />
            <Route path="/Formula" element={<Formula />} />
            <Route path="/FrontOffice" element={<FrontOffice />} />
            <Route path="/FirstSuit" element={<FirstSuit />} />
            <Route path="/FirstFloor" element={<FirstFloor />} />
            <Route path="/SecondFloor" element={<SecondFloor />} />
            <Route path="/SecondSuit" element={<SecondSuit />} />
            <Route path="/ThirdFloor" element={<ThirdFloor />} />
            <Route path="/CT" element={<CT />} />
            <Route path="/Lab" element={<Lab />} />
            <Route path="/MRI" element={<MRI />} />
            <Route path="/XRay" element={<XRay />} />
            <Route path="/OPD" element={<OPD />} />
            <Route path="/OTForm" element={<OTForm />} />
            <Route path="/HR" element={<HR />} />
            <Route path="/Dialysis" element={<Dialysis />} />
            <Route path="/Physiotherapy" element={<Physiotherapy />} />
            <Route path="/Pharmacy" element={<Pharmacy />} />
            <Route path="/EmergencyRoom" element={<EmergencyRoom />} />
            <Route path="/MRDForm" element={<MRDForm />} />
            <Route path="/ChemoWard" element={<ChemoWard />} />
            <Route path="/RecoveryWard" element={<RecoveryWard />} />
            <Route path="/SICUForm" element={<SICUForm />} />
            <Route path="/MICUForm" element={<MICUForm />} />
            <Route path="/NICUForm" element={<NICUForm />} />
            <Route path="/FirstFloorRawData" element={<FirstFloorRawData />} />
            <Route path="/FirstSuitRawData" element={<FirstSuitRawData />} />
            <Route path="/SecondFloorRawData" element={<SecondFloorRawData />} />
            <Route path="/SecondSuitRawData" element={<SecondSuitRawData />} />
            <Route path="/ThirdFloorRawData" element={<ThirdFloorRawData />} />
            <Route path="/Mockdrills" element={<Mockdrills />} />
            <Route
              path="/RecoveryWardRawData"
              element={<RecoveryWardRawData />}
            />
            <Route path="/ChemoWardRawData" element={<ChemoWardRawData />} />
            <Route
              path="/EmergencyRoomRawData"
              element={<EmergencyRoomRawData />}
            />
            <Route path="/SICURawData" element={<SICURawData />} />
            <Route path="/NICURawData" element={<NICURawData />} />
            <Route path="/MICURawData" element={<MICURawData />} />
            <Route path="/HandHygieneAudit" element={<HandHygieneAudit />} />
            <Route path="/HandHygieneReport" element={<HandHygieneReport />} />
            <Route path="/TrainingFeedBack" element={<TrainingFeedBack />} />
            <Route
              path="/TrainingFeedbackReport"
              element={<TrainingFeedbackReport />}
            />
            <Route path="/OPDRawData" element={<OPDRawData />} />
            <Route path="/IncidentReport" element={<IncidentReport />} />
            <Route path="/SupervisorInvestigation" element={<SupervisorInvestigation />} />
            <Route path="/IncidentReportReport" element={<IncidentReportReport />} />
            <Route path="/SupervisorInvestigationReport" element={<SupervisorInvestigationReport />} />
            <Route path="/IncidentClassification" element={<IncidentClassificationManager />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;

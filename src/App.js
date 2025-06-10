import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from "./components/Homepage/LandingPage";
import { AdminLogin, EmployeeLogin } from "./components/Auth/Login";
import Availability from "./components/Report/Availability";
import Formula from "./components/Report/Formula";
import Physiotherapy from "./components/Others/Physiotherapy";
import FirstSuit from "./components/Firstfloor/FirstSuit";
import FirstFloor from "./components/Firstfloor/FirstFloor";
import FrontOffice from "./components/GroundFloor/FrontOffice";
import SecondSuit from "./components/Secondfloor/SecondSuit";
import ThirdFloor from "./components/Thirdfloor/ThirdFloor";
import CT from "./components/Others/CT";
import ChemoWard from "./components/Basement/ChemoWard";
import EmergencyRoom from "./components/GroundFloor/EmergencyRoom";
import Lab from "./components/Basement/Lab";
import OTForm from "./components/Firstfloor/OTForm";
import XRay from "./components/Basement/X-Ray";
import MRDForm from "./components/Basement/MRDForm";
import MICUForm from "./components/Firstfloor/MICUForm";
import NICUForm from "./components/Firstfloor/NICUForm";
import Dialysis from "./components/Firstfloor/Dialysis";
import RecoveryWard from "./components/Firstfloor/RecoveryWard";
import SecondFloor from "./components/Secondfloor/SecondFloor";
import SICUForm from "./components/Secondfloor/SICUForm";
import MRI from "./components/Others/MRI";
import Report from "./components/Report/Report";
import Register from "./components/Auth/Register";
import FirstFloorRawData from "./components/Firstfloor/FirstFloorRawData";
import SecondFloorRawData from "./components/Secondfloor/SecondFloorRawData";
import Logo from "./components/images/shanmuga-hospital-logo.jpg";
import Sidebar from "./components/Homepage/VerticalNavbar";
import "./App.css";
import SecondSuitRawData from "./components/Secondfloor/SecondSuitRawData";
import FirstSuitRawData from "./components/Firstfloor/FirstSuitRawData";
import MasterDataReport from "./components/Report/MasterDataReport";
import OPD from "./components/GroundFloor/OPD";
import HR from "./components/Basement/HR";
import RecoveryWardRawData from "./components/Firstfloor/RecoveryWardRawData";
import SICURawData from "./components/Secondfloor/SICURawData";
import NICURawData from "./components/Firstfloor/NICURawData";
import MICURawData from "./components/Firstfloor/MICURawData";
import ThirdFloorRawData from "./components/Thirdfloor/ThirdFloorRawData";
import EmergencyRoomRawData from "./components/GroundFloor/EmergencyRoomRawData";
import ChemoWardRawData from "./components/Basement/ChemoWardRawData";
import HandHygieneAudit from "./components/HandHygenieAudit";
import HandHygieneReport from "./components/Report/HandHygieneReport";
import TrainingFeedBack from "./components/TrainingFeedBack";
import TrainingFeedbackReport from "./components/Report/TrainingFeedBackReport";
import Pharmacy from "./components/Basement/Pharmacy";
import Mockdrills from "./components/Others/Mockdrills";

function App() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, [location]);

  const showSidebar =
    userRole &&
    !["/", "/Login", "/AdminLogin", "/EmployeeLogin"].includes(
      location.pathname
    );
  const showLogo = !showSidebar && location.pathname !== "/";
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
  ].includes(location.pathname);

  console.log("Rendering App with userRole:", userRole);

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
        <Routes >
          <Route path="/" element={<LandingPage />} />
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
        </Routes>
      </div>
    </div>
  );
}

export default App;

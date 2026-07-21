import React, { useState } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import {
  Home,
  FileText,
  Table,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Sigma,
  ClipboardList,
  Droplets,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./VerticalNavbar.css";

const SidebarItem = ({ to, icon: Icon, label, sub = false, onClick, trailing }) => {
  const inner = (
    <CDBSidebarMenuItem
      className={`sidebar-menu-item ${sub ? "sidebar-menu-item-sub" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-menu-item-inner">
        {Icon && <Icon size={18} className="sidebar-menu-item-icon" />}
        <span className="sidebar-menu-item-label">{label}</span>
        {trailing}
      </span>
    </CDBSidebarMenuItem>
  );

  if (!to) return inner;

  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
      {inner}
    </NavLink>
  );
};

const Sidebar = ({ userRole = "", loginMethod = "", location = "", isOpen, toggleSidebar }) => {
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const { theme } = useTheme();

  const toggleReportDropdown = () => {
    setReportDropdownOpen(!reportDropdownOpen);
  };

  // Render a placeholder or default content if userRole is not defined
  if (!userRole) {
    return <div className="sidebar-placeholder">Loading...</div>;
  }

  const reportsDropdown = (
    <div className="sidebar-dropdown">
      <SidebarItem
        icon={FileText}
        label="Reports"
        onClick={toggleReportDropdown}
        trailing={reportDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      />
      {reportDropdownOpen && (
        <div className="sidebar-dropdown-content">
          <SidebarItem to="/Report" label="General Report" sub />
          <SidebarItem to="/MasterDataReport" label="Master Data Report" sub />
          <SidebarItem to="/HandHygieneReport" label="Hand Hygiene Report" sub />
          <SidebarItem to="/TrainingFeedbackReport" label="Training Feedback Report" sub />
          <SidebarItem to="/IncidentReportReport" label="Incident Report" sub />
          <SidebarItem to="/SupervisorInvestigationReport" label="Supervisor Investigation Report" sub />
        </div>
      )}
    </div>
  );

  let content;

  // For Admin, when login through Admin Login or Employee Login
  if (userRole === "Admin") {
    content = (
      <>
        <SidebarItem to="/HandHygieneAudit" icon={Droplets} label="Hand Hygiene Audit" />
        {reportsDropdown}
        <SidebarItem to="/Availability" icon={Table} label="Availability" />
        <SidebarItem to="/Formula" icon={Sigma} label="Formula" />
      </>
    );
  }
  if (userRole === "In-Charge") {
    content = (
      <>
        <SidebarItem to="/HandHygieneAudit" icon={Droplets} label="Hand Hygiene Audit" />
        {reportsDropdown}
        <SidebarItem to="/Formula" icon={Sigma} label="Formula" />
      </>
    );
  }

  // List of paths where "MasterData" should not be displayed
  const excludedPaths = [
    "/Lab",
    "/XRay",
    "/CT",
    "/MRI",
    "/MRDForm",
    "/FrontOffice",
    "/Dialysis",
    "/Physiotherapy",
    "/HR",
    "/OPD",
    "/OTForm",
    "IPPharmacy",
    "IPPharmacy",
  ];

  // Determine the appropriate MasterData route based on the current location
  const getMasterDataRoute = (pathname) => {
    if (pathname.includes("FirstFloor")) return "/FirstFloorRawData";
    if (pathname.includes("SecondFloor")) return "/SecondFloorRawData";
    if (pathname.includes("FirstSuit")) return "/FirstSuitRawData";
    if (pathname.includes("SecondSuit")) return "/SecondSuitRawData";
    if (pathname.includes("ThirdFloor")) return "/ThirdFloorRawData";
    if (pathname.includes("RecoveryWard")) return "/RecoveryWardRawData";
    if (pathname.includes("ChemoWard")) return "/ChemoWardRawData";
    if (pathname.includes("EmergencyRoom")) return "/EmergencyRoomRawData";
    if (pathname.includes("SICU")) return "/SICURawData";
    if (pathname.includes("NICU")) return "/NICURawData";
    if (pathname.includes("MICU")) return "/MICURawData";
    if (pathname.includes("HandHygieneAudit")) return "/HandHygieneAudit";
    return "/FirstFloorRawData"; // Default route if none match
  };

  // For both Admin and Employee when login through Employee Login or Employee logs in
  if (
    loginMethod === "EmployeeLogin" ||
    userRole === "Employee" ||
    (userRole === "Admin" && loginMethod === "EmployeeLogin")
  ) {
    content = (
      <>
        {!excludedPaths.includes(location.pathname) && (
          <SidebarItem
            to={getMasterDataRoute(location.pathname)}
            icon={FileSpreadsheet}
            label="Master Data"
          />
        )}
        <SidebarItem to="/HandHygieneAudit" icon={Droplets} label="Hand Hygiene Audit" />

        <div className="sidebar-dropdown">
          <SidebarItem
            icon={FileText}
            label="Reports"
            onClick={toggleReportDropdown}
            trailing={reportDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          />
          {reportDropdownOpen && (
            <div className="sidebar-dropdown-content">
              <SidebarItem to="/Report" label="General Report" sub />
              <SidebarItem to="/MasterDataReport" label="Master Data Report" sub />
              <SidebarItem to="/IncidentReportReport" label="Incident Report" sub />
            </div>
          )}
        </div>
      </>
    );
  }

  const getHomeRoute = () => {
    const path = location?.pathname || "";
    if (path.includes("Incident") || path.includes("SupervisorInvestigation")) {
      return "/IncidentDashboard";
    }
    return "/QualityIndicators";
  };

  const isDark = theme === "dark";

  return (
    <>
      <div 
        className={`sidebar-backdrop ${isOpen ? "open" : ""}`} 
        onClick={toggleSidebar} 
      />
      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        <CDBSidebar
          textColor={isDark ? "#e6edf3" : "#0f172a"}
          backgroundColor={isDark ? "#111c2b" : "#ffffff"}
        >
          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              <SidebarItem to={getHomeRoute()} icon={Home} label="Home" onClick={toggleSidebar} />
              <SidebarItem to="/TrainingFeedBack" icon={ClipboardList} label="Training Feed Back" onClick={toggleSidebar} />
              {/* Note: In a full implementation, you might want to pass onClick={toggleSidebar} to the other dynamic items as well to auto-close on selection */}
              {content}
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </>
  );
};

export default Sidebar;

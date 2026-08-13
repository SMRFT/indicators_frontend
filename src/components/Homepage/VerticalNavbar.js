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
  ShieldAlert,
  FileCheck,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./VerticalNavbar.css";

const ALL_REPORTS = [
  {
    to: "/Report",
    label: "General Report",
    icon: FileText,
    roles: ["Admin", "In-Charge", "Employee"],
  },
  {
    to: "/MasterDataReport",
    label: "Master Data Report",
    icon: FileSpreadsheet,
    roles: ["Admin", "In-Charge", "Employee"],
  },
  {
    to: "/HandHygieneReport",
    label: "Hand Hygiene Report",
    icon: Droplets,
    roles: ["Admin", "In-Charge"],
  },
  {
    to: "/TrainingFeedbackReport",
    label: "Training Feedback Report",
    icon: ClipboardList,
    roles: ["Admin", "In-Charge", "Employee"],
  },
  {
    to: "/IncidentReportReport",
    label: "Incident Report",
    icon: ShieldAlert,
    roles: ["Admin", "In-Charge", "Employee"],
  },
  {
    to: "/SupervisorInvestigationReport",
    label: "Supervisor Investigation Report",
    icon: FileCheck,
    roles: ["Admin", "In-Charge"],
  },
];

const SidebarItem = ({ to, icon: Icon, iconSize, label, sub = false, onClick, trailing }) => {
  const defaultSize = sub ? 18 : 22;
  const sizeToUse = iconSize || defaultSize;

  const inner = (
    <CDBSidebarMenuItem
      className={`sidebar-menu-item ${sub ? "sidebar-menu-item-sub" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-menu-item-inner">
        {Icon && <Icon size={sizeToUse} className="sidebar-menu-item-icon" />}
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

const Sidebar = ({ userRole = "", loginMethod = "", location = "", isOpen, toggleSidebar }) => {
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const { theme } = useTheme();

  const toggleReportDropdown = () => {
    setReportDropdownOpen(!reportDropdownOpen);
  };

  const effectiveRole = userRole || localStorage.getItem("userRole") || localStorage.getItem("role") || "";

  // Render a placeholder or default content if userRole is not defined
  if (!effectiveRole) {
    return <div className="sidebar-placeholder">Loading...</div>;
  }

  const availableReports = ALL_REPORTS.filter((report) =>
    report.roles.includes(effectiveRole)
  );

  const reportsDropdown = (
    <div className="sidebar-dropdown">
      <SidebarItem
        icon={FileText}
        iconSize={24}
        label="Reports"
        onClick={toggleReportDropdown}
        trailing={reportDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      />
      {reportDropdownOpen && (
        <div className="sidebar-dropdown-content">
          {availableReports.map((report) => (
            <SidebarItem
              key={report.to}
              to={report.to}
              icon={report.icon}
              iconSize={18}
              label={report.label}
              sub
              onClick={toggleSidebar}
            />
          ))}
        </div>
      )}
    </div>
  );

  let content;

  // For Admin, when login through Admin Login
  if (effectiveRole === "Admin" && loginMethod !== "EmployeeLogin") {
    content = (
      <>
        <SidebarItem to="/HandHygieneAudit" icon={Droplets} label="Hand Hygiene Audit" />
        {reportsDropdown}
        <SidebarItem to="/Availability" icon={Table} label="Availability" />
        <SidebarItem to="/Formula" icon={Sigma} label="Formula" />
      </>
    );
  } else if (effectiveRole === "In-Charge") {
    content = (
      <>
        <SidebarItem to="/HandHygieneAudit" icon={Droplets} label="Hand Hygiene Audit" />
        {reportsDropdown}
        <SidebarItem to="/Formula" icon={Sigma} label="Formula" />
      </>
    );
  } else {
    // For Employee or EmployeeLogin
    content = (
      <>
        {location?.pathname && !excludedPaths.includes(location.pathname) && (
          <SidebarItem
            to={getMasterDataRoute(location.pathname)}
            icon={FileSpreadsheet}
            label="Master Data"
          />
        )}
        <SidebarItem to="/HandHygieneAudit" icon={Droplets} label="Hand Hygiene Audit" />
        {reportsDropdown}
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
              {content}
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </>
  );
};

export default Sidebar;


import React from "react";
import DeptIcon from "../Common/DeptIcon";
import { FileText, FileSpreadsheet, Droplets, ClipboardList, ShieldAlert, FileCheck } from "lucide-react";

const REPORT_ICONS = [
  { icon: FileText, label: 'General Report', key: 'Report', roles: ["Admin", "In-Charge", "Employee"] },
  { icon: FileSpreadsheet, label: 'Master Data Report', key: 'MasterDataReport', roles: ["Admin", "In-Charge", "Employee"] },
  { icon: Droplets, label: 'Hand Hygiene Report', key: 'HandHygieneReport', roles: ["Admin", "In-Charge"] },
  { icon: ClipboardList, label: 'Training Feedback Report', key: 'TrainingFeedbackReport', roles: ["Admin", "In-Charge", "Employee"] },
  { icon: ShieldAlert, label: 'Incident Report', key: 'IncidentReportReport', roles: ["Admin", "In-Charge", "Employee"] },
  { icon: FileCheck, label: 'Supervisor Investigation Report', key: 'SupervisorInvestigationReport', roles: ["Admin", "In-Charge"] },
];

const ReportIcons = ({ handleIconClick }) => {
  const userRole = localStorage.getItem("userRole") || "Employee";
  const filteredIcons = REPORT_ICONS.filter((item) => item.roles.includes(userRole));

  return (
    <div className="floor-icons">
      {filteredIcons.map((item) => (
        <DeptIcon
          key={item.key}
          icon={item.icon}
          label={item.label}
          size={36}
          onClick={() => handleIconClick(item.key)}
        />
      ))}
    </div>
  );
};

export default ReportIcons;

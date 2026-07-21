import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const ACCENTS = {
  blue: "#2563eb",
  green: "#16a34a",
};

function IncidentDashboard() {
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  return (
    <div className="app-page">
      <main className="incident-wrap">
        <div className="incident-wrap-title">Incident Reporting</div>
        <div className="incident-grid">
          {(userRole === "Employee" || userRole === "Admin") && (
            <div className="incident-card" style={{ borderLeftColor: ACCENTS.blue }}>
              <h3 className="incident-card-title">Incident Form</h3>
              <p className="incident-card-desc">
                Report any safety, clinical, medication, or general hazard incidents observed in the hospital.
              </p>
              <button
                className="incident-card-btn"
                style={{ borderColor: ACCENTS.blue, color: ACCENTS.blue }}
                onClick={() => navigate("/IncidentReport")}
              >
                New Incident Form
              </button>
            </div>
          )}

          <div className="incident-card" style={{ borderLeftColor: ACCENTS.blue }}>
            <h3 className="incident-card-title">Incident Reports Archive</h3>
            <p className="incident-card-desc">
              View logs, download reports, or search through all submitted incident reports.
            </p>
            <button
              className="incident-card-btn"
              style={{ borderColor: ACCENTS.blue, color: ACCENTS.blue }}
              onClick={() => navigate("/IncidentReportReport")}
            >
              View Reports
            </button>
          </div>

          {(userRole === "Admin" || userRole === "In-Charge") && (
            <div className="incident-card" style={{ borderLeftColor: ACCENTS.blue }}>
              <h3 className="incident-card-title">Supervisor's Investigation</h3>
              <p className="incident-card-desc">
                Perform root cause analysis (5-Whys) and assign corrective/preventive actions to logged incidents.
              </p>
              <button
                className="incident-card-btn"
                style={{ borderColor: ACCENTS.blue, color: ACCENTS.blue }}
                onClick={() => navigate("/SupervisorInvestigation")}
              >
                Start RCA Investigation
              </button>
            </div>
          )}

          {(userRole === "Admin" || userRole === "In-Charge") && (
            <div className="incident-card" style={{ borderLeftColor: ACCENTS.blue }}>
              <h3 className="incident-card-title">RCA Reports Archive</h3>
              <p className="incident-card-desc">
                View logs, download reports, or search through all supervisor root cause investigations.
              </p>
              <button
                className="incident-card-btn"
                style={{ borderColor: ACCENTS.blue, color: ACCENTS.blue }}
                onClick={() => navigate("/SupervisorInvestigationReport")}
              >
                View RCA Reports
              </button>
            </div>
          )}

          {userRole === "Admin" && (
            <div className="incident-card" style={{ borderLeftColor: ACCENTS.green }}>
              <h3 className="incident-card-title">Incident Classifications</h3>
              <p className="incident-card-desc">
                Manage incident classification categories, checkbox options, and allocate category in-charges dynamically.
              </p>
              <button
                className="incident-card-btn"
                style={{ borderColor: ACCENTS.green, color: ACCENTS.green }}
                onClick={() => navigate("/IncidentClassification")}
              >
                Manage Classifications
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default IncidentDashboard;

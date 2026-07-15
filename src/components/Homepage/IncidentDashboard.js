import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../images/shanmuga-hospital-logo.jpg';
import './LandingPage.css';

function IncidentDashboard() {
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  return (
    <div>
      <div className="landing-logo">
        <img src={Logo} alt="Shanmuga Hospital Logo" className="logo" />
      </div>

      <div className="landing-page">
        {/* Header Action Buttons */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "100px",
            paddingRight: "50px",
            gap: "20px"
          }}
        >
          <div className="header-buttons">
            {/* Home button */}
            <button
              className="header-btn home-btn"
              onClick={() => navigate("/")}
              style={{
                background: "#3b82f6",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "18px",
                whiteSpace: "nowrap",
                width: "auto",
                height: "auto"
              }}
            >
              Home
            </button>

            {/* Admin Login button */}
            {userRole === "Admin" && (
              <button
                className="header-btn admin-btn"
                onClick={() => navigate("/Report")}
                style={{
                  background: "#109b76",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontSize: "18px",
                }}
              >
                Admin Login
              </button>
            )}
          </div>
        </div>

        {/* Incident / RCA Dashboard */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
          <div className="row floor-container justify-content-center px-4 py-4" style={{ gap: "24px" }}>
            {/* Card 1: Submit Incident Report */}
            {(userRole === "Employee" || userRole === "Admin") && (
              <div className="col-12 col-md-5 p-4 incident-card" style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderLeft: '6px solid #3b82f6',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
              }}>
                <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '22px', marginBottom: '12px' }}>Incident Form</h3>
                <p style={{ color: '#fff', fontSize: '15px', lineHeight: '1.5', minHeight: '60px', opacity: 0.95 }}>
                  Report any safety, clinical, medication, or general hazard incidents observed in the hospital.
                </p>
                <button
                  onClick={() => navigate("/IncidentReport")}
                  style={{
                    background: "#0f172a",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    width: "auto",
                    height: "auto"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#1e293b';
                    e.target.style.borderColor = '#00f0ff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#0f172a';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                >
                  New Incident Form
                </button>
              </div>
            )}

            {/* Card 2: Incident Report Archive */}
            <div className="col-12 col-md-5 p-4 incident-card" style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderLeft: '6px solid #3b82f6',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
            }}>
              <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '22px', marginBottom: '12px' }}>Incident Reports Archive</h3>
              <p style={{ color: '#fff', fontSize: '15px', lineHeight: '1.5', minHeight: '60px', opacity: 0.95 }}>
                View logs, download reports, or search through all submitted incident reports.
              </p>
              <button
                onClick={() => navigate("/IncidentReportReport")}
                style={{
                  background: "#0f172a",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  width: "auto",
                  height: "auto"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#1e293b';
                  e.target.style.borderColor = '#00f0ff';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#0f172a';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                View Reports
              </button>
            </div>

            {/* Card 3: Supervisor Investigation (Visible to Admin, In-Charge) */}
            {(userRole === "Admin" || userRole === "In-Charge") && (
              <div className="col-12 col-md-5 p-4 incident-card" style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderLeft: '6px solid #3b82f6',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
              }}>
                <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '22px', marginBottom: '12px' }}>Supervisor's Investigation</h3>
                <p style={{ color: '#fff', fontSize: '15px', lineHeight: '1.5', minHeight: '60px', opacity: 0.95 }}>
                  Perform root cause analysis (5-Whys) and assign corrective/preventive actions to logged incidents.
                </p>
                <button
                  onClick={() => navigate("/SupervisorInvestigation")}
                  style={{
                    background: "#0f172a",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    width: "auto",
                    height: "auto"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#1e293b';
                    e.target.style.borderColor = '#00f0ff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#0f172a';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                >
                  Start RCA Investigation
                </button>
              </div>
            )}

            {/* Card 4: Supervisor Investigation Report (Visible to Admin, In-Charge) */}
            {(userRole === "Admin" || userRole === "In-Charge") && (
              <div className="col-12 col-md-5 p-4 incident-card" style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderLeft: '6px solid #3b82f6',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
              }}>
                <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '22px', marginBottom: '12px' }}>RCA Reports Archive</h3>
                <p style={{ color: '#fff', fontSize: '15px', lineHeight: '1.5', minHeight: '60px', opacity: 0.95 }}>
                  View logs, download reports, or search through all supervisor root cause investigations.
                </p>
                <button
                  onClick={() => navigate("/SupervisorInvestigationReport")}
                  style={{
                    background: "#0f172a",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    width: "auto",
                    height: "auto"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#1e293b';
                    e.target.style.borderColor = '#00f0ff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#0f172a';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}>
                  View RCA Reports
                </button>
              </div>
            )}

            {/* Card 5: Incident Classification & Allocation (Visible to Admin only) */}
            {userRole === "Admin" && (
              <div className="col-12 col-md-5 p-4 incident-card" style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderLeft: '6px solid #109b76',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
              }}>
                <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '22px', marginBottom: '12px' }}>Incident Classifications</h3>
                <p style={{ color: '#fff', fontSize: '15px', lineHeight: '1.5', minHeight: '60px', opacity: 0.95 }}>
                  Manage incident classification categories, checkbox options, and allocate category in-charges dynamically.
                </p>
                <button
                  onClick={() => navigate("/IncidentClassification")}
                  style={{
                    background: "#0f172a",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    width: "auto",
                    height: "auto"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#1e293b';
                    e.target.style.borderColor = '#109b76';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#0f172a';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}>
                  Manage Classifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDashboard;

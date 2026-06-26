import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import Logo from '../images/shanmuga-hospital-logo.jpg';
import './LandingPage.css';

function LandingPage() {
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("userRole");
    window.location.href = "/Login";
  };

  return (
    <div>
      <div className="landing-logo">
        <img src={Logo} alt="Shanmuga Hospital Logo" className="logo" />
      </div>

      <div className="landing-page">
        {/* Header Action Buttons (Admin Login, Sign Out) */}
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

            {/* Sign Out button */}
            {userRole && (
              <button
                className="header-btn signout-btn"
                onClick={handleSignOut}
                style={{
                  background: "#ff5252",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Select Module Screen */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "55vh",
          width: "100%",
          padding: "20px"
        }}>
          <div className="landing-panel-bg" style={{
            borderRadius: "16px",
            padding: "45px 50px",
            maxWidth: "650px",
            width: "100%",
            textAlign: "center"
          }}>
            <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "28px", marginBottom: "8px" }}>
              Select Your Module
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "15px", marginBottom: "35px" }}>
              Please select a module to view available sections.
            </p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap"
            }}>
              {/* Option 1: Quality Indicators */}
              <div
                onClick={() => navigate('/QualityIndicators')}
                style={{
                  background: "rgba(15, 23, 42, 0.85)",
                  border: "2px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "12px",
                  padding: "25px 20px",
                  width: "230px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(15, 23, 42, 0.95)";
                  e.currentTarget.style.borderColor = "#00f0ff";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 240, 255, 0.3)";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(15, 23, 42, 0.85)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <FiBarChart2 style={{ fontSize: "38px", color: "#00f0ff" }} />
                <span style={{ color: "#fff", fontWeight: "700", fontSize: "17px", textAlign: "center" }}>
                  Quality Indicators
                </span>
              </div>

              {/* Option 2: Incident Report & RCA */}
              <div
                onClick={() => navigate('/IncidentDashboard')}
                style={{
                  background: "rgba(15, 23, 42, 0.85)",
                  border: "2px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "12px",
                  padding: "25px 20px",
                  width: "230px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(15, 23, 42, 0.95)";
                  e.currentTarget.style.borderColor = "#00f0ff";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 240, 255, 0.3)";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(15, 23, 42, 0.85)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <FiAlertTriangle style={{ fontSize: "38px", color: "#00f0ff" }} />
                <span style={{ color: "#fff", fontWeight: "700", fontSize: "17px", textAlign: "center" }}>
                  Incident Report 
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

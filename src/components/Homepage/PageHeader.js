import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ArrowLeft, Menu, LogOut } from "lucide-react";
import { Modal, Button } from "react-bootstrap";
import Logo from "../images/shanmuga-hospital-logo.jpg";
import { useTheme } from "../../context/ThemeContext";
import "./PageHeader.css";

const PageHeader = ({ showBack = false, backTo = "/", showAdmin = false, showSignOut = false, onSignOut, toggleSidebar, showSidebarToggle }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const handleConfirmSignOut = () => {
    setShowModal(false);
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="app-header-brand">
          {showSidebarToggle && (
            <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
              <Menu size={24} />
            </button>
          )}
          <img src={Logo} alt="Shanmuga Hospital Logo" className="app-header-logo" onClick={() => navigate("/")} />
        </div>

        <div className="app-header-actions">
          <button
            className="theme-toggle-btn"
            title="Toggle dark mode"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {showBack && (
            <button className="header-btn back-btn" onClick={() => navigate(backTo)}>
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          {showAdmin && (
            <button className="header-btn admin-btn" onClick={() => navigate("/Report")}>
              Admin Login
            </button>
          )}

          {showSignOut && (
            <button className="header-btn signout-btn" onClick={() => setShowModal(true)}>
              Sign Out
            </button>
          )}
        </div>
      </header>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="signout-modal">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <LogOut size={20} color="#dc3545" /> Confirm Sign Out
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "15px", padding: "20px 24px" }}>
          Are you sure you want to sign out of Shanmuga Hospital Quality Indicators &amp; Incident Management System?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} style={{ fontWeight: "600" }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmSignOut} style={{ fontWeight: "600" }}>
            Yes, Sign Out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PageHeader;

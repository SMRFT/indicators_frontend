import React from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ArrowLeft, Menu } from "lucide-react";
import Logo from "../images/shanmuga-hospital-logo.jpg";
import { useTheme } from "../../context/ThemeContext";
import "./PageHeader.css";

const PageHeader = ({ showBack = false, backTo = "/", showAdmin = false, showSignOut = false, onSignOut, toggleSidebar, showSidebarToggle }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
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
          <button className="header-btn signout-btn" onClick={onSignOut}>
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};

export default PageHeader;

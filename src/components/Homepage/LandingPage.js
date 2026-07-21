import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="app-page">
      <main className="module-select-wrap">
        <div className="module-select-card">
          <div className="module-select-title">Select Your Module</div>
          <div className="module-select-sub">Please select a module to view available sections.</div>

          <div className="module-options">
            <div
              className="module-option module-option-teal"
              onClick={() => navigate('/QualityIndicators')}
            >
              <div className="module-option-icon module-option-icon-teal">
                <FiBarChart2 />
              </div>
              <span className="module-option-label">Quality Indicators</span>
            </div>

            <div
              className="module-option module-option-amber"
              onClick={() => navigate('/IncidentDashboard')}
            >
              <div className="module-option-icon module-option-icon-amber">
                <FiAlertTriangle />
              </div>
              <span className="module-option-label">Incident Form</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;

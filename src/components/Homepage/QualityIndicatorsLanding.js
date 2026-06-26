import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { TbHexagonNumber0, TbHexagonNumber1, TbHexagonNumber2, TbHexagonNumber3, TbHexagonPlus } from 'react-icons/tb';
import { FiHexagon, FiArrowDown } from 'react-icons/fi';
import Logo from '../images/shanmuga-hospital-logo.jpg';
import BasementIcons from '../Basement/BasementIcons';
import FirstFloorIcons from '../Firstfloor/FirstFloorIcons';
import SecondFloorIcons from '../Secondfloor/SecondFloorIcons';
import GroundFloorIcons from '../GroundFloor/GroundFloorIcons';
import ThirdFloorIcons from '../Thirdfloor/ThirdFloorIcons';
import OtherIcons from '../Others/OtherIcons';
import './LandingPage.css';

function QualityIndicatorsLanding() {
  const [showPanel, setShowPanel] = useState(false);
  const [currentFloor, setCurrentFloor] = useState('');
  const [currentIcons, setCurrentIcons] = useState(null);
  const userRole = localStorage.getItem("userRole");

  const navigate = useNavigate();

  const handleFloorClick = (floor) => {
    setCurrentFloor(floor);
    setShowPanel(true);
    setCurrentIcons(getIconsForFloor(floor));
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setCurrentFloor('');
    setCurrentIcons(null);
  };

  const handleIconClick = (sectionName) => {
    if (sectionName) {
      navigate(`/${sectionName}`);
    }
  };

  const getIconsForFloor = (floor) => {
    switch (floor) {
      case 'Basement':
        return <BasementIcons handleIconClick={handleIconClick} />;
      case 'Ground Floor':
        return <GroundFloorIcons handleIconClick={handleIconClick} />;
      case 'Floor 1':
        return <FirstFloorIcons handleIconClick={handleIconClick} />;
      case 'Floor 2':
        return <SecondFloorIcons handleIconClick={handleIconClick} />;
      case 'Floor 3':
        return <ThirdFloorIcons handleIconClick={handleIconClick} />;
      case 'Others':
        return <OtherIcons handleIconClick={handleIconClick} />;
      default:
        return null;
    }
  };

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

        {/* Floor Selection Grid (Quality Indicators) */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
          <div className='row floor-container'>
            <div className='col-6 col-md-3 floor' onClick={() => handleFloorClick('Basement')}>
              <div className="hexagon-container">
                <FiHexagon className="floor-icon" />
                <FiArrowDown className="arrow-down-icon" />
              </div>
              <p>Basement</p>
            </div>
            <div className='col-6 col-md-3 floor' onClick={() => handleFloorClick('Ground Floor')}>
              <TbHexagonNumber0 className="floor-icon" />
              <p style={{ whiteSpace: "nowrap" }}>Ground Floor</p>
            </div>
            <div className='col-6 col-md-3 floor' onClick={() => handleFloorClick('Floor 1')}>
              <TbHexagonNumber1 className="floor-icon" />
              <p>Floor 1</p>
            </div>
            <div className='col-6 col-md-3 floor' onClick={() => handleFloorClick('Floor 2')}>
              <TbHexagonNumber2 className="floor-icon" />
              <p>Floor 2</p>
            </div>
            <div className='col-6 col-md-3 floor' onClick={() => handleFloorClick('Floor 3')}>
              <TbHexagonNumber3 className="floor-icon" />
              <p>Floor 3</p>
            </div>
            <div className='col-6 col-md-3 floor' onClick={() => handleFloorClick('Others')}>
              <TbHexagonPlus className="floor-icon" />
              <p>Others</p>
            </div>
          </div>
        </div>

        {/* Sliding Panel */}
        {showPanel && (
          <div className="sliding-panel-container">
            <div className="close-icon" onClick={handleClosePanel}><FaTimes /></div>
            <h2 style={{ color: "#E1F7F5" }}>{currentFloor}</h2>
            {currentIcons}
          </div>
        )}
      </div>
    </div>
  );
}

export default QualityIndicatorsLanding;

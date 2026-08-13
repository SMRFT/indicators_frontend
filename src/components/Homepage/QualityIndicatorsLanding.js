import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { TbHexagonNumber0, TbHexagonNumber1, TbHexagonNumber2, TbHexagonNumber3, TbHexagonPlus } from 'react-icons/tb';
import { FiHexagon, FiArrowDown } from 'react-icons/fi';
import { Droplets, FileText } from 'lucide-react';
import BasementIcons from '../Basement/BasementIcons';
import FirstFloorIcons from '../Firstfloor/FirstFloorIcons';
import SecondFloorIcons from '../Secondfloor/SecondFloorIcons';
import GroundFloorIcons from '../GroundFloor/GroundFloorIcons';
import ThirdFloorIcons from '../Thirdfloor/ThirdFloorIcons';
import OtherIcons from '../Others/OtherIcons';
import ReportIcons from '../Report/ReportIcons';
import './LandingPage.css';

function QualityIndicatorsLanding() {
  const [showPanel, setShowPanel] = useState(false);
  const [currentFloor, setCurrentFloor] = useState('');
  const [currentIcons, setCurrentIcons] = useState(null);

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
      case 'Reports':
        return <ReportIcons handleIconClick={handleIconClick} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-page">
      <main className="floor-select-wrap">
        <div className="floor-select-title">Quality Indicators</div>
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
          <div className='col-6 col-md-3 floor' onClick={() => navigate('/HandHygieneAudit')}>
            <Droplets size={52} className="floor-icon floor-icon-lucide" />
            <p style={{ whiteSpace: "nowrap" }}>Hand Hygiene</p>
          </div>
          <div className='col-6 col-md-3 floor' onClick={() => handleFloorClick('Reports')}>
            <FileText size={52} className="floor-icon floor-icon-lucide" />
            <p>Reports</p>
          </div>
        </div>

        {showPanel && (
          <div className="sliding-panel-overlay" onClick={handleClosePanel}>
            <div className="sliding-panel-container" onClick={(e) => e.stopPropagation()}>
              <div className="close-icon" onClick={handleClosePanel}><FaTimes /></div>
              <h2>{currentFloor}</h2>
              {currentIcons}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default QualityIndicatorsLanding;

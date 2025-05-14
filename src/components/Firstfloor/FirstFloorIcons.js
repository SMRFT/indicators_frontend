import React from 'react';
import FirstFloorImage from './Firstflooriconimages/FirstFloor.png';
import FirstSuitImage from './Firstflooriconimages/FirstSuit.png';
import MICUImage from './Firstflooriconimages/SICU.png';
import NICUImage from './Firstflooriconimages/SICU.png';
import DialysisImage from './Firstflooriconimages/Dialysis.png';
import OTImage from './Firstflooriconimages/OT.png';
import RecoveryWardImage from './Firstflooriconimages/RecoveryWard.png';
const FirstFloorIcons = ({ handleIconClick }) => {
  return (
    <div style={{ display: 'flex' }} className='floor-icons'>

      <div style={{ width: '100px', height: '100px' }}>
        <div className="image-container" onClick={() => handleIconClick('FirstFloor')}>
          <img style={{ width: "100%", height: "100%" }} src={FirstFloorImage} alt="First Floor" />
          <p className="image-text">First Floor</p>
        </div>
      </div>

      <div style={{ width: '100px', height: '100px', marginLeft: '25px', marginTop: '-5px' }}>
        <div className="image-container" onClick={() => handleIconClick('FirstSuit')}>
          <img style={{ width: "100%", height: "100%" }} src={FirstSuitImage} alt="First Suit" />
          <p className="image-text">First Suit</p>
        </div>
      </div>

      <div style={{ width: '100px', height: '100px', marginLeft: '25px', marginTop: '-5px' }}>
        <div className="image-container" onClick={() => handleIconClick('MICUForm')}>
          <img style={{ width: "100%", height: "150%", marginTop: '-15px' }} src={MICUImage} alt="MICU Form" />
          <p className="image-text" style={{ marginTop: '-5px' }}>MICU Form</p>
        </div>
      </div>

      <div style={{ width: '100px', height: '100px', marginLeft: '25px', marginTop: '-5px' }}>
        <div className="image-container" onClick={() => handleIconClick('NICUForm')}>
          <img style={{ width: "100%", height: "150%", marginTop: '-15px' }} src={NICUImage} alt="NICU Form" />
          <p className="image-text" style={{ marginTop: '-5px' }}>NICU Form</p>
        </div>
      </div>

      <div style={{ width: '100px', height: '100px', marginLeft: '25px', marginTop: '-5px' }}>
        <div className="image-container" onClick={() => handleIconClick('Dialysis')}>
          <img style={{ width: "100%", height: "100%" }} src={DialysisImage} alt="Dialysis" />
          <p className="image-text">Dialysis</p>
        </div>
      </div>

      <div style={{ width: '100px', height: '100px', marginLeft: '25px', marginTop: '-5px' }}>
        <div className="image-container" onClick={() => handleIconClick('OTForm')}>
          <img style={{ width: "100%", height: "100%" }} src={OTImage} alt="OTForm" />
          <p className="image-text">OT Form</p>
        </div>
      </div>

      <div style={{ width: '100px', height: '100px', marginLeft: '25px', marginTop: '-5px' }}>
        <div className="image-container" onClick={() => handleIconClick('RecoveryWard')}>
          <img style={{ width: "100%", height: "100%" }} src={RecoveryWardImage} alt="Recovery Ward" />
          <p className="image-text">Recovery Ward</p>
        </div>
      </div>

    </div>
  );
};

export default FirstFloorIcons;


import React from "react";
import MRIImage from './Othersiconimages/MRI.png';
import PhysiotherapyImage from './Othersiconimages/Physiotherapy.png';
import CTImage from './Othersiconimages/CT.png';
import MockdrillImage from './Othersiconimages/Mockdrill.png';

const OtherIcons = ({ handleIconClick }) => {
  return (
    <div style={{ display: "flex" }} className="floor-icons">
      
      <div style={{ width: "100px", height: "100px" }}>
        <div className="image-container" onClick={() => handleIconClick("MRI")}>
          <img style={{ width: "100%", height: "100%" }} src={MRIImage} alt="MRI" />
          <p className="image-text">MRI</p>
        </div>
      </div>

      <div style={{ width: "100px", height: "100px", marginLeft: "30px" }}>
        <div className="image-container" onClick={() => handleIconClick("Physiotherapy")}>
          <img style={{ width: "100%", height: "90%" }} src={PhysiotherapyImage} alt="Physiotherapy" />
          <p className="image-text" style={{ marginTop: "20px" }}>Physiotherapy</p>
        </div>
      </div>

      <div style={{ width: "100px", height: "100px", marginLeft: "30px" }}>
        <div className="image-container" onClick={() => handleIconClick("CT")}>
          <img style={{ width: "100%", height: "100%" }} src={CTImage} alt="CT" />
          <p className="image-text">CT</p>
        </div>
      </div>

      <div style={{ width: "100px", height: "100px", marginLeft: "30px" }}>
        <div className="image-container" onClick={() => handleIconClick("MockDrills")}>
          <img style={{ width: "100%", height: "90%" }} src={MockdrillImage} alt="Mock Drill" />
          <p className="image-text" style={{ marginTop: "20px" }}>Mock Drill</p>
        </div>
      </div>

    </div>
  );
};

export default OtherIcons;

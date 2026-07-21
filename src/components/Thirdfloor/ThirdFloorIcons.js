import React from 'react';
import DeptIcon from '../Common/DeptIcon';
import Thirdfloorimage from './Thirdflooriconimages/FirstFloor.png';

const ThirdFloorIcons = ({ handleIconClick }) => (
  <div className="floor-icons">
    <DeptIcon
      img={Thirdfloorimage}
      label="Third Floor"
      onClick={() => handleIconClick('ThirdFloor')}
    />
  </div>
);

export default ThirdFloorIcons;

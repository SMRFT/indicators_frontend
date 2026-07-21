import React from 'react';
import DeptIcon from '../Common/DeptIcon';
import EmergencyRoomImage from './Groudflooriconimages/EmergencyRoom.png';
import FrontOfficeImage from './Groudflooriconimages/FrontOffice.png';
import OPDImage from './Groudflooriconimages/OPD.png';

const ICONS = [
  { img: EmergencyRoomImage, label: 'Emergency Room', key: 'EmergencyRoom' },
  { img: FrontOfficeImage, label: 'Front Office', key: 'FrontOffice' },
  { img: OPDImage, label: 'OPD', key: 'OPD' },
];

const GroundFloorIcons = ({ handleIconClick }) => (
  <div className="floor-icons">
    {ICONS.map((icon) => (
      <DeptIcon
        key={icon.key}
        img={icon.img}
        label={icon.label}
        onClick={() => handleIconClick(icon.key)}
      />
    ))}
  </div>
);

export default GroundFloorIcons;

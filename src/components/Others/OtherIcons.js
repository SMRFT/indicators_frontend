import React from "react";
import DeptIcon from "../Common/DeptIcon";
import MRIImage from './Othersiconimages/MRI.png';
import PhysiotherapyImage from './Othersiconimages/Physiotherapy.png';
import CTImage from './Othersiconimages/CT.png';
import MockdrillImage from './Othersiconimages/Mockdrill.png';

const ICONS = [
  { img: MRIImage, label: 'MRI', key: 'MRI' },
  { img: PhysiotherapyImage, label: 'Physiotherapy', key: 'Physiotherapy' },
  { img: CTImage, label: 'CT', key: 'CT' },
  { img: MockdrillImage, label: 'Mock Drill', key: 'MockDrills' },
];

const OtherIcons = ({ handleIconClick }) => (
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

export default OtherIcons;

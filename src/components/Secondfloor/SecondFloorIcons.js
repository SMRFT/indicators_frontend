import React from 'react';
import DeptIcon from '../Common/DeptIcon';
import SecondFloorImage from './Secondflooriconimages/SecondFloor.png';
import SecondSuitImage from './Secondflooriconimages/SecondSuit.png';
import SICUImage from './Secondflooriconimages/SICU.png';

const ICONS = [
  { img: SecondFloorImage, label: 'Second Floor', key: 'SecondFloor' },
  { img: SecondSuitImage, label: 'Second Suit', key: 'SecondSuit' },
  { img: SICUImage, label: 'SICU Form', key: 'SICUForm' },
];

const SecondFloorIcons = ({ handleIconClick }) => (
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

export default SecondFloorIcons;

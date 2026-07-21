import React from 'react';
import DeptIcon from '../Common/DeptIcon';
import FirstFloorImage from './Firstflooriconimages/FirstFloor.png';
import FirstSuitImage from './Firstflooriconimages/FirstSuit.png';
import MICUImage from './Firstflooriconimages/SICU.png';
import NICUImage from './Firstflooriconimages/SICU.png';
import DialysisImage from './Firstflooriconimages/Dialysis.png';
import OTImage from './Firstflooriconimages/OT.png';
import RecoveryWardImage from './Firstflooriconimages/RecoveryWard.png';

const ICONS = [
  { img: FirstFloorImage, label: 'First Floor', key: 'FirstFloor' },
  { img: FirstSuitImage, label: 'First Suit', key: 'FirstSuit' },
  { img: MICUImage, label: 'MICU Form', key: 'MICUForm' },
  { img: NICUImage, label: 'NICU Form', key: 'NICUForm' },
  { img: DialysisImage, label: 'Dialysis', key: 'Dialysis' },
  { img: OTImage, label: 'OT Form', key: 'OTForm' },
  { img: RecoveryWardImage, label: 'Recovery Ward', key: 'RecoveryWard' },
];

const FirstFloorIcons = ({ handleIconClick }) => (
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

export default FirstFloorIcons;

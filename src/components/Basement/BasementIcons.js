import React from "react";
import DeptIcon from "../Common/DeptIcon";
import HRImage from "./Basementiconimage/HR.png";
import LabImage from "./Basementiconimage/Lab.png";
import XRayImage from "./Basementiconimage/X-Ray.png";
import MRDImage from "./Basementiconimage/MRD.png";
import ChemoImage from "./Basementiconimage/Chemo.png";
import PharmacyImage from "./Basementiconimage/Pharmacy.png";

const ICONS = [
  { img: HRImage, label: "HR", key: "HR" },
  { img: LabImage, label: "Lab", key: "Lab" },
  { img: XRayImage, label: "X-Ray", key: "XRay" },
  { img: MRDImage, label: "MRD Form", key: "MRDForm" },
  { img: ChemoImage, label: "Chemo Ward", key: "ChemoWard" },
  { img: PharmacyImage, label: "Pharmacy", key: "Pharmacy" },
];

const BasementIcons = ({ handleIconClick }) => (
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

export default BasementIcons;

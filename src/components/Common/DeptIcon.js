import React from "react";
import "./DeptIcon.css";

const DeptIcon = ({ img, label, onClick, size = 32 }) => (
  <div className="dept-icon" onClick={onClick}>
    <div className="dept-icon-badge">
      <img src={img} alt={label} style={{ width: size, height: size }} />
    </div>
    <p className="dept-icon-label">{label}</p>
  </div>
);

export default DeptIcon;

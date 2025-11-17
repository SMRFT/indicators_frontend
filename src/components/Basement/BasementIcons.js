import React from "react";
import HRImage from "./Basementiconimage/HR.png";
import LabImage from "./Basementiconimage/Lab.png";
import XRayImage from "./Basementiconimage/X-Ray.png";
import MRDImage from "./Basementiconimage/MRD.png";
import ChemoImage from "./Basementiconimage/Chemo.png";
import PharmacyImage from "./Basementiconimage/Pharmacy.png";



const BasementIcons = ({ handleIconClick }) => {
  return (
    <div style={{ display: "flex" }} className="floor-icons">
      <div style={{ width: "100px", height: "100px" }}>
        <div className="image-container" onClick={() => handleIconClick("HR")}>
          <img
            style={{ width: "100%", height: "100%" }}
            src={HRImage}
            alt="HR"
          />
          <p className="image-text">HR</p>
        </div>
      </div>
      <div style={{ width: "100px", height: "100px" }}>
        <div className="image-container" onClick={() => handleIconClick("Lab")}>
          <img
            style={{ width: "100%", height: "100%" }}
            src={LabImage}
            alt="Lab"
          />
          <p className="image-text">Lab</p>
        </div>
      </div>
      <div style={{ width: "100px", height: "100px", marginLeft: "25px" }}>
        <div
          className="image-container"
          onClick={() => handleIconClick("XRay")}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src={XRayImage}
            alt="XRay"
          />
          <p className="image-text">X-Ray</p>
        </div>
      </div>
      <div style={{ width: "100px", height: "100px", marginLeft: "25px" }}>
        <div
          className="image-container"
          onClick={() => handleIconClick("MRDForm")}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src={MRDImage}
            alt="MRDForm"
          />
          <p className="image-text">MRD Form</p>
        </div>
      </div>
      <div
        style={{
          width: "100px",
          height: "100px",
          marginLeft: "25px",
          marginTop: "-2%",
        }}
      >
        <div
          className="image-container"
          onClick={() => handleIconClick("ChemoWard")}
        >
          <img
            style={{ width: "150%", height: "140%" }}
            src= {ChemoImage}
            alt="Chemo Ward"
          />
          <p
            className="image-text"
            style={{
              marginLeft: "25px",
              marginTop: "-2%",
              whiteSpace: "nowrap",
            }}
          >
            Chemo Ward
          </p>
        </div>
      </div>
      <div
        style={{
          width: "100px",
          height: "100px",
          marginLeft: "25px",
          marginTop: "0%",
        }}
      >
        <div
          className="image-container"
          onClick={() => handleIconClick("Pharmacy")}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src={PharmacyImage}
            alt="Pharmacy"
          />
          <p
            className="image-text"
            style={{
              marginLeft: "25px",
              marginTop: "-2%",
              whiteSpace: "nowrap",
            }}
          >
            Pharmacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasementIcons;

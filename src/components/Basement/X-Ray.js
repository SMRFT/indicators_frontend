import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { DIAGNOSTIC_WARD_FIELDS } from "../Common/baseWardSchema";

const XRay = () => {
  return (
    <GenericWardForm
      title="X-Ray"
      endpoint="Xray/"
      fields={DIAGNOSTIC_WARD_FIELDS}
    />
  );
};

export default XRay;

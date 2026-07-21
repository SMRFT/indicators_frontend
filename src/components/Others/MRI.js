import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { DIAGNOSTIC_WARD_FIELDS } from "../Common/baseWardSchema";

const MRI = () => {
  return (
    <GenericWardForm
      title="MRI"
      endpoint="MRI/"
      fields={DIAGNOSTIC_WARD_FIELDS}
    />
  );
};

export default MRI;

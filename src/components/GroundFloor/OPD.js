import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { OPD_FIELDS } from "../Common/baseWardSchema";

const OPD = () => {
  return (
    <GenericWardForm
      title="OPD"
      endpoint="OPD/"
      fields={OPD_FIELDS}
    />
  );
};

export default OPD;

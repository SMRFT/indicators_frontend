import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { DIAGNOSTIC_WARD_FIELDS } from "../Common/baseWardSchema";

const CT = () => {
  return (
    <GenericWardForm
      title="CT"
      endpoint="CT/"
      fields={DIAGNOSTIC_WARD_FIELDS}
    />
  );
};

export default CT;

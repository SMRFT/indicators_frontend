import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { BASIC_OUTPATIENT_FIELDS } from "../Common/baseWardSchema";

const Physiotherapy = () => {
  return (
    <GenericWardForm
      title="Physiotherapy"
      endpoint="Physiotherapy/"
      fields={BASIC_OUTPATIENT_FIELDS}
    />
  );
};

export default Physiotherapy;

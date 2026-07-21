import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { BASIC_OUTPATIENT_FIELDS } from "../Common/baseWardSchema";

const Dialysis = () => {
  return (
    <GenericWardForm
      title="Dialysis"
      endpoint="Dialysis/"
      fields={BASIC_OUTPATIENT_FIELDS}
    />
  );
};

export default Dialysis;

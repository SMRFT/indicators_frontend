import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { ICU_WARD_FIELDS } from "../Common/baseWardSchema";

const NICUForm = () => {
  return (
    <GenericWardForm
      title="NICU"
      endpoint="NICU/"
      fields={ICU_WARD_FIELDS}
    />
  );
};

export default NICUForm;

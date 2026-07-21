import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { ICU_WARD_FIELDS } from "../Common/baseWardSchema";

const SICUForm = () => {
  return (
    <GenericWardForm
      title="SICU"
      endpoint="SICU/"
      fields={ICU_WARD_FIELDS}
    />
  );
};

export default SICUForm;

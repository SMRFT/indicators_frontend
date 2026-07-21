import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { ICU_WARD_FIELDS } from "../Common/baseWardSchema";

const MICUForm = () => {
  return (
    <GenericWardForm
      title="MICU"
      endpoint="MICU/"
      fields={ICU_WARD_FIELDS}
    />
  );
};

export default MICUForm;

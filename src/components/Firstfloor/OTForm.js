import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { OT_WARD_FIELDS } from "../Common/baseWardSchema";

const OTForm = () => {
  return (
    <GenericWardForm
      title="OT"
      endpoint="OT/"
      fields={OT_WARD_FIELDS}
    />
  );
};

export default OTForm;
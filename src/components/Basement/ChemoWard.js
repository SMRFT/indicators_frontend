import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { CHEMO_WARD_FIELDS } from "../Common/baseWardSchema";

const ChemoWard = () => {
  return (
    <GenericWardForm
      title="Chemo Ward"
      endpoint="ChemoWard/"
      fields={CHEMO_WARD_FIELDS}
    />
  );
};

export default ChemoWard;

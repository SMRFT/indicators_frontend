import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { RECOVERY_WARD_FIELDS } from "../Common/baseWardSchema";

const RecoveryWard = () => {
  return (
    <GenericWardForm
      title="Recovery Ward"
      endpoint="RecoveryWard/"
      fields={RECOVERY_WARD_FIELDS}
    />
  );
};

export default RecoveryWard;
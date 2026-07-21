import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { MOCK_DRILLS_FIELDS } from "../Common/baseWardSchema";

const Mockdrills = () => {
  return (
    <GenericWardForm
      title="Mock Drills"
      endpoint="mockdrills/"
      fields={MOCK_DRILLS_FIELDS}
    />
  );
};

export default Mockdrills;

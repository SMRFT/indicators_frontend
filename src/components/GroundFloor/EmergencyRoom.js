import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { EMERGENCY_ROOM_FIELDS } from "../Common/baseWardSchema";

const EmergencyRoom = () => {
  return (
    <GenericWardForm
      title="Emergency Room"
      endpoint="EmergencyRoom/"
      fields={EMERGENCY_ROOM_FIELDS}
    />
  );
};

export default EmergencyRoom;

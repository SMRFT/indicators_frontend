import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { BASE_WARD_FIELDS } from "../Common/baseWardSchema";

const FirstFloor = () => {
  return (
    <GenericWardForm
      title="First Floor"
      endpoint="FirstFloor/"
      fields={BASE_WARD_FIELDS}
    />
  );
};

export default FirstFloor;

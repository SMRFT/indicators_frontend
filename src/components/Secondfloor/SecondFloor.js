import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { getWardFieldsWithAbbreviation } from "../Common/baseWardSchema";

const SecondFloor = () => {
  return (
    <GenericWardForm
      title="Second Floor"
      endpoint="SecondFloor/"
      fields={getWardFieldsWithAbbreviation()}
    />
  );
};

export default SecondFloor;
import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { getWardFieldsWithAbbreviation } from "../Common/baseWardSchema";

const ThirdFloor = () => {
  return (
    <GenericWardForm
      title="Third Floor"
      endpoint="ThirdFloor/"
      fields={getWardFieldsWithAbbreviation()}
    />
  );
};

export default ThirdFloor;
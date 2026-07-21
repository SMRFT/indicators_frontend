import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { getWardFieldsWithAbbreviation } from "../Common/baseWardSchema";

const SecondSuit = () => {
  return (
    <GenericWardForm
      title="Second Suit"
      endpoint="SecondSuit/"
      fields={getWardFieldsWithAbbreviation()}
    />
  );
};

export default SecondSuit;
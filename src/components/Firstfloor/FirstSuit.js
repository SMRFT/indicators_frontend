import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { getWardFieldsWithAbbreviation } from "../Common/baseWardSchema";

const FirstSuit = () => {
  return (
    <GenericWardForm
      title="First Suit"
      endpoint="FirstSuit/"
      fields={getWardFieldsWithAbbreviation()}
    />
  );
};

export default FirstSuit;
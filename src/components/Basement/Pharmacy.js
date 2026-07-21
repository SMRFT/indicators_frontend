import React from "react";
import GenericWardForm from "../Common/GenericWardForm";
import { PHARMACY_WARD_FIELDS } from "../Common/baseWardSchema";

const Pharmacy = () => {
  return (
    <GenericWardForm
      title="Pharmacy"
      endpoint="Pharmacy/"
      fields={PHARMACY_WARD_FIELDS}
    />
  );
};

export default Pharmacy;

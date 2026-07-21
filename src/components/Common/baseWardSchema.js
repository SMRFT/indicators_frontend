// baseWardSchema.js
// Standard quality indicator fields and specialty ward configurations.

// Common Ward Fields
export const BASE_WARD_FIELDS = [
  { id: "sumOfTimeTakenforInitialAssessment", label: "Sum of Time Taken for Initial Assessment (Minutes)" },
  { id: "totalNumberOfAdmissions", label: "Total Number of Admissions" },
  { id: "numberOfPatientsDischargedInsurance", label: "Number of Patients Discharged (Insurance)" },
  { id: "sumOfTimeTakenForDischargeInsurance", label: "Sum of Time Taken for Discharge (Minutes) (Insurance)" },
  { id: "numberOfPatientsDischargedPay", label: "Number of Patients Discharged (Pay)" },
  { id: "sumOfTimeTakenForDischargePay", label: "Sum of Time Taken for Discharge (Minutes) (Pay)" },
  { 
    id: "totalNumberOfMedicationErrors", 
    label: "Total Number of Medication Errors", 
    remarksId: "totalNumberOfMedicationErrorsRemarks" 
  },
  { id: "totalNumberOfOpportunitiesOfMedicationErrors", label: "Total Number of Opportunities of Medication Errors" },
  {
    id: "numberOfPatientsDevelopingAdverseDrugReactions",
    label: "Number of Patients Developing Adverse Drug Reactions",
    remarksId: "numberOfPatientsDevelopingAdverseDrugReactionsRemarks"
  },
  {
    id: "numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcer",
    label: "Number of Patients Who Develop New or Worsening of Pressure Ulcer",
    remarksId: "numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcerRemarks"
  },
  {
    id: "numberOfPatientFalls",
    label: "Number of Patient Falls",
    remarksId: "numberOfPatientFallsRemarks"
  },
  {
    id: "numberOfTransfusionReaction",
    label: "Number of Transfusion Reaction",
    remarksId: "numberOfTransfusionReactionRemarks"
  },
  {
    id: "numberOfUnitsTransfused",
    label: "Number of Units Transfused",
    remarksId: "numberOfUnitsTransfusedRemarks",
    isDynamicTable: "transfusion"
  },
  { id: "sumOfTimeTakenForBloodAndBloodComponents", label: "Sum of Time Taken for Blood and Blood Components (Minutes)" },
  {
    id: "numberOfUrinaryCatheterAssociatedUtisInThatMonth",
    label: "Number of Urinary Catheter Associated UTIs in That Month",
    remarksId: "numberOfUrinaryCatheterAssociatedUtisInThatMonthRemarks"
  },
  {
    id: "numberOfUrinaryCatheterDaysInThatMonth",
    label: "Number of Urinary Catheter Days in That Month",
    remarksId: "numberOfUrinaryCatheterDaysInThatMonthRemarks"
  },
  {
    id: "numberCentralLineAssociatedBloodStreamInfectionsInAMonth",
    label: "Number of Central Line Associated Blood Stream Infections in a Month",
    remarksId: "numberCentralLineAssociatedBloodStreamInfectionsInAMonthRemarks"
  },
  {
    id: "numberOfCentralLineDaysInThatMonth",
    label: "Number of Central Line Days in That Month",
    remarksId: "numberOfCentralLineDaysInThatMonthRemarks"
  },
  {
    id: "numberOfSurgicalSiteInfectionsInAGivenMonth",
    label: "Number of Surgical Site Infections in a Given Month",
    remarksId: "numberOfSurgicalSiteInfectionsInAGivenMonthRemarks"
  },
  { id: "totalNumberOfBloodAndBloodComponentsCrossMatchedOrReserved", label: "Total Number of Blood and Blood Components Cross-matched/Reserved" },
  {
    id: "numberOfNearMissReported",
    label: "Number of Near Miss Reported",
    remarksId: "numberOfNearMissReportedRemarks"
  },
  {
    id: "numberOfIncidentsReported",
    label: "Number of Incidents Reported",
    remarksId: "numberOfIncidentsReportedRemarks"
  },
  { id: "numberOfBedsOccupied", label: "Number of Beds Occupied" },
  { id: "numberOfNursingStaff", label: "Number of Nursing Staff" },
  { id: "totalNumberOfHandoversDoneAppropriately", label: "Total Number of Handovers Done Appropriately" },
  { id: "totalNumberOfHandoverOpportunities", label: "Total Number of Handover Opportunities" },
  {
    id: "numberOfRestraintInjuriesOrStrangulation",
    label: "Number of Restraint Injuries or Strangulation",
    remarksId: "numberOfRestraintInjuriesOrStrangulationRemarks"
  },
  {
    id: "totalNumberOfRestraintPatientsDays",
    label: "Total Number of Restraint Patient Days",
    remarksId: "totalNumberOfRestraintPatientsDaysRemarks"
  },
  { id: "numberOfPatientsOnIVTherapy", label: "Number of Patients on IV Therapy" },
  {
    id: "totalIVLineChanges",
    label: "Total IV Line Changes",
    remarksId: "ivLineChangeRemarks",
    isDynamicTable: "ivline"
  },
  {
    id: "totalNumberOfPatientWhoDevelopsphlebitisOrExtravasation",
    label: "Total Number of Patients Who Develop Phlebitis or Extravasation",
    remarksId: "totalNumberOfPatientWhoDevelopsphlebitisOrExtravasationRemarks"
  },
  {
    id: "numberOfParenteralExposures",
    label: "Number of Parenteral Exposures",
    remarksId: "numberOfParenteralExposuresRemarks"
  },
  {
    id: "incidentsOfDelining",
    label: "Incidents of Delining",
    remarksId: "incidentsOfDeliningRemarks"
  },
  {
    id: "numberOfPatientCatheter",
    label: "Number of Patients with Catheter",
    remarksId: "numberOfPatientCatheterRemarks"
  },
  {
    id: "numberOfPatientCentralLine",
    label: "Number of Patients with Central Line",
    remarksId: "numberOfPatientCentralLineRemarks"
  },
  {
    id: "numberOfRestrainedPatients",
    label: "Number of Restrained Patients",
    remarksId: "restrainedPatientsDetails",
    isDynamicTable: "restraint"
  }
];

export const getWardFieldsWithAbbreviation = () => {
  const fieldsCopy = [...BASE_WARD_FIELDS];
  fieldsCopy.splice(8, 0, {
    id: "numberMedicationChartsWithErrorPhoneAbbreviation",
    label: "Number of Medication Charts with Error (Phone Abbreviation)"
  });
  return fieldsCopy;
};

// ICU Ward Fields (MICU, NICU, SICU)
export const ICU_WARD_FIELDS = [
  { id: "sumOfTimeTakenforInitialAssessment", label: "Sum of Time Taken for Initial Assessment (Minutes)" },
  { id: "totalNumberOfAdmissions", label: "Total Number of Admissions" },
  { id: "numberOfPatientsDischargedInsurance", label: "Number of Patients Discharged (Insurance)" },
  { id: "sumOfTimeTakenForDischargeInsurance", label: "Sum of Time Taken for Discharge (Minutes) (Insurance)" },
  { id: "numberOfPatientsDischargedPay", label: "Number of Patients Discharged (Pay)" },
  { id: "sumOfTimeTakenForDischargePay", label: "Sum of Time Taken for Discharge (Minutes) (Pay)" },
  { id: "numberOfBedsOccupied", label: "Number of Beds Occupied" },
  { 
    id: "totalNumberOfMedicationErrors", 
    label: "Total Number of Medication Errors", 
    remarksId: "totalNumberOfMedicationErrorsRemarks" 
  },
  { id: "totalNumberOfOpportunitiesOfMedicationErrors", label: "Total Number of Opportunities of Medication Errors" },
  {
    id: "numberOfPatientsDevelopingAdverseDrugReactions",
    label: "Number of Patients Developing Adverse Drug Reactions",
    remarksId: "numberOfPatientsDevelopingAdverseDrugReactionsRemarks"
  },
  {
    id: "numberOfTransfusionReaction",
    label: "Number of Transfusion Reaction",
    remarksId: "numberOfTransfusionReactionRemarks"
  },
  {
    id: "numberOfUnitsTransfused",
    label: "Number of Units Transfused",
    remarksId: "numberOfUnitsTransfusedRemarks",
    isDynamicTable: "transfusion"
  },
  { id: "sumOfTimeTakenForBloodAndBloodComponents", label: "Sum of Time Taken for Blood and Blood Components (Minutes)" },
  { id: "totalNumberOfBloodAndBloodComponentsCrossMatchedOrReserved", label: "Total Number of Blood and Blood Components Cross-matched/Reserved" },
  {
    id: "numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcer",
    label: "Number of Patients Who Develop New or Worsening of Pressure Ulcer",
    remarksId: "numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcerRemarks"
  },
  {
    id: "numberOfUrinaryCatheterAssociatedUtisInThatMonth",
    label: "Number of Urinary Catheter Associated UTIs in That Month",
    remarksId: "numberOfUrinaryCatheterAssociatedUtisInThatMonthRemarks"
  },
  {
    id: "numberOfUrinaryCatheterDaysInThatMonth",
    label: "Number of Urinary Catheter Days in That Month",
    remarksId: "numberOfUrinaryCatheterDaysInThatMonthRemarks"
  },
  {
    id: "numberCentralLineAssociatedBloodStreamInfectionsInAMonth",
    label: "Number of Central Line Associated Blood Stream Infections in a Month",
    remarksId: "numberCentralLineAssociatedBloodStreamInfectionsInAMonthRemarks"
  },
  {
    id: "numberOfCentralLineDaysInThatMonth",
    label: "Number of Central Line Days in That Month",
    remarksId: "numberOfCentralLineDaysInThatMonthRemarks"
  },
  {
    id: "numberOfSurgicalSiteInfectionsInAGivenMonth",
    label: "Number of Surgical Site Infections in a Given Month",
    remarksId: "numberOfSurgicalSiteInfectionsInAGivenMonthRemarks"
  },
  { id: "numberOfNursingStaff", label: "Number of Nursing Staff" },
  {
    id: "numberOfPatientFalls",
    label: "Number of Patient Falls",
    remarksId: "numberOfPatientFallsRemarks"
  },
  {
    id: "numberOfNearMissReported",
    label: "Number of Near Miss Reported",
    remarksId: "numberOfNearMissReportedRemarks"
  },
  {
    id: "numberOfIncidentsReported",
    label: "Number of Incidents Reported",
    remarksId: "numberOfIncidentsReportedRemarks"
  },
  {
    id: "numberOfParenteralExposures",
    label: "Number of Parenteral Exposures",
    remarksId: "numberOfParenteralExposuresRemarks"
  },
  { id: "totalNumberOfHandoversDoneAppropriately", label: "Total Number of Handovers Done Appropriately" },
  { id: "totalNumberOfHandoverOpportunities", label: "Total Number of Handover Opportunities" },
  {
    id: "totalNumberOfPatientsDevelopingPhlebitis",
    label: "Total Number of Patients Who Develop Phlebitis or Extravasation",
    remarksId: "totalNumberOfPatientsDevelopingPhlebitisRemarks"
  },
  {
    id: "numberOfRestraintInjuriesOrStrangulation",
    label: "Number of Restraint Injuries or Strangulation",
    remarksId: "numberOfRestraintInjuriesOrStrangulationRemarks"
  },
  {
    id: "totalNumberOfRestraintPatientsDays",
    label: "Total Number of Restraint Patient Days",
    remarksId: "totalNumberOfRestraintPatientsDaysRemarks"
  },
  { id: "numberOfPatientsOnIVTherapy", label: "Number of Patients on IV Therapy" },
  {
    id: "totalIVLineChanges",
    label: "Total IV Line Changes",
    remarksId: "ivLineChangeRemarks",
    isDynamicTable: "ivline"
  },
  {
    id: "incidentsOfDelining",
    label: "Incidents of Delining",
    remarksId: "incidentsOfDeliningRemarks"
  },
  {
    id: "numberOfPatientCatheter",
    label: "Number of Patients with Catheter",
    remarksId: "numberOfPatientCatheterRemarks"
  },
  {
    id: "numberOfPatientCentralLine",
    label: "Number of Patients with Central Line",
    remarksId: "numberOfPatientCentralLineRemarks"
  },
  {
    id: "numberOfVentilatorAssociatedPneumonia",
    label: "Number of Ventilator Associated Pneumonia (VAP) in a Month",
    remarksId: "numberOfVentilatorAssociatedPneumoniaRemarks"
  },
  {
    id: "numberOfVentilatorDays",
    label: "Number of Ventilator Days in That Month",
    remarksId: "numberOfVentilatorDaysRemarks"
  },
  {
    id: "numberOfPatientVentilator",
    label: "Number of Patients in Ventilator (new)",
    remarksId: "numberOfPatientVentilatorRemarks"
  },
  {
    id: "numberOfRestrainedPatients",
    label: "Number of Restrained Patients",
    remarksId: "restrainedPatientsDetails",
    isDynamicTable: "restraint"
  }
];

// Recovery Ward Fields
export const RECOVERY_WARD_FIELDS = [
  { id: "sumofTimeTakenforInitialAssessment", label: "Sum of Time Taken for Initial Assessment (Minutes)" },
  { id: "totalNumberOfAdmissions", label: "Total Number of Admissions" },
  { id: "numberOfBedsOccupied", label: "Number of Beds Occupied" },
  { 
    id: "totalNumberOfMedicationErrors", 
    label: "Total Number of Medication Errors", 
    remarksId: "totalNumberOfMedicationErrorsRemarks" 
  },
  {
    id: "numberOfPatientsDevelopingAdverseDrugReactions",
    label: "Number of Patients Developing Adverse Drug Reactions",
    remarksId: "numberOfPatientsDevelopingAdverseDrugReactionsRemarks"
  },
  { id: "numberOfNursingStaff", label: "Number of Nursing Staff" },
  {
    id: "numberOfPatientFalls",
    label: "Number of Patient Falls",
    remarksId: "numberOfPatientFallsRemarks"
  },
  {
    id: "numberOfUnitsTransfused",
    label: "Number of Units Transfused",
    remarksId: "numberOfUnitsTransfusedRemarks",
    isDynamicTable: "transfusion"
  },
  {
    id: "numberOfTransfusionReaction",
    label: "Number of Transfusion Reaction",
    remarksId: "numberOfTransfusionReactionRemarks"
  },
  { id: "totalNumberOfBloodAndBloodComponentsCrossMatchedOrReserved", label: "Total Number of Blood and Blood Components Cross-matched/Reserved" },
  { id: "sumOfTimeTakenForBloodAndBloodComponents", label: "Sum of Time Taken for Blood and Blood Components (Minutes)" },
  {
    id: "numberOfCentralLineDaysInThatMonth",
    label: "Number of Central Line Days in That Month",
    remarksId: "numberOfCentralLineDaysInThatMonthRemarks"
  },
  {
    id: "numberOfNearMissReported",
    label: "Number of Near Miss Reported",
    remarksId: "numberOfNearMissReportedRemarks"
  },
  {
    id: "numberOfIncidentsReported",
    label: "Number of Incidents Reported"
  },
  {
    id: "numberOfParenteralExposures",
    label: "Number of Parenteral Exposures",
    remarksId: "numberOfParenteralExposuresRemarks"
  },
  { id: "totalNumberOfHandoversDoneAppropriately", label: "Total Number of Handovers Done Appropriately" },
  { id: "totalNumberOfHandoverOpportunities", label: "Total Number of Handover Opportunities" },
  {
    id: "totalNumberOfPatientsDevelopingPhlebitis",
    label: "Total Number of Patients Who Develop Phlebitis or Extravasation"
  },
  {
    id: "numberOfRestraintInjuriesOrStrangulation",
    label: "Number of Restraint Injuries or Strangulation"
  }
];

// Chemo Ward Fields
export const CHEMO_WARD_FIELDS = [
  { id: "sumOfTimeTakenforInitialAssessment", label: "Sum of Time Taken for Initial Assessment (Minutes)" },
  { id: "totalNumberOfAdmissions", label: "Total Number of Admissions" },
  { id: "numberOfBedsOccupied", label: "Number of Beds Occupied" },
  { id: "numberOfPatientsDischargedInsurance", label: "Number of Patients Discharged (Insurance)" },
  { id: "sumOfTimeTakenForDischargeInsurance", label: "Sum of Time Taken for Discharge (Minutes) (Insurance)" },
  { id: "numberOfPatientsDischargedPay", label: "Number of Patients Discharged (Pay)" },
  { id: "sumOfTimeTakenForDischargePay", label: "Sum of Time Taken for Discharge (Minutes) (Pay)" },
  { 
    id: "totalNumberOfMedicationErrors", 
    label: "Total Number of Medication Errors", 
    remarksId: "totalNumberOfMedicationErrorsRemarks" 
  },
  { id: "totalNumberOfOpportunitiesOfMedicationErrors", label: "Total Number of Opportunities of Medication Errors" },
  { id: "numberOfMedicationChartsReviewed", label: "Number of Medication Charts Reviewed" },
  {
    id: "numberOfPatientsDevelopingAdverseDrugReactions",
    label: "Number of Patients Developing Adverse Drug Reactions",
    remarksId: "numberOfPatientsDevelopingAdverseDrugReactionsRemarks"
  },
  {
    id: "numberOfUnitsTransfused",
    label: "Number of Units Transfused",
    remarksId: "numberOfUnitsTransfusedRemarks",
    isDynamicTable: "transfusion"
  },
  {
    id: "numberOfTransfusionReaction",
    label: "Number of Transfusion Reaction",
    remarksId: "numberOfTransfusionReactionRemarks"
  },
  { id: "sumOfTimeTakenForBloodAndBloodComponents", label: "Sum of Time Taken for Blood and Blood Components (Minutes)" },
  { id: "totalNumberOfBloodAndBloodComponentsCrossMatchedOrReserved", label: "Total Number of Blood and Blood Components Cross-matched/Reserved" },
  {
    id: "numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcer",
    label: "Number of Patients Who Develop New or Worsening of Pressure Ulcer",
    remarksId: "numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcerRemarks"
  },
  {
    id: "numberOfUrinaryCatheterAssociatedUtisInThatMonth",
    label: "Number of Urinary Catheter Associated UTIs in That Month",
    remarksId: "numberOfUrinaryCatheterAssociatedUtisInThatMonthRemarks"
  },
  {
    id: "numberOfUrinaryCatheterDaysInThatMonth",
    label: "Number of Urinary Catheter Days in That Month",
    remarksId: "numberOfUrinaryCatheterDaysInThatMonthRemarks"
  },
  {
    id: "numberCentralLineAssociatedBloodStreamInfectionsInAMonth",
    label: "Number of Central Line Associated Blood Stream Infections in a Month",
    remarksId: "numberCentralLineAssociatedBloodStreamInfectionsInAMonthRemarks"
  },
  {
    id: "numberOfCentralLineDaysInThatMonth",
    label: "Number of Central Line Days in That Month",
    remarksId: "numberOfCentralLineDaysInThatMonthRemarks"
  },
  {
    id: "numberOfPatientCatheter",
    label: "Number of Patients with Catheter",
    remarksId: "numberOfPatientCatheterRemarks"
  },
  {
    id: "numberOfPatientCentralLine",
    label: "Number of Patients with Central Line",
    remarksId: "numberOfPatientCentralLineRemarks"
  },
  {
    id: "numberOfSurgicalSiteInfectionsInAGivenMonth",
    label: "Number of Surgical Site Infections in a Given Month",
    remarksId: "numberOfSurgicalSiteInfectionsInAGivenMonthRemarks"
  },
  { id: "numberOfNursingStaff", label: "Number of Nursing Staff" },
  {
    id: "numberOfPatientFalls",
    label: "Number of Patient Falls",
    remarksId: "numberOfPatientFallsRemarks"
  },
  {
    id: "numberOfNearMissReported",
    label: "Number of Near Miss Reported",
    remarksId: "numberOfNearMissReportedRemarks"
  },
  {
    id: "numberOfIncidentsReported",
    label: "Number of Incidents Reported",
    remarksId: "numberOfIncidentsReportedRemarks"
  },
  {
    id: "numberOfParenteralExposures",
    label: "Number of Parenteral Exposures",
    remarksId: "numberOfParenteralExposuresRemarks"
  },
  { id: "totalNumberOfHandoversDoneAppropriately", label: "Total Number of Handovers Done Appropriately" },
  { id: "totalNumberOfHandoverOpportunities", label: "Total Number of Handover Opportunities" },
  {
    id: "totalNumberOfPatientsDevelopingPhlebitis",
    label: "Total Number of Patients Who Develop Phlebitis or Extravasation",
    remarksId: "totalnumberOfPatientsDevelopingPhlebitisRemarks"
  },
  {
    id: "numberOfRestraintInjuriesOrStrangulation",
    label: "Number of Restraint Injuries or Strangulation",
    remarksId: "numberOfRestraintInjuriesOrStrangulationRemarks"
  },
  {
    id: "totalNumberOfRestraintPatientsDays",
    label: "Total Number of Restraint Patient Days",
    remarksId: "totalNumberOfRestraintPatientsDaysRemarks"
  },
  { id: "numberOfPatientsOnIVTherapy", label: "Number of Patients on IV Therapy" },
  {
    id: "totalIVLineChanges",
    label: "Total IV Line Changes",
    remarksId: "ivLineChangeRemarks",
    isDynamicTable: "ivline"
  },
  {
    id: "incidentsOfDelining",
    label: "Incidents of Delining",
    remarksId: "incidentsOfDeliningRemarks"
  }
];

// OT Ward Fields
export const OT_WARD_FIELDS = [
  {
    id: "numberOfUnplannedReturnToOTOrReexploration",
    label: "Number of Unplanned Return to OT or Re-exploration",
    remarksId: "numberOfUnplannedReturnToOTOrReexplorationRemarks"
  },
  { id: "numberOfPatientsWhoUnderwentSurgeriesInTheOT", label: "Number of Patients Who Underwent Surgeries in the OT" },
  { id: "numberOfSurgeriesWhereTheProcedureWasFollowed", label: "Number of Surgeries Where the Procedure Was Followed" },
  { id: "numberOfSurgeriesPlannedInTheOt", label: "Number of Surgeries Planned in the OT" },
  {
    id: "numberOfTransfusionReactions",
    label: "Number of Transfusion Reactions",
    remarksId: "numberOfTransfusionReactionsRemarks"
  },
  {
    id: "numberOfUnitsTransfused",
    label: "Number of Units Transfused",
    remarksId: "numberOfUnitsTransfusedRemarks",
    isDynamicTable: "transfusion"
  },
  { id: "timeTakenForReceivingBloodFromBloodBank", label: "Time Taken for Receiving Blood From Blood Bank (Minutes)" },
  { id: "numberOfPatientsWhoDidReceiveAppropriateProphylacticAntibiotic", label: "Number of Patients Who Did Receive Appropriate Prophylactic Antibiotic" },
  {
    id: "numberOfCasesReScheduledOrCanceled",
    label: "Number of Cases Re-scheduled or Canceled",
    remarksId: "numberOfCasesReScheduledOrCanceledRemarks"
  },
  { id: "numberOfSurgicalSiteInfections", label: "Number of Surgical Site Infections" },
  { id: "numberOfSurgeriesWhereProceduresWereFollowed", label: "Number of Surgeries Where Procedures Were Followed" },
  { id: "numberOfDayCareOPCases", label: "Number of Day Care OP Cases" },
  { id: "numberOfDayCareIPCases", label: "Number of Day Care IP Cases" },
  { id: "numberOfMinorCases", label: "Number of Minor Cases" },
  { id: "numberOfMajorCases", label: "Number of Major Cases" },
  {
    id: "numberOfParenteralExposures",
    label: "Number of Parenteral Exposures",
    remarksId: "numberOfParenteralExposuresRemarks"
  },
  { id: "numberOfNursingStaff", label: "Number of Nursing Staff" }
];

// Basic Outpatient Fields (Dialysis, Physiotherapy)
export const BASIC_OUTPATIENT_FIELDS = [
  { id: "numberOfInPatients", label: "Number of In-Patients" },
  { id: "numberOfOutPatients", label: "Number of Out-Patients" },
  { id: "totalCases", label: "Total Cases" }
];

// Diagnostic Ward Fields (MRI, CT, X-Ray)
export const DIAGNOSTIC_WARD_FIELDS = [
  {
    id: "numberOfReportingErrors",
    label: "Number of Reporting Errors",
    remarksId: "numberOfReportingErrorsRemarks"
  },
  { id: "numberOfCasePerformed", label: "Number of Cases Performed" },
  { id: "numberOfTestsPerformed", label: "Number of Tests Performed" },
  { id: "numberOfStaffAdheringToSafety", label: "Number of Staff Adhering to Safety" },
  { id: "numberOfStaffAudited", label: "Number of Staff Audited" },
  { id: "waitingTimeForDiagnostics", label: "Waiting Time for Diagnostics (Minutes)" },
  { id: "numberOfPatientsReportedInDiagnostics", label: "Number of Patients Reported in Diagnostics" }
];

// Emergency Room Fields
export const EMERGENCY_ROOM_FIELDS = [
  { id: "sumOfTimeTakenforInitialAssessment", label: "Sum of Time Taken for Initial Assessment (Minutes)" },
  {
    id: "numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaints",
    label: "Number of Returns to Emergency Within 72 Hours With Similar Presenting Complaints",
    remarksId: "numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaintsRemarks"
  },
  { id: "numberOfPatientsWhoHaveComeToTheEmergency", label: "Number of Patients Who Have Come to the Emergency" },
  {
    id: "numberOfParenteralExposures",
    label: "Number of Parenteral Exposures",
    remarksId: "numberOfParenteralExposuresRemarks"
  },
  {
    id: "numberOfIncidents",
    label: "Number of Incidents",
    remarksId: "numberOfIncidentsRemarks"
  }
];

// Pharmacy Ward Fields
export const PHARMACY_WARD_FIELDS = [
  {
    id: "numberOfStockOutEmergencyDrugs",
    label: "Number of Stock Out Emergency Drugs",
    remarksId: "numberOfStockOutEmergencyDrugsRemarks"
  },
  {
    id: "totalNumberOfSafeAndRationalPrescriptions",
    label: "Total Number of Safe and Rational Prescriptions",
    remarksId: "totalNumberOfSafeAndRationalPrescriptionsRemarks"
  },
  {
    id: "totalNumberOfPrescriptionsAudited",
    label: "Total Number of Prescriptions Audited",
    remarksId: "totalNumberOfPrescriptionsAuditedRemarks"
  },
  {
    id: "totalNumberOfPrescriptionInCapitalLetters",
    label: "Total Number of Prescription in Capital Letters",
    remarksId: "totalNumberOfPrescriptionInCapitalLettersRemarks"
  },
  {
    id: "totalNumberOfPrescriptions",
    label: "Total Number of Prescriptions",
    remarksId: "totalNumberOfPrescriptionsRemarks"
  },
  {
    id: "totalNumberOfMedicationErrors",
    label: "Total Number of Medication Errors",
    remarksId: "totalNumberOfMedicationErrorsRemarks"
  },
  {
    id: "totalNumberOfOpportunitiesOfMedicationErrors",
    label: "Total Number of Opportunities of Medication Errors",
    remarksId: "totalNumberOfOpportunitiesOfMedicationErrorsRemarks"
  },
  {
    id: "numberOfPatientsDevelopingAdverseDrugReactions",
    label: "Number of Patients Developing Adverse Drug Reactions",
    remarksId: "numberOfPatientsDevelopingAdverseDrugReactionsRemarks"
  },
  {
    id: "numberOfInPatients",
    label: "Number of In-Patients",
    remarksId: "numberOfInPatientsRemarks"
  }
];

// Mock Drills Fields
export const MOCK_DRILLS_FIELDS = [
  { id: "totalNumberOfVariationsObservedInMockDrill", label: "Total Number of Variations Observed in Mock Drill" }
];

// OPD Fields
export const OPD_FIELDS = [
  { id: "sumOfTimeTakenforInitialAssessment", label: "Sum of Time Taken for Initial Assessment (Minutes)" },
  { id: "sumOfTimeTakenForConsultation", label: "Sum of Time Taken for Consultation (Minutes)" },
  { id: "totalNumberOfOutPatients", label: "Total Number of Out-Patients" }
];

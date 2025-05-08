import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import "./Formula.css";

const EmergencyRoomData = () => {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [rawResponseObject, setRawResponseObject] = useState(null);

  const fetchData = async () => {
    if (!selectedDate) return;

    const year = format(selectedDate, "yyyy");
    const month = format(selectedDate, "MM");

    setLoading(true);
    setError(null);
    setNoDataFound(false);
    setData(null);
    setApiResponse(null);
    setRawResponseObject(null);

    try {
      console.log(`Fetching data for ${month}/${year}...`);

      const apiUrl = "https://indicators.shinovadatabase.in/formula-data/";
      const params = { year, month };
      console.log(`API URL: ${apiUrl}`);
      console.log(`Parameters:`, params);

      const response = await axios.get(apiUrl, { params });

      setRawResponseObject(response);
      setApiResponse(response.data);
      console.log(`Full API Response:`, response);
      console.log(`API Response Data:`, response.data);

      let allData = [];

      if (Array.isArray(response.data)) {
        allData = response.data;
      } else if (response.data && typeof response.data === "object") {
        Object.keys(response.data).forEach((key) => {
          const dataArray = response.data[key];
          if (Array.isArray(dataArray)) {
            allData = [...allData, ...dataArray];
          }
        });
      }

      if (allData.length === 0) {
        setNoDataFound(true);
        setLoading(false);
        return;
      }

      let totalSumOfTime = 0;
      let totalAdmissions = 0;
      let validRecords = 0;
      let zeroRecords = 0;
      let totalReportingErrors = 0;
      let totalTestsPerformed = 0;
      let totalStaffAdhering = 0;
      let totalStaffAudited = 0;
      let totalMedicationErrors = 0;
      let totalOpportunityMedicationErrors = 0;
      let totalMedicationChartsWithErrorProneAbbreviation = 0;
      let totalMedicationChartsReviewed = 0;
      let totalAdverseDrug = 0;
      let totalInpatients = 0;
      let totalUplannedOT = 0;
      let totalUnderwentSurgery = 0;
      let totalSurgeryProcedureFollowed = 0;
      let totalTransusionReaction = 0;
      let totalUnitsTransfused = 0;
      let totalActualDeath = 0;
      let totalPredictedDeath = 0;
      let totalreturnsToEmergency = 0;
      let totalpatientsToEmergency = 0;
      let totalPressureUlcer = 0;
      let totalCatheterInMonth = 0;
      let totalCatheterDaysInMonth = 0;
      let totalVentilatorPneumonia = 0;
      let totalVentilatorDaysInMonth = 0;
      let totalCentrallineBloodStreamInfectionInMonth = 0;
      let totalCentrallineDaysInMonth = 0;
      let totalSurgicalsiteInfectionInAMonth = 0;
      let totalProphylacticAntibiotics = 0;
      let totalSurgeriesRescheduled = 0;
      let totalSurgeriesPlanned = 0;
      let totalBBCCrossMatched = 0;
      let totalSumOfTimeBBC = 0;
      let totalBedsOccupied = 0;
      let totalNursingStaff = 0;
      let totalOPConsultationTime = 0;
      let totalOP = 0;
      let totalDiagnosticsWaitingTime = 0;
      let totalDiagnosticsPatients = 0;
      let totalDischargeTime = 0;
      let totalDischargePatients = 0;
      let totalPatientFalls = 0;
      let totalNearMissReported = 0;
      let totalIncidentsReported = 0;
      let totalParenteralExposures = 0;
      let totalHandoverDone = 0;
      let totalHandoverOpportunity = 0;
      let totalStockOutEmergencyDrugs = 0;
      let totalNumberOfVariationsObservedInMockDrill = 0;
      let totalPrescriptionInCapitalLetters = 0;
      let totalNumberOfPrescriptions = 0;
      let totalNumberOfActionsPerformed = 0;
      let totalNumberOfHandHygieneOpportunities = 0;
      let totalNumberOfMedicalRecords = 0;
      let totalNumberOfDischargeAndDeath = 0;

      let recordDetails = [];

      allData.forEach((item) => {
        let includeRecord = true;

        if (item.selectedDate) {
          try {
            const itemDate = new Date(item.selectedDate);
            const itemYear = itemDate.getFullYear().toString();
            const itemMonth = (itemDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            includeRecord = itemYear === year && itemMonth === month;

            if (!includeRecord) {
              console.log(
                `Skipping record with date ${item.selectedDate} - not matching ${month}/${year}`
              );
            }
          } catch (e) {
            console.error(`Error parsing date ${item.selectedDate}:`, e);
            includeRecord = false;
          }
        }

        if (!includeRecord) return;

        const time = parseFloat(item.sumOfTimeTakenforInitialAssessment);
        const admissions = parseFloat(item.totalNumberOfAdmissions);
        const errors = parseFloat(item.numberOfReportingErrors);
        const tests = parseFloat(item.numberOfTestsPerformed);
        const adhering = parseFloat(item.numberOfStaffAdheringToSafety);
        const audited = parseFloat(item.numberOfStaffAudited);
        const medication = parseFloat(item.totalNumberOfMedicationErrors);
        const opportunity = parseFloat(
          item.totalNumberOfOpportunitiesOfMedicationErrors
        );

        const MedicationChartsWithErrorProneAbbreviation = parseFloat(
          item.numberOfMedicationChartsWithErrorProneAbbreviation
        );
        const MedicationChartsReviewed = parseFloat(
          item.numberOfMedicationChartsReviewed
        );
        const adversedrug = parseFloat(
          item.numberOfPatientsDevelopingAdverseDrugReactions
        );
        const inPatients = parseFloat(item.numberOfInPatients);
        const unplannedOT = parseFloat(
          item.numberOfUnplannedReturnToOTOrReexploration
        );
        const underwentSurgery = parseFloat(
          item.numberOfPatientsWhoUnderwentSurgeriesInTheOT
        );
        const surgicalProcedured = parseFloat(
          item.numberOfSurgeriesWhereProceduresWereFollowed
        );
        const transfusionReaction = parseFloat(
          item.numberOfTransfusionReactions
        );
        const unitsTransfused = parseFloat(item.numberOfUnitsTransfused);
        const actualDeath = parseFloat(item.actualDeathsInICU);
        const predictedDeath = parseFloat(item.predictedDeathsInICU);
        const returnsToEmergency = parseFloat(
          item.numberOfReturnsToEmergencyWithin72hoursWithSimilarPresentingComplaints
        );
        const patientToEmergency = parseFloat(
          item.numberOfPatientsWhoHaveComeToTheEmergency
        );
        const pressureUlcer = parseFloat(
          item.numberOfPatientsWhoDevelopNewOrWorseningOfPressureUlcer
        );
        const catheterInMonth = parseFloat(
          item.numberOfUrinaryCatheterAssociatedUtisInThatMonth
        );
        const catheterDaysInMonth = parseFloat(
          item.numberOfUrinaryCatheterDaysInThatMonth
        );
        const ventilatorPneumonia = parseFloat(
          item.numberOfVentilatorAssociatedPneumonia
        );
        const ventilatorDaysInMonth = parseFloat(item.numberOfVentilatorDays);
        const CentrallineBloodStreamInfectionInMonth = parseFloat(
          item.numberCentralLineAssociatedBloodStreamInfectionsInAMonth
        );
        const CentrallineDaysInMonth = parseFloat(
          item.numberOfCentralLineDaysInThatMonth
        );
        const SurgicalsiteInfectionInAMonth = parseFloat(
          item.numberOfSurgicalSiteInfectionsInAGivenMonth
        );
        const ProphylacticAntibiotics = parseFloat(
          item.numberOfPatientsWhoDidReceiveAppropriateProphylacticAntibiotic
        );
        const SurgeriesRescheduled = parseFloat(
          item.numberOfCasesReScheduledOrCanceled
        );
        const SurgeriesPlanned = parseFloat(
          item.numberOfSurgeriesPlannedInTheOt
        );

        const BBCCrossMatched = parseFloat(item.numberOfBedsOccupied);
        const SumOfTimeBBC = parseFloat(
          item.sumOfTimeTakenForBloodAndBloodComponents
        );

        const BedsOccupied = parseFloat(item.numberOfBedsOccupied);
        const NursingStaff = parseFloat(item.numberOfNursingStaff);

        const OPConsultationTime = parseFloat(
          item.sumOfTimeTakenForConsultation
        );
        const OP = parseFloat(item.totalNumberOfOutPatients);

        const DiagnosticsWaitingTime = parseFloat(
          item.waitingTimeForDiagnostics
        );

        const DiagnosticsPatients = parseFloat(
          item.numberOfPatientsReportedInDiagnostics
        );

        const DischargeTime =
          parseFloat(item.sumOfTimeTakenForDischargeInsurance || 0) +
          parseFloat(item.sumOfTimeTakenForDischargePay || 0);

        const DischargePatients =
          parseFloat(item.numberOfPatientsDischargedInsurance || 0) +
          parseFloat(item.numberOfPatientsDischargedPay || 0);

        const PatientFalls = parseFloat(item.numberOfPatientFalls);

        const NearMissReported = parseFloat(item.numberOfNearMissReported);

        const IncidentsReported = parseFloat(item.numberOfIncidentsReported);
        const ParenteralExposures = parseFloat(
          item.numberOfParenteralExposures
        );

        const HandoverDone = parseFloat(
          item.totalNumberOfHandoversDoneAppropriately
        );
        const Handoveropportunity = parseFloat(
          item.totalNumberOfHandoverOpportunities
        );

        const StockOutEmergencyDrugs = parseFloat(
          item.numberOfStockOutEmergencyDrugs
        );

        const NumberOfVariationsObservedInMockDrill = parseFloat(
          item.totalNumberOfVariationsObservedInMockDrill
        );

        const PrescriptionInCapitalLetters = parseFloat(
          item.totalNumberOfPrescriptionInCapitalLetters
        );

        const NumberOfPrescriptions = parseFloat(
          item.totalNumberOfPrescriptions
        );

        const NumberOfActionsPerformed = parseFloat(
          item.totalNumberOfActionsPerformed
        );

        const NumberOfHandHygieneOpportunities = parseFloat(
          item.totalNumberOfHandHygieneOpportunities
        );

        const NumberOfMedicalRecords = parseFloat(item.numberOfMedicalRecords);

        const NumberOfDischargeAndDeath =
          parseFloat(item.numberOfDischarge || 0) +
          parseFloat(item.numberOfDeath || 0);

        if (!isNaN(time) && !isNaN(admissions)) {
          if (time === 0 || admissions === 0) {
            zeroRecords++;
          } else {
            totalSumOfTime += time;
            totalAdmissions += admissions;
            validRecords++;
          }
        }

        if (!isNaN(errors)) totalReportingErrors += errors;
        if (!isNaN(tests)) totalTestsPerformed += tests;
        if (!isNaN(adhering)) totalStaffAdhering += adhering;
        if (!isNaN(audited)) totalStaffAudited += audited;
        if (!isNaN(medication)) totalMedicationErrors += medication;
        if (!isNaN(opportunity))
          totalOpportunityMedicationErrors += opportunity;
        if (!isNaN(MedicationChartsWithErrorProneAbbreviation))
          totalMedicationChartsWithErrorProneAbbreviation +=
            MedicationChartsWithErrorProneAbbreviation;
        if (!isNaN(MedicationChartsReviewed))
          totalMedicationChartsReviewed += MedicationChartsReviewed;
        if (!isNaN(adversedrug)) totalAdverseDrug += adversedrug;
        if (!isNaN(inPatients)) totalInpatients += inPatients;
        if (!isNaN(unplannedOT)) totalUplannedOT += unplannedOT;
        if (!isNaN(underwentSurgery)) totalUnderwentSurgery += underwentSurgery;
        if (!isNaN(surgicalProcedured))
          totalSurgeryProcedureFollowed += surgicalProcedured;
        if (!isNaN(transfusionReaction))
          totalTransusionReaction += transfusionReaction;
        if (!isNaN(unitsTransfused)) totalUnitsTransfused += unitsTransfused;
        if (!isNaN(actualDeath)) totalActualDeath += actualDeath;
        if (!isNaN(predictedDeath)) totalPredictedDeath += predictedDeath;
        if (!isNaN(returnsToEmergency))
          totalreturnsToEmergency += returnsToEmergency;
        if (!isNaN(patientToEmergency))
          totalpatientsToEmergency += patientToEmergency;
        if (!isNaN(pressureUlcer)) totalPressureUlcer += pressureUlcer;
        if (!isNaN(catheterInMonth)) totalCatheterInMonth += catheterInMonth;
        if (!isNaN(catheterDaysInMonth))
          totalCatheterDaysInMonth += catheterDaysInMonth;
        if (!isNaN(ventilatorPneumonia))
          totalVentilatorPneumonia += ventilatorPneumonia;
        if (!isNaN(ventilatorDaysInMonth))
          totalVentilatorDaysInMonth += ventilatorDaysInMonth;
        if (!isNaN(CentrallineBloodStreamInfectionInMonth))
          totalCentrallineBloodStreamInfectionInMonth +=
            CentrallineBloodStreamInfectionInMonth;
        if (!isNaN(CentrallineDaysInMonth))
          totalCentrallineDaysInMonth += CentrallineDaysInMonth;
        if (!isNaN(SurgicalsiteInfectionInAMonth))
          totalSurgicalsiteInfectionInAMonth += SurgicalsiteInfectionInAMonth;
        if (!isNaN(ProphylacticAntibiotics))
          totalProphylacticAntibiotics += ProphylacticAntibiotics;
        if (!isNaN(SurgeriesRescheduled))
          totalSurgeriesRescheduled += SurgeriesRescheduled;
        if (!isNaN(SurgeriesPlanned)) totalSurgeriesPlanned += SurgeriesPlanned;
        if (!isNaN(BBCCrossMatched)) totalBBCCrossMatched += BBCCrossMatched;
        if (!isNaN(SumOfTimeBBC)) totalSumOfTimeBBC += SumOfTimeBBC;
        if (!isNaN(BedsOccupied)) totalBedsOccupied += BedsOccupied;
        if (!isNaN(NursingStaff)) totalNursingStaff += NursingStaff;
        if (!isNaN(OPConsultationTime))
          totalOPConsultationTime += OPConsultationTime;
        if (!isNaN(OP)) totalOP += OP;
        if (!isNaN(DiagnosticsWaitingTime))
          totalDiagnosticsWaitingTime += DiagnosticsWaitingTime;
        if (!isNaN(DiagnosticsPatients))
          totalDiagnosticsPatients += DiagnosticsPatients;
        if (!isNaN(DischargeTime)) totalDischargeTime += DischargeTime;
        if (!isNaN(DischargePatients))
          totalDischargePatients += DischargePatients;
        if (!isNaN(PatientFalls)) totalPatientFalls += PatientFalls;

        if (!isNaN(NearMissReported)) totalNearMissReported += NearMissReported;
        if (!isNaN(IncidentsReported))
          totalIncidentsReported += IncidentsReported;
        if (!isNaN(ParenteralExposures))
          totalParenteralExposures += ParenteralExposures;
        if (!isNaN(HandoverDone)) totalHandoverDone += HandoverDone;
        if (!isNaN(Handoveropportunity))
          totalHandoverOpportunity += Handoveropportunity;
        if (!isNaN(StockOutEmergencyDrugs))
          totalStockOutEmergencyDrugs += StockOutEmergencyDrugs;
        if (!isNaN(NumberOfVariationsObservedInMockDrill))
          totalNumberOfVariationsObservedInMockDrill +=
            NumberOfVariationsObservedInMockDrill;

        if (!isNaN(PrescriptionInCapitalLetters))
          totalPrescriptionInCapitalLetters += PrescriptionInCapitalLetters;
        if (!isNaN(NumberOfPrescriptions))
          totalNumberOfPrescriptions += NumberOfPrescriptions;

        if (!isNaN(NumberOfActionsPerformed))
          totalNumberOfActionsPerformed += NumberOfActionsPerformed;
        if (!isNaN(NumberOfHandHygieneOpportunities))
          totalNumberOfHandHygieneOpportunities +=
            NumberOfHandHygieneOpportunities;

        if (!isNaN(NumberOfMedicalRecords))
          totalNumberOfMedicalRecords += NumberOfMedicalRecords;
        if (!isNaN(NumberOfDischargeAndDeath))
          totalNumberOfDischargeAndDeath += NumberOfDischargeAndDeath;

        recordDetails.push({
          id: item.id,
          name: item.name,
          ward: item.ward,
          date: item.selectedDate,
          time,
          admissions,
          errors,
          tests,
          used:
            !isNaN(time) && !isNaN(admissions) && time > 0 && admissions > 0,
        });
      });

      const averageTime =
        totalAdmissions > 0
          ? (totalSumOfTime / totalAdmissions).toFixed(2)
          : "0.00";

      const errorRate =
        totalTestsPerformed > 0
          ? ((totalReportingErrors / totalTestsPerformed) * 1000).toFixed(2)
          : "0.00";

      const adherenceRate =
        totalStaffAudited > 0
          ? ((totalStaffAdhering / totalStaffAudited) * 100).toFixed(2)
          : "0.00";

      const medicationError =
        totalOpportunityMedicationErrors > 0
          ? (
              (totalMedicationErrors / totalOpportunityMedicationErrors) *
              100
            ).toFixed(2)
          : "0.00";
      const medicationChartError =
        totalMedicationChartsReviewed > 0
          ? (
              (totalMedicationChartsWithErrorProneAbbreviation /
                totalMedicationChartsReviewed) *
              100
            ).toFixed(2)
          : "0.00";

      const adversedrugrate =
        totalInpatients > 0
          ? ((totalAdverseDrug / totalInpatients) * 100).toFixed(2)
          : "0.00";

      const unplannedOTRate =
        totalUnderwentSurgery > 0
          ? ((totalUplannedOT / totalUnderwentSurgery) * 100).toFixed(2)
          : "0.00";

      const correctsurgery =
        totalUnderwentSurgery > 0
          ? (
              (totalSurgeryProcedureFollowed / totalUnderwentSurgery) *
              100
            ).toFixed(2)
          : "0.00";
      const transfusionRate =
        totalUnitsTransfused > 0
          ? ((totalTransusionReaction / totalUnitsTransfused) * 100).toFixed(2)
          : "0.00";
      const StandMortalityRate =
        totalPredictedDeath > 0
          ? ((totalActualDeath / totalPredictedDeath) * 100).toFixed(2)
          : "0.00";
      const EmergencyPatientRate =
        totalpatientsToEmergency > 0
          ? (
              (totalreturnsToEmergency / totalpatientsToEmergency) *
              100
            ).toFixed(2)
          : "0.00";
      const PressureUlcerRate =
        totalInpatients > 0
          ? ((totalPressureUlcer / totalInpatients) * 100).toFixed(2)
          : "0.00";
      const UTIRate =
        totalCatheterDaysInMonth > 0
          ? ((totalCatheterInMonth / totalCatheterDaysInMonth) * 100).toFixed(2)
          : "0.00";
      const PneumoniaRate =
        totalVentilatorDaysInMonth > 0
          ? (
              (totalVentilatorPneumonia / totalVentilatorDaysInMonth) *
              100
            ).toFixed(2)
          : "0.00";
      const CentrallineInfectionRate =
        totalCentrallineDaysInMonth > 0
          ? (
              (totalCentrallineBloodStreamInfectionInMonth /
                totalCentrallineDaysInMonth) *
              100
            ).toFixed(2)
          : "0.00";
      const SurgicalsiteInfectionRate =
        totalUnderwentSurgery > 0
          ? (
              (totalSurgicalsiteInfectionInAMonth / totalUnderwentSurgery) *
              100
            ).toFixed(2)
          : "0.00";
      const ProphylacticRate =
        totalUnderwentSurgery > 0
          ? (
              (totalProphylacticAntibiotics / totalUnderwentSurgery) *
              100
            ).toFixed(2)
          : "0.00";
      const SurgeryRescheduledRate =
        totalSurgeriesPlanned > 0
          ? ((totalSurgeriesRescheduled / totalSurgeriesPlanned) * 100).toFixed(
              2
            )
          : "0.00";
      const BBCRate =
        totalBBCCrossMatched > 0
          ? (totalSumOfTimeBBC / totalBBCCrossMatched).toFixed(2)
          : "0.00";
      const NursePatientRatio =
        totalBedsOccupied > 0
          ? (totalNursingStaff / totalBedsOccupied).toFixed(2)
          : "0.00";
      const OPWaitingTimeRate =
        totalOP > 0 ? (totalOPConsultationTime / totalOP).toFixed(2) : "0.00";

      const DiagnosticsWaitingTimeRate =
        totalDiagnosticsPatients > 0
          ? (totalDiagnosticsWaitingTime / totalDiagnosticsPatients).toFixed(2)
          : "0.00";
      const DischargeTimeRate =
        totalDischargePatients > 0
          ? (totalDischargeTime / totalDischargePatients).toFixed(2)
          : "0.00";

      const PatientFallRate =
        totalInpatients > 0
          ? (totalPatientFalls / totalInpatients).toFixed(2)
          : "0.00";

      const NearMissesRate =
        totalIncidentsReported > 0
          ? ((totalNearMissReported / totalIncidentsReported) * 100).toFixed(2)
          : "0.00";

      const NeedleStickInjuryRate =
        totalInpatients > 0
          ? (totalParenteralExposures / totalInpatients).toFixed(2)
          : "0.00";

      const HandoverRate =
        totalHandoverOpportunity > 0
          ? ((totalHandoverDone / totalHandoverOpportunity) * 100).toFixed(2)
          : "0.00";

      // const EMStockOutRate =
      //   totalStockOutEmergencyDrugs > 0
      //     ? ((totalHandoverDone / totalStockOutEmergencyDrugs) * 100).toFixed(2)
      //     : "0.00";

      const MedicationPrescriptionCapitalRate =
        totalNumberOfPrescriptions > 0
          ? (
              (totalPrescriptionInCapitalLetters / totalNumberOfPrescriptions) *
              100
            ).toFixed(2)
          : "0.00";

      const HandHygenieRate =
        totalNumberOfHandHygieneOpportunities > 0
          ? (
              (totalNumberOfActionsPerformed /
                totalNumberOfHandHygieneOpportunities) *
              100
            ).toFixed(2)
          : "0.00";

      const ImproperConsentRate =
        totalNumberOfDischargeAndDeath > 0
          ? (
              (totalNumberOfMedicalRecords / totalNumberOfDischargeAndDeath) *
              100
            ).toFixed(2)
          : "0.00";

      console.log("Total Time:", totalSumOfTime);
      console.log("Total Admissions:", totalAdmissions);
      console.log("Average Time:", averageTime);
      console.log("Total Reporting Errors:", totalReportingErrors);
      console.log("Total Tests Performed:", totalTestsPerformed);
      console.log("Error Rate (errors per 1000 tests):", errorRate);
      console.log("Total Staff Adhering to Safety:", totalStaffAdhering);
      console.log("Total Staff Audited:", totalStaffAudited);
      console.log("Adherence Rate (%):", adherenceRate);
      console.log("Total Number of Medication Errors:", totalMedicationErrors);
      console.log(
        "Total Number of Opportunity for medication Errors:",
        totalOpportunityMedicationErrors
      );
      console.log("Adherence Rate (%):", medicationError);

      console.log(
        "Total Medication Charts With Error Prone Abbreviation:",
        totalMedicationChartsWithErrorProneAbbreviation
      );
      console.log(
        "Total Medication Chart sReviewed:",
        totalMedicationChartsReviewed
      );
      console.log("medication Chart Error (%):", medicationChartError);

      console.log("Total Number of Adverse Drug:", totalAdverseDrug);
      console.log("Total Number of In-Patients:", totalInpatients);
      console.log("Adverse Drug Rate (%):", adversedrugrate);
      console.log("Total Number Uplanned OT:", totalUplannedOT);
      console.log("Total Number Underwent Surgery:", totalUnderwentSurgery);
      console.log("Adverse Drug Rate (%):", unplannedOTRate);
      console.log(
        "Total Number of Procedure followed:",
        totalSurgeryProcedureFollowed
      );
      console.log("Total Number Underwent Surgery:", totalUnderwentSurgery);
      console.log("Correct Surgery Rate (%):", correctsurgery);
      console.log("Total Transfusion Reaction:", totalTransusionReaction);
      console.log("Total Number Units Transfused:", totalUnitsTransfused);
      console.log("Transusion reaction Rate (%):", transfusionRate);
      console.log("Total Actual Death:", totalActualDeath);
      console.log("Total Predicted Death:", totalPredictedDeath);
      console.log("Standard Mortality Ratio(%):", StandMortalityRate);
      console.log("Total returns to emergency:", totalreturnsToEmergency);
      console.log("Total Patients in emergency:", totalpatientsToEmergency);
      console.log("Emergency Patient rate(%):", EmergencyPatientRate);
      console.log("Total pressure Ulcer:", totalPressureUlcer);
      console.log("Total In - Patiens:", totalInpatients);
      console.log("Pressure Ulcer rate(%):", PressureUlcerRate);
      console.log("Total Catheter in month:", totalCatheterInMonth);
      console.log("Total Catheter Days in month:", totalCatheterDaysInMonth);
      console.log("UTI Rate(%):", UTIRate);
      console.log("Total Ventilator Pneumonia:", totalVentilatorPneumonia);
      console.log(
        "Total Ventilator Days in Month:",
        totalVentilatorDaysInMonth
      );
      console.log("UTI Rate(%):", PneumoniaRate);
      console.log(
        "Total Centralline Blood Stream Infection In Month:",
        totalCentrallineBloodStreamInfectionInMonth
      );
      console.log(
        "Total Centralline Days In Month:",
        totalCentrallineDaysInMonth
      );
      console.log("Centralline Infection Rate(%):", CentrallineInfectionRate);
      console.log(
        "Total Surgicalsite Infection In A Month:",
        totalSurgicalsiteInfectionInAMonth
      );
      console.log("Total Underwent Surgery:", totalUnderwentSurgery);
      console.log("Surgicalsite Infection Rate(%):", SurgicalsiteInfectionRate);
      console.log(
        "Total Prophylactic Antibiotics:",
        totalProphylacticAntibiotics
      );
      console.log("Total Underwent Surgery:", totalUnderwentSurgery);
      console.log("Prophylactic Rate(%):", ProphylacticRate);
      console.log("Total Surgeries Rescheduled:", totalSurgeriesRescheduled);
      console.log("Total Surgeries Planned:", totalSurgeriesPlanned);
      console.log("Surgery Rescheduled Rate(%):", SurgeryRescheduledRate);
      console.log("Total BBC Cross Matched:", totalBBCCrossMatched);
      console.log("Total Sum Of Time BBC:", totalSumOfTimeBBC);
      console.log("BBC Rate:", BBCRate);
      console.log("Total Nursing Staff:", totalNursingStaff);
      console.log("Total Beds Occupied:", totalBedsOccupied);
      console.log("Nurse Patient Ratio:", NursePatientRatio);
      console.log("Total OP Consultation Time:", totalOPConsultationTime);
      console.log("Total OP:", totalOP);
      console.log("OP Waiting Time Rate:", OPWaitingTimeRate);
      console.log(
        "Total Diagnostics Waiting Time:",
        totalDiagnosticsWaitingTime
      );
      console.log("Total Diagnostics Patients:", totalDiagnosticsPatients);
      console.log("Diagnostics Waiting TimeRate:", DiagnosticsWaitingTimeRate);
      console.log("Total Discharge Time:", totalDischargeTime);
      console.log("Total Discharge Patients:", totalDischargePatients);
      console.log("Discharge Time Rate:", DischargeTimeRate);

      console.log("Total Patient Falls:", totalPatientFalls);
      console.log("Total In Patients:", totalInpatients);
      console.log("Patient Fall Rate:", PatientFallRate);

      console.log("Total Near Miss Reported:", totalNearMissReported);
      console.log("Total Incidents Reported:", totalIncidentsReported);
      console.log("Near Misses Rate:", NearMissesRate);

      console.log("Total Parenteral Exposures:", totalParenteralExposures);
      console.log("Total In patients:", totalInpatients);
      console.log("Needle Stick Injury Rate:", NeedleStickInjuryRate);

      console.log("Total Handover Done:", totalHandoverDone);
      console.log("Total Handover Opportunity:", totalHandoverOpportunity);
      console.log("Handover Rate:", HandoverRate);

      console.log(
        "Total Stock Out Emergency Drugs:",
        totalStockOutEmergencyDrugs
      );
      // console.log("Emergency Medicine StockOut Rate:", EMStockOutRate);

      console.log(
        "Total Number Of Variations Observed In MockDrill:",
        totalNumberOfVariationsObservedInMockDrill
      );

      console.log(
        "Total Prescription In Capital Letters:",
        totalPrescriptionInCapitalLetters
      );
      console.log("Total Number Of Prescriptions:", totalNumberOfPrescriptions);
      console.log(
        "Medication Prescription Capital Rate:",
        MedicationPrescriptionCapitalRate
      );

      console.log(
        "Total Number Of Actions Performed:",
        totalNumberOfActionsPerformed
      );
      console.log(
        "Total Number Of Hand Hygiene Opportunities:",
        totalNumberOfHandHygieneOpportunities
      );
      console.log("Hand Hygenie Rate:", HandHygenieRate);

      console.log(
        "Total Number Of Medical Records:",
        totalNumberOfMedicalRecords
      );
      console.log(
        "Total Number Of Discharge And Death:",
        totalNumberOfDischargeAndDeath
      );
      console.log("Improper Consent Rate:", ImproperConsentRate);

      setData({
        totalSumOfTime,
        totalAdmissions,
        averageTime,
        validRecords,
        zeroRecords,
        totalRecords: validRecords + zeroRecords,
        recordDetails,
        totalReportingErrors,
        totalTestsPerformed,
        errorRate,
        totalStaffAdhering,
        totalStaffAudited,
        adherenceRate,
        totalMedicationErrors,
        totalOpportunityMedicationErrors,
        medicationError,
        totalMedicationChartsWithErrorProneAbbreviation,
        totalMedicationChartsReviewed,
        medicationChartError,
        totalInpatients,
        adversedrugrate,
        totalUplannedOT,
        totalUnderwentSurgery,
        unplannedOTRate,
        totalSurgeryProcedureFollowed,
        correctsurgery,
        totalTransusionReaction,
        totalUnitsTransfused,
        transfusionRate,
        totalActualDeath,
        totalPredictedDeath,
        StandMortalityRate,
        totalreturnsToEmergency,
        totalpatientsToEmergency,
        EmergencyPatientRate,
        totalPressureUlcer,
        PressureUlcerRate,
        totalCatheterInMonth,
        totalCatheterDaysInMonth,
        UTIRate,
        totalVentilatorPneumonia,
        totalVentilatorDaysInMonth,
        PneumoniaRate,
        totalCentrallineBloodStreamInfectionInMonth,
        totalCentrallineDaysInMonth,
        CentrallineInfectionRate,
        totalSurgicalsiteInfectionInAMonth,
        SurgicalsiteInfectionRate,
        totalProphylacticAntibiotics,
        ProphylacticRate,
        totalSurgeriesRescheduled,
        totalSurgeriesPlanned,
        SurgeryRescheduledRate,
        totalBBCCrossMatched,
        totalSumOfTimeBBC,
        BBCRate,
        totalNursingStaff,
        totalBedsOccupied,
        NursePatientRatio,
        totalOPConsultationTime,
        totalOP,
        OPWaitingTimeRate,
        totalDiagnosticsWaitingTime,
        totalDiagnosticsPatients,
        DiagnosticsWaitingTimeRate,
        totalDischargeTime,
        totalDischargePatients,
        DischargeTimeRate,
        totalPatientFalls,
        PatientFallRate,
        totalNearMissReported,
        totalIncidentsReported,
        NearMissesRate,
        totalParenteralExposures,
        NeedleStickInjuryRate,
        totalHandoverDone,
        totalHandoverDone,
        HandoverRate,
        totalStockOutEmergencyDrugs,
        // EMStockOutRate,
        totalNumberOfVariationsObservedInMockDrill,
        totalPrescriptionInCapitalLetters,
        totalNumberOfPrescriptions,
        MedicationPrescriptionCapitalRate,
        totalNumberOfActionsPerformed,
        totalNumberOfHandHygieneOpportunities,
        HandHygenieRate,
        totalNumberOfMedicalRecords,
        totalNumberOfDischargeAndDeath,
        ImproperConsentRate,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Error fetching data: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const formatMonthYear = (date) => {
    return format(date, "MMMM yyyy");
  };

  const handleFetchData = () => {
    fetchData();
  };

  // Helper function to safely access data properties with default values
  const safeGet = (
    obj,
    prop,
    defaultValue = "",
    formatter = (value) => value
  ) => {
    if (!obj || obj[prop] === undefined || obj[prop] === null) {
      return defaultValue;
    }
    return formatter(obj[prop]);
  };

  // Create a comprehensive array of all indicators from the table with requested format
  const csvData = [
    // All indicators from the table with Sl.No, Standard, Parameter, Value, Benchmark format
    {
      SlNo: 1,
      Standard: "PSQ3a",
      Indicator: "Time for Initial assessment of indoor patients",
      Value: `${safeGet(data, "averageTime", 0)} Minutes`,
      Benchmark: "30 Minutes",
    },
    {
      SlNo: 2,
      Standard: "PSQ3a",
      Indicator: "Number of reporting errors / 1000 investigations",
      Value: safeGet(data, "errorRate", 0),
      Benchmark: "2%",
    },
    {
      SlNo: 3,
      Standard: "PSQ3a",
      Indicator:
        "Percentage of adherence to safety precautions by staff working in diagnostics",
      Value: `${safeGet(data, "adherenceRate", 0)}%`,
      Benchmark: "95%",
    },
    {
      SlNo: 4,
      Standard: "PSQ3a",
      Indicator: "Incidence of medication errors",
      Value: `${safeGet(data, "medicationError", 0)}%`,
      Benchmark: "0.2-1.5%",
    },
    {
      SlNo: 5,
      Standard: "PSQ3a",
      Parameter:
        "Percentage of medication charts with error-prone abbreviations",
      Value: `${safeGet(data, "medicationChartError", 0)}%`,
      Benchmark: "",
    },
    {
      SlNo: 6,
      Standard: "PSQ3a",
      Indicator:
        "Percentage of in-patients developing adverse drug reaction(s)",
      Value: `${safeGet(data, "adversedrugrate", 0)}%`,
      Benchmark: "< 2/1000 (0.002)",
    },
    {
      SlNo: 7,
      Standard: "PSQ3a",
      Indicator: "Percentage of unplanned return to OT",
      Value: `${safeGet(data, "unplannedOTRate", 0)}%`,
      Benchmark: "1.76%",
    },
    {
      SlNo: 8,
      Standard: "PSQ3a",
      Indicator:
        "Percentage of surgeries where the organisation's procedure to prevent adverse events like wrong site, wrong patient and wrong surgery have been adhered to",
      Value: `${safeGet(data, "correctsurgery", 0)}%`,
      Benchmark: "100%",
    },
    {
      SlNo: 9,
      Standard: "PSQ3a",
      Indicator: "Percentage of transfusion reactions",
      Value: `${safeGet(data, "transfusionRate", 0)}%`,
      Benchmark: "1%",
    },
    {
      SlNo: 10,
      Standard: "PSQ3a",
      Indicator: "Standardised Mortality Ratio for ICU",
      Value: `${safeGet(data, "StandMortalityRate", 0)}%`,
      Benchmark: "< 1%",
    },
    {
      SlNo: 11,
      Standard: "PSQ3a",
      Indicator:
        "Return to the emergency department within 72 hours with similar presenting complaints",
      Value: `${safeGet(data, "EmergencyPatientRate", 0)}%`,
      Benchmark: "0.80%",
    },
    {
      SlNo: 12,
      Standard: "PSQ3a",
      Indicator:
        "Incidence of hospital associated pressure ulcers after admission (Bed sore per 1000 patient days)",
      Value: `${safeGet(data, "PressureUlcerRate", 0)}%`,
      Benchmark: "0.57%",
    },
    {
      SlNo: 13,
      Standard: "PSQ3b",
      Indicator: "Catheter associated Urinary Tract infection rate",
      Value: `${safeGet(data, "UTIRate", 0)}%`,
      Benchmark: "1.68%",
    },
    {
      SlNo: 14,
      Standard: "PSQ3b",
      Indicator: "Ventilator associated Pneumonia rate",
      Value: `${safeGet(data, "PneumoniaRate", 0)}%`,
      Benchmark: "1-3%",
    },
    {
      SlNo: 15,
      Standard: "PSQ3b",
      Indicator: "Central line - associated Blood stream infection rate",
      Value: `${safeGet(data, "CentrallineInfectionRate", 0)}%`,
      Benchmark: "0.80%",
    },
    {
      SlNo: 16,
      Standard: "PSQ3b",
      Indicator: "Surgical site infection rate",
      Value: `${safeGet(data, "SurgicalsiteInfectionRate", 0)}%`,
      Benchmark: "< 3%",
    },
    {
      SlNo: 17,
      Standard: "PSQ3b",
      Indicator: "Hand Hygiene Compliance Rate",
      Value: "",
      Benchmark: "93%",
    },
    {
      SlNo: 18,
      Standard: "PSQ3b",
      Indicator:
        "Percentage of cases who received appropriate prophylactic antibiotics within the specified timeframe",
      Value: `${safeGet(data, "ProphylacticRate", 0)}%`,
      Benchmark: "100%",
    },
    {
      SlNo: 19,
      Standard: "PSQ3c",
      Indicator: "Percentage of re-scheduling of surgeries",
      Value: `${safeGet(data, "SurgeryRescheduledRate", 0)}%`,
      Benchmark: "< 6%",
    },
    {
      SlNo: 20,
      Standard: "PSQ3c",
      Indicator: "Turnaround time for issue of blood and blood components",
      Value: `${safeGet(data, "BBCRate", 0)} Minutes`,
      Benchmark: "11-35 Minutes",
    },
    {
      SlNo: 21,
      Standard: "PSQ3c",
      Indicator: "Nurse-Patient ratio for ICUs and wards",
      Value: `1:${safeGet(data, "NursePatientRatio", 0)}`,
      Benchmark: "1:2",
    },
    {
      SlNo: 22,
      Standard: "PSQ3c",
      Indicator: "Waiting time for out-patient consultation",
      Value: `${safeGet(data, "OPWaitingTimeRate", 0)} Minutes`,
      Benchmark: "11-20 Minutes",
    },
    {
      SlNo: 23,
      Standard: "PSQ4c",
      Indicator: "Waiting time for diagnostics",
      Value: `${safeGet(data, "DiagnosticsWaitingTimeRate", 0)} Minutes`,
      Benchmark: "60 Minutes",
    },
    {
      SlNo: 24,
      Standard: "PSQ4c",
      Indicator: "Time taken for Discharge",
      Value: `${safeGet(data, "DischargeTimeRate", 0)} Minutes`,
      Benchmark: "150 Minutes",
    },
    {
      SlNo: 25,
      Standard: "PSQ4c",
      Indicator:
        "Percentage of medical records having incomplete and/or improper consent",
      Value: `${safeGet(data, "ImproperConsentRate", 0)}%`,
      Benchmark: "< 0.3%",
    },
    {
      SlNo: 26,
      Standard: "PSQ4c",
      Indicator: "Stock out Rate of Emergency medications",
      Value: `${safeGet(data, "EMStockOutRate", 0)}%`,
      Benchmark: "< 0.2%",
    },
    {
      SlNo: 27,
      Standard: "PSQ4c",
      Indicator: "Number of variations observed in mock drills",
      Value: safeGet(data, "MockDrillRate", 0),
      Benchmark: "< 3/Drill",
    },
    {
      SlNo: 28,
      Standard: "PSQ4d",
      Indicator: "Patient fall rate (Falls per 1000 patient days)",
      Value: `${safeGet(data, "PatientFallRate", 0)}%`,
      Benchmark: "< 3/1000",
    },
    {
      SlNo: 29,
      Standard: "PSQ4d",
      Indicator: "Percentage of near misses",
      Value: `${safeGet(data, "NearMissesRate", 0)}%`,
      Benchmark: "3.42%",
    },
    {
      SlNo: 30,
      Standard: "PSQ3d",
      Indicator: "Incidence of needle stick injuries",
      Value: safeGet(data, "NeedleStickInjuryRate", 0),
      Benchmark: "< 2",
    },
    {
      SlNo: 31,
      Standard: "PSQ3d",
      Indicator:
        "Appropriate handovers during shift change (To be done seperately for doctors and nurses)-(per patient per shift)",
      Value: `${safeGet(data, "HandoverRate", 0)}%`,
      Benchmark: "> 98%",
    },
    {
      SlNo: 32,
      Standard: "PSQ3d",
      Indicator: "Compliance rate to Medication Prescription in capitals",
      Value: `${safeGet(data, "MedicationPrescriptionCapitalRate", 0)}%`,
      Benchmark: "> 98%",
    },
  ];

  const isExceeded = (actual, threshold) => {
    const actualNum = parseFloat(actual);
    const thresholdNum = parseFloat(threshold);
    return (
      !isNaN(actualNum) && !isNaN(thresholdNum) && actualNum > thresholdNum
    );
  };

  return (
    <div className="container1">
      <h1 className="text-center">Patient Assessment Data</h1>
      <br />
      <div className="picker-container1">
        <label>Select Month and Year:</label>
      </div>
      <div className="input-container">
        <div className="date-picker-wrapper">
          <i
            style={{
              fontSize: "150%",
              color: "rgb(149,188,176)",
              marginRight: "5px",
            }}
            className="fa fa-calendar"
          ></i>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="form-control"
          />
        </div>
        <button onClick={handleFetchData} className="fetch-button1">
          Fetch Data
        </button>
        {data && data.totalRecords > 0 && (
          <CSVLink
            data={csvData}
            filename={`initial_assessment_data_${format(
              selectedDate,
              "MM_yyyy"
            )}.csv`}
            className="csv-button1"
          >
            Export CSV
          </CSVLink>
        )}
      </div>
      {loading && <p className="loading-message">Loading data...</p>}
      {error && <p className="error-message">{error}</p>}
      {noDataFound && (
        <div className="no-data-message">
          <p>No data found for {formatMonthYear(selectedDate)}.</p>
        </div>
      )}
      {data && (
        <>
          {data.totalRecords > 0 ? (
            <table className="data-table1">
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Standards</th>
                  <th>Indicators</th>
                  <th>Values</th>
                  <th>Bench Mark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.</td>
                  <td>PSQ3a</td>
                  <td>Time for Initial assessment of indoor patients</td>
                  <td
                    style={{
                      color: isExceeded(data.averageTime, 30) ? "red" : "black",
                    }}
                  >
                    {`${data.averageTime} Minutes`}
                  </td>
                  <td>30 Minutes</td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td>PSQ3a</td>
                  <td>Number of reporting errors / 1000 investigations. </td>
                  <td
                    style={{
                      color: isExceeded(data.errorRate, 2) ? "red" : "black",
                    }}
                  >
                    {`${data.errorRate}`}
                  </td>
                  <td>2%</td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td>PSQ3a</td>
                  <td>
                    Percentage of adherence to safety precautions by staff
                    working in diagnostics
                  </td>
                  <td
                    style={{
                      color: isExceeded(95, data.adherenceRate)
                        ? "red"
                        : "black", // Check if less than 95
                    }}
                  >
                    {`${data.adherenceRate}%`}
                  </td>
                  <td>95%</td>
                </tr>
                <tr>
                  <td>4.</td>
                  <td>PSQ3a</td>
                  <td>Incidence of medication errors</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.medicationError) > 1.5 ||
                        parseFloat(data.medicationError) < 0.2
                          ? "red"
                          : "black",
                    }}
                  >
                    {`${data.medicationError}%`}
                  </td>
                  <td>0.2-1.5%</td>
                </tr>
                <tr>
                  <td>5.</td>
                  <td>PSQ3a</td>
                  <td>
                    Percentage of medication charts with error-prone
                    abbreviations
                  </td>
                  <td>{`${data.medicationChartError}%`}</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>6.</td>
                  <td>PSQ3a</td>
                  <td>
                    Percentage of in-patients developing adverse drug
                    reaction(s).
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.adversedrugrate) > 0.002
                          ? "red"
                          : "black",
                    }}
                  >{`${data.adversedrugrate}%`}</td>
                  <td>&lt; 2/1000 (0.002)</td>
                </tr>
                <tr>
                  <td>7.</td>
                  <td>PSQ3a</td>
                  <td>Percentage of unplanned return to OT</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.unplannedOTRate) > 1.76
                          ? "red"
                          : "black",
                    }}
                  >{`${data.unplannedOTRate}%`}</td>
                  <td>1.76%</td>
                </tr>
                <tr>
                  <td>8.</td>
                  <td>PSQ3a</td>
                  <td>
                    Percentage of surgeries where the organisation's procedure
                    to prevent adverse events like wrong site, wrong patient and
                    wrong surgery have been adhered to.
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.correctsurgery) > 100 ? "red" : "black",
                    }}
                  >{`${data.correctsurgery}%`}</td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td>9.</td>
                  <td>PSQ3a</td>
                  <td>Percentage of transfusion reactions</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.transfusionRate) > 1 ? "red" : "black",
                    }}
                  >{`${data.transfusionRate}%`}</td>
                  <td>1%</td>
                </tr>
                <tr>
                  <td>10.</td>
                  <td>PSQ3a</td>
                  <td>Standardised Mortality Ratio for ICU</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.StandMortalityRate) > 1
                          ? "red"
                          : "black",
                    }}
                  >{`${data.StandMortalityRate}%`}</td>
                  <td>&lt; 1%</td>
                </tr>
                <tr>
                  <td>11.</td>
                  <td>PSQ3a</td>
                  <td>
                    Return to the emergency department within 72 hours with
                    similar presenting complaints
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.EmergencyPatientRate) > 0.8
                          ? "red"
                          : "black",
                    }}
                  >{`${data.EmergencyPatientRate}%`}</td>
                  <td>0.80%</td>
                </tr>
                <tr>
                  <td>12.</td>
                  <td>PSQ3a</td>
                  <td>
                    Incidence of hospital associated pressure ulcers after
                    admission (Bed sore per 1000 patient days)
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.PressureUlcerRate) > 0.57
                          ? "red"
                          : "black",
                    }}
                  >{`${data.PressureUlcerRate}%`}</td>
                  <td>0.57%</td>
                </tr>
                <tr>
                  <td>13.</td>
                  <td>PSQ3b</td>
                  <td>Catheter associated Urinary Tract infection rate</td>
                  <td
                    style={{
                      color: parseFloat(data.UTIRate) > 1.68 ? "red" : "black",
                    }}
                  >{`${data.UTIRate}%`}</td>
                  <td>1.68%</td>
                </tr>
                <tr>
                  <td>14.</td>
                  <td>PSQ3b</td>
                  <td>Ventilator associated Pneumonia rate</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.PneumoniaRate) > 3 ||
                        parseFloat(data.PneumoniaRate) < 1
                          ? "red"
                          : "black",
                    }}
                  >{`${data.PneumoniaRate}%`}</td>
                  <td>1-3%</td>
                </tr>
                <tr>
                  <td>15.</td>
                  <td>PSQ3b</td>
                  <td>Central line - associated Blood stream infection rate</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.CentrallineInfectionRate) > 0.8
                          ? "red"
                          : "black",
                    }}
                  >{`${data.CentrallineInfectionRate}%`}</td>
                  <td>0.80%</td>
                </tr>
                <tr>
                  <td>16.</td>
                  <td>PSQ3b</td>
                  <td>Surgical site infection rate</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.SurgicalsiteInfectionRate) > 3
                          ? "red"
                          : "black",
                    }}
                  >{`${data.SurgicalsiteInfectionRate}%`}</td>
                  <td>&lt; 3%</td>
                </tr>
                <tr>
                  <td>17.</td>
                  <td>PSQ3b</td>
                  <td>Hand Hygiene Compliance Rate</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.HandHygenieRate) < 98 ? "red" : "black",
                    }}
                  >{`${data.HandHygenieRate}%`}</td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td>18.</td>
                  <td>PSQ3b</td>
                  <td>
                    Percentage of cases who received appropriate prophylactic
                    antibiotics within the specified timeframe
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.ProphylacticRate) < 100
                          ? "red"
                          : "black",
                    }}
                  >{`${data.ProphylacticRate}%`}</td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td>19.</td>
                  <td>PSQ3c</td>
                  <td>Percentage of re-scheduling of surgeries</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.SurgeryRescheduledRate) > 6
                          ? "red"
                          : "black",
                    }}
                  >{`${data.SurgeryRescheduledRate}%`}</td>
                  <td>&lt; 6%</td>
                </tr>
                <tr>
                  <td>20.</td>
                  <td>PSQ3c</td>
                  <td>
                    Turnaround time for issue of blood and blood components
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.BBCRate) > 35 ||
                        parseFloat(data.BBCRate) < 11
                          ? "red"
                          : "black",
                    }}
                  >{`${data.BBCRate} Minutes`}</td>
                  <td>11-35 Minutes</td>
                </tr>
                <tr>
                  <td>21.</td>
                  <td>PSQ3c</td>
                  <td>Nurse-Patient ratio for ICUs and wards</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.NursePatientRatio) > 2
                          ? "red"
                          : "black",
                    }}
                  >{`1:${data.NursePatientRatio}`}</td>
                  <td>1:2</td>
                </tr>
                <tr>
                  <td>22.</td>
                  <td>PSQ3c</td>
                  <td>Waiting time for out-patient consultation</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.OPWaitingTimeRate) > 20 ||
                        parseFloat(data.OPWaitingTimeRate) < 11
                          ? "red"
                          : "black",
                    }}
                  >{`${data.OPWaitingTimeRate} Minutes`}</td>
                  <td>11-20 Minutes</td>
                </tr>
                <tr>
                  <td>23.</td>
                  <td>PSQ4c</td>
                  <td>Waiting time for diagnostics</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.DiagnosticsWaitingTimeRate) > 60
                          ? "red"
                          : "black",
                    }}
                  >{`${data.DiagnosticsWaitingTimeRate} Minutes`}</td>
                  <td>60 Minutes</td>
                </tr>
                <tr>
                  <td>24.</td>
                  <td>PSQ4c</td>
                  <td>Time taken for Discharge</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.DischargeTimeRate) > 150
                          ? "red"
                          : "black",
                    }}
                  >{`${data.DischargeTimeRate} Minutes`}</td>
                  <td>150 Minutes</td>
                </tr>
                <tr>
                  <td>25.</td>
                  <td>PSQ4c</td>
                  <td>
                    Percentage of medical records having incomplete and/or
                    improper consent
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.ImproperConsentRate) > 0.3
                          ? "red"
                          : "black",
                    }}
                  >{`${data.ImproperConsentRate} %`}</td>
                  <td>&lt; 0.3%</td>
                </tr>
                <tr>
                  <td>26.</td>
                  <td>PSQ4c</td>
                  <td>Stock out Rate of Emergency medications</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.totalStockOutEmergencyDrugs) > 20
                          ? "red"
                          : "black",
                    }}
                  >{`${data.totalStockOutEmergencyDrugs}`}</td>
                  <td>&lt; 20</td>
                </tr>
                <tr>
                  <td>27.</td>
                  <td>PSQ4c</td>
                  <td>Number of variations observed in mock drills</td>
                  <td
                    style={{
                      color:
                        parseFloat(
                          data.totalNumberOfVariationsObservedInMockDrill
                        ) > 3
                          ? "red"
                          : "black",
                    }}
                  >{`${data.totalNumberOfVariationsObservedInMockDrill}`}</td>
                  <td>&lt; 3/Drill</td>
                </tr>
                <tr>
                  <td>28.</td>
                  <td>PSQ4d</td>
                  <td>Patient fall rate (Falls per 1000 patient days)</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.PatientFallRate) > 0.00344
                          ? "red"
                          : "black",
                    }}
                  >{`${data.PatientFallRate} %`}</td>
                  <td>&lt; 3/1000</td>
                </tr>
                <tr>
                  <td>29.</td>
                  <td>PSQ4d</td>
                  <td>Percentage of near misses</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.NearMissesRate) > 3.42
                          ? "red"
                          : "black",
                    }}
                  >{`${data.NearMissesRate} %`}</td>
                  <td>3.42%</td>
                </tr>
                <tr>
                  <td>30.</td>
                  <td>PSQ3d</td>
                  <td>Incidence of needle stick injuries</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.NeedleStickInjuryRate) > 2
                          ? "red"
                          : "black",
                    }}
                  >{`${data.NeedleStickInjuryRate}`}</td>
                  <td>&lt; 2</td>
                </tr>
                <tr>
                  <td>31.</td>
                  <td>PSQ3d</td>
                  <td>
                    Appropriate handovers during shift change (To be done
                    seperately for doctors and nurses)-(per patient per shift).
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.HandoverRate) < 98 ? "red" : "black",
                    }}
                  >{`${data.HandoverRate} %`}</td>
                  <td>&gt; 98%</td>
                </tr>
                <tr>
                  <td>32.</td>
                  <td>PSQ3d</td>
                  <td>
                    Compliance rate to Medication Prescription in capitals
                  </td>
                  <td
                    style={{
                      color:
                        parseFloat(data.MedicationPrescriptionCapitalRate) < 98
                          ? "red"
                          : "black",
                    }}
                  >{`${data.MedicationPrescriptionCapitalRate} %`}</td>
                  <td>&gt; 98%</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="no-data-table">
              <p>No records available for calculations.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmergencyRoomData;

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

      const apiUrl = "http://127.0.0.1:8000/formula-data/";
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
      let totalAdverseDrug = 0;
      let totalInpatients = 0;
      let totalUplannedOT = 0;
      let totalUnderwentSurgery = 0;
      let totalSurgeryProcedureFollowed = 0;
      let totalTransusionReaction = 0;
      let totalUnitsTransfused = 0;
      let totalActualDeath = 0;
      let totalPredictedDeath = 0;
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
      const StandMortalityRatio =
        totalPredictedDeath > 0
          ? ((totalActualDeath / totalPredictedDeath) * 100).toFixed(2)
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
      console.log("Standard Mortality Ratio(%):", StandMortalityRatio);

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
        totalMedicationErrors,
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
        StandMortalityRatio,
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

  const csvData =
    data && data.totalRecords > 0
      ? [
          { Parameter: "Month", Value: formatMonthYear(selectedDate) },
          { Parameter: "Total Records Processed", Value: data.totalRecords },
          {
            Parameter: "Records with Positive Values",
            Value: data.validRecords,
          },
          { Parameter: "Records with Zero Values", Value: data.zeroRecords },
          {
            Parameter: "Total Time for Initial Assessment",
            Value: data.totalSumOfTime.toFixed(2),
          },
          {
            Parameter: "Total Admissions",
            Value: data.totalAdmissions.toFixed(2),
          },
          { Parameter: "Average Time (Minutes)", Value: data.averageTime },
        ]
      : [];

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
                  <td>1</td>
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
                  <td>2</td>
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
                  <td>3</td>
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
                  <td>4</td>
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
                  <td>5</td>
                  <td>PSQ3a</td>
                  <td>
                    Percentage of medication charts with error-prone
                    abbreviations
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>6</td>
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
                  <td>7</td>
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
                  <td>8</td>
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
                  <td>9</td>
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
                  <td>10</td>
                  <td>PSQ3a</td>
                  <td>Standardised Mortality Ratio for ICU</td>
                  <td
                    style={{
                      color:
                        parseFloat(data.StandMortalityRatio) > 1
                          ? "red"
                          : "black",
                    }}
                  >{`${data.StandMortalityRatio}%`}</td>
                  <td>&lt; 1%</td>
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

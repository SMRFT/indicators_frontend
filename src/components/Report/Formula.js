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
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
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
      console.log(`Fetching aggregated formula data for ${month}/${year}...`);

      const apiUrl = `${IndicatorBaseUrl}formula-aggregated-data/`;
      const params = { year, month };

      const response = await axios.get(apiUrl, {
        params,
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });

      setRawResponseObject(response);
      setApiResponse(response.data);

      if (!response.data || Object.keys(response.data).length === 0) {
        setNoDataFound(true);
        setLoading(false);
        return;
      }

      setData(response.data);
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
                  <td>6.</td>
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
                  <td>7.</td>
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
                  <td>8.</td>
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
                  <td>9.</td>
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
                  <td>10.</td>
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
                  <td>11.</td>
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
                  <td>12.</td>
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
                  <td>13.</td>
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
                  <td>14.</td>
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
                  <td>15.</td>
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
                  <td>16.</td>
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
                  <td>17.</td>
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
                  <td>18.</td>
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
                  <td>19.</td>
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
                  <td>20.</td>
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
                  <td>21.</td>
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
                  <td>22.</td>
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
                  <td>23.</td>
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
                  <td>24.</td>
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
                  <td>25.</td>
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
                  <td>26.</td>
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
                  <td>27.</td>
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
                  <td>28.</td>
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
                  <td>29.</td>
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
                  <td>30.</td>
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
                  <td>31.</td>
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

import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import apiRequest from "../apiRequest";
import { Printer, Download } from "lucide-react";
import "./Report.css";

const HandHygieneReport = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const tableRef = useRef(null);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const isViewClicked = true; // or useState(false)
  const exportData = (type) => {
    console.log("Exporting as:", type);
    // your export logic here
  };
  useEffect(() => {
    // Do not set today's date initially so we can see all data
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      const response = await apiRequest(`${IndicatorBaseUrl}HandHygieneReport/`);
      if (response.success) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        setError(response.error || "Failed to fetch data");
      }
    };
    fetchReport();
  }, []);


  useEffect(() => {
    if (fromDate || toDate) {
      const filtered = data.filter((item) => {
        const itemDate = dayjs(item.selectedDate);
        let isValid = true;
        
        if (fromDate) {
          const from = dayjs(fromDate);
          if (itemDate.isBefore(from, 'day')) isValid = false;
        }
        
        if (toDate) {
          const to = dayjs(toDate);
          if (itemDate.isAfter(to, 'day')) isValid = false;
        }
        
        return isValid;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [fromDate, toDate, data]);

  const handlePrint = () => {
    const printContent = tableRef.current;
    const WindowPrt = window.open("", "", "width=900,height=650");
    WindowPrt.document.write(`
      <html>
        <head>
          <title>Hand Hygiene Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial; font-size: 14px; }
            th, td { border: 1px solid #999; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
        <h2 style="text-align:center">Hand Hygiene Audit Report</h2>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  };

  const handleDownloadButtonClick = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Report");
    XLSX.writeFile(workbook, "Hand_Hygiene_Audit_Report.xlsx");
  };

  return (
    <div className="report-page">
      <h1 className="report-title">
        Hand Hygiene Audit Report
      </h1>

      {/* Date Pickers */}
      <div className="report-actions">
        {filteredData && filteredData.length > 0 && (
          <>
            <button
              className="report-action-btn"
              onClick={handlePrint}
              title="Print"
            >
              <Printer size={16} />
            </button>
            <button
              className="report-action-btn accent"
              onClick={handleDownloadButtonClick}
              title="Download Excel"
            >
              <Download size={16} />
            </button>
          </>
        )}
      </div>

      {/* Date Pickers */}
      <div className="report-toolbar">
        <div className="report-field">
          <label className="report-field-label">From Date</label>
          <div className="report-date-input">
            <Calendar size={16} />
            <DatePicker
              selected={fromDate ? dayjs(fromDate).toDate() : null}
              onChange={(date) =>
                setFromDate(date ? dayjs(date).format("YYYY-MM-DD") : "")
              }
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select From Date"
            />
          </div>
        </div>
        <div className="report-field">
          <label className="report-field-label">To Date</label>
          <div className="report-date-input">
            <Calendar size={16} />
            <DatePicker
              selected={toDate ? dayjs(toDate).toDate() : null}
              onChange={(date) =>
                setToDate(date ? dayjs(date).format("YYYY-MM-DD") : "")
              }
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select To Date"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {filteredData.length > 0 ? (
        <div className="report-table-wrap" ref={tableRef}>
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Audited By</th>
                <th>Staff Name</th>
                <th>Area</th>
                <th>Category</th>
                <th>Type</th>
                <th>5 Moments</th>
                <th>Ornaments</th>
                <th>Total Number Of Actions Performed</th>
                <th>Total Number Of Hand Hygiene Opportunities</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                let parsedMoments = [];
                try {
                  if (typeof item.fiveMoments === 'string') {
                    try { parsedMoments = JSON.parse(item.fiveMoments); }
                    catch(e) { parsedMoments = JSON.parse(item.fiveMoments.replace(/'/g, '"')); }
                  } else if (Array.isArray(item.fiveMoments)) {
                    parsedMoments = item.fiveMoments;
                  }
                } catch(e) {
                   parsedMoments = [item.fiveMoments]; // Fallback
                }
                return (
                <tr key={idx}>
                  <td>{item.selectedDate}</td>
                  <td>{item.auditBy}</td>
                  <td>{item.nameOfTheStaff}</td>
                  <td>{item.area}</td>
                  <td>{item.category}</td>
                  <td>{item.typeOfHandHygiencePractice}</td>
                  <td>
                    {Array.isArray(parsedMoments) ? parsedMoments.map((m, i) => <div key={i}>• {m}</div>) : parsedMoments}
                  </td>
                  <td>{item.ornamentsIfAny}</td>
                  <td>{item.totalNumberOfActionsPerformed}</td>
                  <td>{item.totalNumberOfHandHygieneOpportunities}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No data available for selected dates.
        </p>
      )}
    </div>
  );
};

export default HandHygieneReport;

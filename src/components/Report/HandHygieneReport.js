import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Row, Col } from "react-bootstrap";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import apiRequest from "../apiRequest";

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
    // Set today's date initially
    const today = dayjs().format("YYYY-MM-DD");
    setFromDate(today);
    setToDate(today);
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
    if (fromDate && toDate) {
      const filtered = data.filter((item) => {
        const date = new Date(item.selectedDate);
        return new Date(fromDate) <= date && date <= new Date(toDate);
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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Hand Hygiene Audit Report
      </h2>

      {/* Date Pickers */}
      {/* FROM and TO Date Pickers */}
      <Row
        className="mb-3"
        style={{ justifyContent: "flex-start", marginLeft: "10px" }}
      >
        <Col xs={12} md={3}>
          <label>From Date</label>
          <DatePicker
            value={fromDate ? dayjs(fromDate) : null}
            onChange={(date) =>
              setFromDate(date ? date.format("YYYY-MM-DD") : "")
            }
            format="YYYY-MM-DD"
            className="form-control"
          />
        </Col>
        <Col xs={12} md={3}>
          <label>To Date</label>
          <DatePicker
            value={toDate ? dayjs(toDate) : null}
            onChange={(date) =>
              setToDate(date ? date.format("YYYY-MM-DD") : "")
            }
            format="YYYY-MM-DD"
            className="form-control"
          />
        </Col>

        {/* Top-right Print & Download icons - only if data is available */}
        {isViewClicked && exportData && exportData.length > 0 && (
          <Col
            xs={12}
            md={6}
            className="text-end d-flex justify-content-end align-items-end"
          >
            <i
              className="fa fa-print"
              title="Print"
              onClick={handlePrint}
              style={{
                fontSize: "150%",
                color: "rgb(149,188,176)",
                cursor: "pointer",
                marginRight: "20px",
              }}
            />

            <i
              className="fa fa-file-excel-o"
              title="Download Excel"
              onClick={handleDownloadButtonClick}
              style={{
                fontSize: "150%",
                color: "rgb(149,188,176)",
                cursor: "pointer",
              }}
            />
          </Col>
        )}
      </Row>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto" ref={tableRef}>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Audited By</th>
                <th className="border px-2 py-1">Staff Name</th>
                <th className="border px-2 py-1">Area</th>
                <th className="border px-2 py-1">Category</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">5 Moments</th>
                <th className="border px-2 py-1">Ornaments</th>
                <th className="border px-2 py-1">
                  Total Number Of Actions Performed
                </th>
                <th className="border px-2 py-1">
                  Total Number Of Hand Hygiene Opportunities
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.selectedDate}</td>
                  <td className="border px-2 py-1">{item.auditBy}</td>
                  <td className="border px-2 py-1">{item.nameOfTheStaff}</td>
                  <td className="border px-2 py-1">{item.area}</td>
                  <td className="border px-2 py-1">{item.category}</td>
                  <td className="border px-2 py-1">
                    {item.typeOfHandHygiencePractice}
                  </td>
                  <td className="border px-2 py-1">
                    {item.fiveMoments &&
                      JSON.parse(item.fiveMoments.replace(/'/g, '"')).map(
                        (moment, i) => <div key={i}>• {moment}</div>
                      )}
                  </td>
                  <td className="border px-2 py-1">{item.ornamentsIfAny}</td>
                  <td className="border px-2 py-1">
                    {item.totalNumberOfActionsPerformed}
                  </td>
                  <td className="border px-2 py-1">
                    {item.totalNumberOfHandHygieneOpportunities}
                  </td>
                </tr>
              ))}
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

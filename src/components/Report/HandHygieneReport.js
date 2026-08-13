import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Row, Col, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import styled from "styled-components";
import apiRequest from "../apiRequest";
import { Printer, Download } from "lucide-react";
import "./Report.css";

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 250px;
  gap: 15px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
`;

const PageButton = styled.button`
  background: ${props => props.active ? "var(--color-accent-dark, #0f766e)" : "var(--color-surface)"};
  color: ${props => props.active ? "#ffffff" : "var(--color-text-primary)"};
  border: 1px solid var(--color-border-strong);
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? "var(--color-accent-dark, #0f766e)" : "var(--color-hover-overlay)"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const HandHygieneReport = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Default to 1 month range (1 month ago to today)
  const defaultFrom = dayjs().subtract(1, "month").format("YYYY-MM-DD");
  const defaultTo = dayjs().format("YYYY-MM-DD");

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [appliedFromDate, setAppliedFromDate] = useState(defaultFrom);
  const [appliedToDate, setAppliedToDate] = useState(defaultTo);

  const tableRef = useRef(null);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;

  const fetchReport = async (from = appliedFromDate, to = appliedToDate) => {
    setLoading(true);
    setError("");
    try {
      let url = `${IndicatorBaseUrl}HandHygieneReport/`;
      const params = [];
      if (from) params.push(`fromDate=${from}`);
      if (to) params.push(`toDate=${to}`);
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await apiRequest(url);
      if (response.success) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        setError(response.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(appliedFromDate, appliedToDate);
  }, [appliedFromDate, appliedToDate, IndicatorBaseUrl]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const handleApplyFilter = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="report-page">
      <h1 className="report-title">
        Hand Hygiene Audit Report
      </h1>

      {/* Action Buttons */}
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

      {/* Date Pickers & Apply Button */}
      <div className="report-toolbar" style={{ alignItems: "flex-end" }}>
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
        <div className="report-field" style={{ flex: "0 0 auto", minWidth: "auto" }}>
          <button
            className="btn btn-primary"
            onClick={handleApplyFilter}
            style={{
              height: "42px",
              padding: "0 24px",
              fontWeight: "600",
              backgroundColor: "var(--color-accent, #0d9488)",
              borderColor: "var(--color-accent, #0d9488)",
              borderRadius: "var(--radius-sm, 6px)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            Apply Filter
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table / Spinner */}
      {loading ? (
        <SpinnerContainer>
          <Spinner animation="border" role="status" style={{ width: "3rem", height: "3rem", color: "var(--color-accent-dark, #0d9488)" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "16px", fontWeight: "500" }}>Fetching Hand Hygiene Audit records...</div>
        </SpinnerContainer>
      ) : filteredData.length > 0 ? (
        <>
          <div className="report-table-wrap" ref={tableRef}>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Audited By</th>
                  <th>Staff Name</th>
                  <th>Observer</th>
                  <th>Area</th>
                  <th>Category</th>
                  <th>5 Moments</th>
                  <th>Ornaments</th>
                  <th>Total Number Of Actions Performed</th>
                  <th>Total Number Of Hand Hygiene Opportunities</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => {
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
                    <td>{item.observer || "-"}</td>
                    <td>{item.area}</td>
                    <td>{item.category}</td>
                    <td>
                      {Array.isArray(parsedMoments) ? parsedMoments.map((m, i) => {
                        let displayStr = "";
                        if (typeof m === 'object' && m !== null) {
                          displayStr = m.moment + (m.practice ? ` (${m.practice})` : '');
                        } else {
                          displayStr = String(m);
                        }
                        return <div key={i}>• {displayStr}</div>;
                      }) : (typeof parsedMoments === 'object' && parsedMoments !== null ? JSON.stringify(parsedMoments) : parsedMoments)}
                    </td>
                    <td>{item.ornamentsIfAny}</td>
                    <td>{item.totalNumberOfActionsPerformed}</td>
                    <td>{item.totalNumberOfHandHygieneOpportunities}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>

          <PaginationContainer>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
            </div>
            <div style={{ display: "flex", gap: "2px" }}>
              <PageButton 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
              >
                First
              </PageButton>
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
              >
                Prev
              </PageButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                  return (
                    <PageButton
                      key={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PageButton>
                  );
                } else if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} style={{ padding: "6px 8px", color: "var(--color-text-muted)" }}>...</span>;
                }
                return null;
              })}
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </PageButton>
              <PageButton 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Last
              </PageButton>
            </div>
          </PaginationContainer>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No data available for selected dates.
        </p>
      )}
    </div>
  );
};

export default HandHygieneReport;

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

const TrainingFeedbackReport = () => {
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

  const fetchFeedback = async (from = appliedFromDate, to = appliedToDate) => {
    setLoading(true);
    setError("");
    try {
      let url = `${IndicatorBaseUrl}TrainingFeedBackReport/`;
      const params = [];
      if (from) params.push(`fromDate=${from}`);
      if (to) params.push(`toDate=${to}`);
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await apiRequest(url);
      if (response.success) {
        const parsedData = response.data.map((item) => {
          let parsedTopic = {};
          let parsedTrainer = {};
          try { parsedTopic = typeof item.detailsOfTrainingTopic === 'string' ? JSON.parse(item.detailsOfTrainingTopic) : (item.detailsOfTrainingTopic || {}); } catch(e){}
          try { parsedTrainer = typeof item.trainer === 'string' ? JSON.parse(item.trainer) : (item.trainer || {}); } catch(e){}
          return {
            ...item,
            detailsOfTrainingTopic: parsedTopic,
            trainer: parsedTrainer,
          };
        });
        setData(parsedData);
        setFilteredData(parsedData);
      } else {
        setError(response.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching feedback report:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(appliedFromDate, appliedToDate);
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
          <title>Training Feedback Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial; font-size: 14px; }
            th, td { border: 1px solid #999; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
        <h2 style="text-align:center">Training Feedback Report</h2>
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
    // Create a flattened version of the data for Excel export
    const flattenedData = filteredData.map((item) => ({
      Date: item.selectedDate,
      ID: item.ID,
      Name: item.name,
      Department: item.department,
      TrainingTopic: item.trainingTopic,
      Duration: item.duration,
      Relevance: item.detailsOfTrainingTopic.relevance,
      Content: item.detailsOfTrainingTopic.content,
      Clarity: item.detailsOfTrainingTopic.clarity,
      CommunicationSkill: item.trainer.communicationskill,
      Knowledge: item.trainer.knowledge,
      TrainerName: item.nameOfTheTrainer,
      AudioVisualQuality: item.qualityOfAudioVisuals,
      KnowledgeGain: item.gainInKnowledge,
      Suggestions: item.suggestionToImprove,
      OtherTrainingNeeds: item.ifSoPleaseSpecify,
    }));

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Training Feedback Report"
    );
    XLSX.writeFile(workbook, "Training_Feedback_Report.xlsx");
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="report-page">
      <h1 className="report-title">
        Training Feedback Report
      </h1>

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
          <div style={{ color: "var(--color-text-secondary)", fontSize: "16px", fontWeight: "500" }}>Fetching Training Feedback records...</div>
        </SpinnerContainer>
      ) : filteredData.length > 0 ? (
        <>
          <div className="report-table-wrap" ref={tableRef}>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Training Topic</th>
                  <th>Duration (Hrs)</th>
                  <th>Trainer Name</th>
                  <th colSpan="3">Details of Training Topic</th>
                  <th colSpan="2">Trainer</th>
                  <th>Audio Visual Quality (AV Method)</th>
                  <th>Knowledge Gain</th>
                  <th>Suggestions</th>
                  <th>Other Training Needs</th>
                </tr>
                <tr>
                  <th colSpan="7"></th>
                  <th>Relevance</th>
                  <th>Content</th>
                  <th>Clarity</th>
                  <th>Communication</th>
                  <th>Knowledge</th>
                  <th colSpan="4"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.selectedDate}</td>
                    <td>{item.ID}</td>
                    <td>{item.name}</td>
                    <td>{item.department}</td>
                    <td>{item.trainingTopic}</td>
                    <td>{item.duration}</td>
                    <td>{item.nameOfTheTrainer}</td>
                    <td>{item.detailsOfTrainingTopic?.relevance || ""}</td>
                    <td>{item.detailsOfTrainingTopic?.content || ""}</td>
                    <td>{item.detailsOfTrainingTopic?.clarity || ""}</td>
                    <td>{item.trainer?.communicationskill || ""}</td>
                    <td>{item.trainer?.knowledge || ""}</td>
                    <td>{item.qualityOfAudioVisuals}</td>
                    <td>{item.gainInKnowledge}</td>
                    <td>{item.suggestionToImprove}</td>
                    <td>{item.ifSoPleaseSpecify}</td>
                  </tr>
                ))}
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

export default TrainingFeedbackReport;

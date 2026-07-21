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

const TrainingFeedbackReport = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const tableRef = useRef(null);
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const isViewClicked = true; // or useState(false)

  useEffect(() => {
    // Do not set today's date initially so we can see all data
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      const response = await apiRequest(`${IndicatorBaseUrl}TrainingFeedBackReport/`);
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
    };
    fetchFeedback();
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
              {filteredData.map((item, idx) => (
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
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No data available for selected dates.
        </p>
      )}
    </div>
  );
};

export default TrainingFeedbackReport;

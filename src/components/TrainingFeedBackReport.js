import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Row, Col } from "react-bootstrap";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const TrainingFeedbackReport = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const tableRef = useRef(null);

  const isViewClicked = true; // or useState(false)

  useEffect(() => {
    // Set today's date initially
    const today = dayjs().format("YYYY-MM-DD");
    setFromDate(today);
    setToDate(today);
  }, []);

  useEffect(() => {
    fetch("https://indicators.shinovadatabase.in/TrainingFeedBackReport/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        const parsedData = data.map((item) => ({
          ...item,
          detailsOfTrainingTopic: JSON.parse(item.detailsOfTrainingTopic),
          trainer: JSON.parse(item.trainer),
        }));
        setData(parsedData);
        setFilteredData(parsedData); // Optional - filtering is handled below
      })
      .catch((err) => setError(err.message));
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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Training Feedback Report
      </h2>

      {/* Date Pickers */}
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
        {isViewClicked && filteredData && filteredData.length > 0 && (
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
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Department</th>
                <th className="border px-2 py-1">Training Topic</th>
                <th className="border px-2 py-1">Duration (Hrs)</th>
                <th className="border px-2 py-1">Trainer Name</th>
                <th className="border px-2 py-1" colSpan="3">
                  Details of Training Topic
                </th>
                <th className="border px-2 py-1" colSpan="2">
                  Trainer
                </th>
                <th className="border px-2 py-1">
                  Audio Visual Quality (AV Method)
                </th>
                <th className="border px-2 py-1">Knowledge Gain</th>
                <th className="border px-2 py-1">Suggestions</th>
                <th className="border px-2 py-1">Other Training Needs</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1" colSpan="7"></th>
                <th className="border px-2 py-1">Relevance</th>
                <th className="border px-2 py-1">Content</th>
                <th className="border px-2 py-1">Clarity</th>
                <th className="border px-2 py-1">Communication</th>
                <th className="border px-2 py-1">Knowledge</th>
                <th className="border px-2 py-1" colSpan="4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.selectedDate}</td>
                  <td className="border px-2 py-1">{item.ID}</td>
                  <td className="border px-2 py-1">{item.name}</td>
                  <td className="border px-2 py-1">{item.department}</td>
                  <td className="border px-2 py-1">{item.trainingTopic}</td>
                  <td className="border px-2 py-1">{item.duration}</td>
                  <td className="border px-2 py-1">{item.nameOfTheTrainer}</td>
                  <td className="border px-2 py-1">
                    {item.detailsOfTrainingTopic.relevance}
                  </td>
                  <td className="border px-2 py-1">
                    {item.detailsOfTrainingTopic.content}
                  </td>
                  <td className="border px-2 py-1">
                    {item.detailsOfTrainingTopic.clarity}
                  </td>
                  <td className="border px-2 py-1">
                    {item.trainer.communicationskill}
                  </td>
                  <td className="border px-2 py-1">{item.trainer.knowledge}</td>
                  <td className="border px-2 py-1">
                    {item.qualityOfAudioVisuals}
                  </td>
                  <td className="border px-2 py-1">{item.gainInKnowledge}</td>
                  <td className="border px-2 py-1">
                    {item.suggestionToImprove}
                  </td>
                  <td className="border px-2 py-1">{item.ifSoPleaseSpecify}</td>
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

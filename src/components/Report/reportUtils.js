import * as XLSX from "xlsx";

export function getTransposedData(dataArray, isRawData = false) {
  const transposedData = {};
  const excludedFields = [
    "_id",
    "created_by",
    "created_date",
    "lastmodified_by",
    "lasstmodified_by", // support model field typo variation
    "lastmodified_date",
    "selectedDate",
    "ward",
    "id",
    "name"
  ];

  dataArray.forEach((data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (excludedFields.includes(key)) return;

      if (isRawData && key === "raw_data" && Array.isArray(value)) {
        value.forEach((entry) => {
          Object.entries(entry).forEach(([subKey, subValue]) => {
            const formattedSubKey = formatFieldKey(subKey);
            if (!transposedData[formattedSubKey]) {
              transposedData[formattedSubKey] = [];
            }
            transposedData[formattedSubKey].push(formatFieldValue(subKey, subValue));
          });
        });
      } else {
        const formattedKey = formatFieldKey(key);
        if (!transposedData[formattedKey]) {
          transposedData[formattedKey] = [];
        }
        transposedData[formattedKey].push(formatFieldValue(key, value));
      }
    });
  });

  return transposedData;
}

function formatFieldKey(key) {
  let formattedKey = key;
  if (key.endsWith("Insurance")) {
    formattedKey = key.replace(/Insurance$/, "").trim() + " ( Insurance )";
  } else if (key.endsWith("Pay")) {
    formattedKey = key.replace(/Pay$/, "").trim() + " ( Pay )";
  }

  return formattedKey
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatFieldValue(key, value) {
  if (key === "numberOfUnitsTransfusedRemarks") {
    let transfusionInfo = "";
    try {
      const remarksStr = value || "{}";
      const parsedRemarks = typeof remarksStr === "string"
        ? JSON.parse(remarksStr.replace(/'/g, '"'))
        : remarksStr;
      const transfusionEntries = [];
      const transfusedKeys = Object.keys(parsedRemarks).filter(
        (k) => k.startsWith("transfused-") && !k.includes("remarks")
      );
      transfusedKeys.forEach((transfusedKey) => {
        const index = transfusedKey.split("-")[1];
        const units = parsedRemarks[transfusedKey] || "";
        const remarks = parsedRemarks[`remarks-${index}`] || "";
        transfusionEntries.push(`${parseInt(index, 10) + 1} - ${units} units: ${remarks}`);
      });
      transfusionInfo = transfusionEntries.join("\n");
      if (transfusionEntries.length === 0 && parsedRemarks["transfused-0"]) {
        const units = parsedRemarks["transfused-0"];
        const remarks = parsedRemarks["remarks-0"] || "";
        transfusionInfo = `1 - ${units} units: ${remarks}`;
      }
    } catch (error) {
      console.error("Error parsing transfusion remarks:", error);
      transfusionInfo = String(value);
    }
    return transfusionInfo || "No transfusion data";
  }

  if (typeof value === "number") {
    return value;
  }

  return typeof value === "string"
    ? value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export function exportToExcel(headers, worksheetData, fileName) {
  const excelData = [headers, ...worksheetData];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, "ExportData");
  XLSX.writeFile(wb, fileName);
}

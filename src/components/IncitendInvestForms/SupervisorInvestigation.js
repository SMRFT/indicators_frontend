import React, { useState, useEffect } from "react";
import { Row, Form, Col, Card, Badge, Table, Button, Spinner, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faQuestionCircle, faFileMedical, faUserTie, faCheckDouble, faEye, faEdit, faArrowLeft, faFilter, faClipboardList, faClock, faCheckCircle, faUndo } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { message } from "antd";
import apiRequest from "../apiRequest";
import { TextField, TextAreaField, SelectField, DateField, FormAlert } from "../Common/fields";

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 250px;
  gap: 15px;
`;

const StyledContainer = styled(Container)`
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  min-height: 100vh;
  max-width: 100% !important;
  padding: 24px 32px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #2b5876, #4e4376);
  color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
  
  h2 {
    margin: 0;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  span {
    opacity: 0.9;
    font-size: 14px;
  }
`;

const SectionTitle = styled.h4`
  color: var(--color-accent-dark, #4e4376);
  border-bottom: 2px solid var(--color-border, #eef2f5);
  padding-bottom: 8px;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const KpiCard = styled.div`
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-top: 4px solid ${props => props.accentColor || "var(--color-accent-dark, #4e4376)"};
  border-radius: 12px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px -3px rgba(0, 0, 0, 0.08);
  }

  .kpi-val {
    font-size: 28px;
    font-weight: 800;
    color: var(--color-text-primary, #0f172a);
    line-height: 1.1;
  }

  .kpi-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-secondary, #64748b);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }

  .kpi-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    background: ${props => props.bgColor || "var(--color-surface-raised)"};
    color: ${props => props.iconColor || "var(--color-accent-dark)"};
  }
`;

const FilterBarCard = styled.div`
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 12px;
  padding: 20px 24px;
  margin-top: 10px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  overflow: visible;
`;

const IncidentHeaderBanner = styled.div`
  background: var(--color-surface-raised, #f8fafc);
  border: 1px solid var(--color-border, #e2e8f0);
  border-left: 5px solid var(--color-accent-dark, #4e4376);
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 24px;
  color: var(--color-text-primary, #0f172a);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
`;

const StyledButton = styled.button`
  background: var(--color-accent-dark, #4e4376);
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(78, 67, 118, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: auto;

  &:hover {
    background: #3a3258;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(78, 67, 118, 0.3);
  }

  &:disabled {
    background: #b2abbd;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.variant === "view" ? "var(--color-accent-dark, #2b5876)" : "var(--color-accent, #109b76)"};
  color: white;
  border: none;
  padding: 7px 14px;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
  box-shadow: ${props => props.variant === "view" ? "0 2px 6px rgba(43, 88, 118, 0.2)" : "0 2px 6px rgba(16, 155, 118, 0.2)"};

  &:hover {
    background: ${props => props.variant === "view" ? "#1e3c52" : "#0c7a5d"};
    transform: translateY(-1px);
    box-shadow: ${props => props.variant === "view" ? "0 4px 10px rgba(43, 88, 118, 0.3)" : "0 4px 10px rgba(16, 155, 118, 0.3)"};
  }
`;

const BackButton = styled.button`
  background: var(--color-text-muted, #6c757d);
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: auto;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: var(--color-surface, #ffffff);
  margin-bottom: 24px;
  width: 100%;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    table-layout: fixed;
  }

  thead {
    background: linear-gradient(135deg, #2b5876, #4e4376);
  }

  th {
    background: transparent;
    color: #ffffff;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.06em;
    padding: 14px 16px;
    text-align: left;
    border: none;
    white-space: nowrap;
  }

  tbody tr {
    transition: background-color 0.2s ease;
    border-bottom: 1px solid var(--color-border, #f1f5f9);

    &:nth-child(even) {
      background-color: var(--color-surface-raised, rgba(248, 250, 252, 0.6));
    }

    &:hover td {
      background-color: var(--color-surface-raised, #f1f5f9) !important;
      color: var(--color-text-primary, #0f172a) !important;
    }
  }

  td {
    padding: 14px 16px;
    color: var(--color-text-primary, #1e293b);
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
`;

const PageButton = styled.button`
  background: ${props => props.active ? "var(--color-accent-dark, #4e4376)" : "var(--color-surface, #ffffff)"};
  color: ${props => props.active ? "#ffffff" : "var(--color-text-primary, #4a5568)"};
  border: 1px solid var(--color-border, #cbd5e0);
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? "var(--color-accent-dark, #4e4376)" : "var(--color-hover-overlay, #edf2f7)"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const FormCard = styled(Card)`
  border: 1px solid var(--color-border, #edf2f7);
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
  background: var(--color-surface, #ffffff);
  color: var(--color-text-primary, #0f172a);
  border-top: 4px solid var(--color-accent-dark, #4e4376);
  
  .card-body {
    padding: 24px;
    background: var(--color-surface, #ffffff);
    color: var(--color-text-primary, #0f172a);
  }
`;

const FormCardQuality = styled(FormCard)`
  border-top: 4px solid var(--color-accent, #109b76);
`;

const FormFieldLabel = styled(Form.Label)`
  font-weight: 600;
  color: var(--color-text-primary, #4a5568);
  font-size: 14.5px;
  margin-bottom: 8px;
`;

const LockBanner = styled.div`
  background: var(--color-module-bg, #f1f5f9);
  border: 1px solid var(--color-module-border, #e2e8f0);
  border-left: 5px solid #64748b;
  border-radius: 8px;
  padding: 14px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14.5px;
  color: var(--color-text-primary, #334155);
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const WarningBanner = styled(LockBanner)`
  background: var(--color-warn-bg, #fffbeb);
  border: 1px solid var(--color-warn-border, #fef3c7);
  border-left: 5px solid #d97706;
  color: var(--color-text-primary, #92400e);
`;

const InfoCard = styled(Card)`
  background: var(--color-surface-raised, #f8f9fa);
  color: var(--color-text-primary, #0f172a);
  border: 1px solid var(--color-border, #e2e8f0);
  border-left: 5px solid var(--color-accent-dark, #4e4376);
  margin-bottom: 24px;
  border-radius: 6px;

  .card-body {
    background: var(--color-surface-raised, #f8f9fa);
    color: var(--color-text-primary, #0f172a);
  }
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid var(--color-border, #ced4da);
  background: var(--color-surface, #ffffff);
  color: var(--color-text-primary, #0f172a);
  border-radius: 6px;
  width: 100%;
  max-width: 350px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--color-accent, #4e4376);
  }
`;

const SupervisorInvestigation = () => {
  const navigate = useNavigate();
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  const userRole = localStorage.getItem("userRole") || "";

  // View state: 'list', 'view', 'edit'
  const [viewMode, setViewMode] = useState("list");
  const [incidents, setIncidents] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [classificationsList, setClassificationsList] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Search and Date filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [investigationDate, setInvestigationDate] = useState(new Date());
  const [receivedDate, setReceivedDate] = useState(new Date());
  const [verifiedDate, setVerifiedDate] = useState(new Date());

  // Form states
  const [formData, setFormData] = useState({
    why1: "", // Mapped as single RCA field
    why2: "",
    why3: "",
    why4: "",
    why5: "",
    correctiveAction: "",
    preventiveAction: "",
    investigationName: "",
    investigationSignatureEmpId: "",
    investigationDeptDesignation: "",
    correctiveName: "",
    correctiveSignatureEmpId: "",
    correctiveDeptDesignation: "",
    preventiveName: "",
    preventiveSignatureEmpId: "",
    preventiveDeptDesignation: "",
    qualityReceivedBy: "",
    qualityReceivedDeptDesignation: "",
    qualityClassification: "No harm",
    qualityRemarks: "",
    qualityVerifiedByHead: "",
    rcaImage: "",
    qualityReceivedSignatureEmpId: ""
  });

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const checkIsAssigned = (inc) => {
    if (!inc) return false;
    const currentUserId = localStorage.getItem("userId") || "";
    if (!currentUserId) return false;

    let parsedClass = {};
    if (inc.classifications) {
      if (typeof inc.classifications === "string") {
        try {
          parsedClass = JSON.parse(inc.classifications);
        } catch (e) {
          parsedClass = {};
        }
      } else {
        parsedClass = inc.classifications;
      }
    }

    return Object.entries(parsedClass).some(([catTitle, items]) => {
      if (!Array.isArray(items) || items.length === 0) return false;
      const matchedClassObj = classificationsList.find(c => c.category_key === catTitle || c.title === catTitle);
      if (!matchedClassObj) return false;

      // Check item-level first, fallback to category-level if item-level not assigned
      const itemIncharges = matchedClassObj.item_incharges || {};
      return items.some(item => {
        const assignment = itemIncharges[item] || {};
        if (assignment.incharge_id) {
          return String(assignment.incharge_id) === String(currentUserId);
        }
        return matchedClassObj.incharge_id && String(matchedClassObj.incharge_id) === String(currentUserId);
      });
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: localStorage.getItem("access_token"),
      };

      let incUrl = `${IndicatorBaseUrl}IncidentReport/`;
      let invUrl = `${IndicatorBaseUrl}SupervisorInvestigation/`;
      const params = [];
      if (fromDate) params.push(`startDate=${fromDate}`);
      if (toDate) params.push(`endDate=${toDate}`);
      if (params.length > 0) {
        incUrl += `?${params.join("&")}`;
        invUrl += `?${params.join("&")}`;
      }
      
      const [incRes, invRes, classRes] = await Promise.all([
        apiRequest(incUrl),
        apiRequest(invUrl),
        apiRequest(`${IndicatorBaseUrl}IncidentClassification/`)
      ]);

      if (incRes.success && invRes.success && classRes.success) {
        setIncidents(incRes.data);
        setInvestigations(invRes.data);
        setClassificationsList(classRes.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole && userRole !== "Admin" && userRole !== "In-Charge") {
      navigate("/IncidentDashboard");
      return;
    }
    fetchData();
  }, [IndicatorBaseUrl, fromDate, toDate, userRole]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getInvestigationForIncident = (incident) => {
    if (!incident) return null;
    return investigations.find(inv => 
      String(inv.incidentId) === String(incident.incidentNo) ||
      String(inv.incidentId) === String(incident.id)
    );
  };

  const handleView = (incident) => {
    setSelectedIncident(incident);
    setViewMode("view");
  };

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    const existing = getInvestigationForIncident(incident);
    const uRole = localStorage.getItem("userRole") || "";
    const uName = localStorage.getItem("userName") || "";
    const uId = localStorage.getItem("userId") || "";
    const isAssigned = checkIsAssigned(incident);

    if (existing) {
      setFormData({
        why1: existing.why1 || "",
        why2: "",
        why3: "",
        why4: "",
        why5: "",
        correctiveAction: existing.correctiveAction || "",
        preventiveAction: existing.preventiveAction || "",
        investigationName: existing.investigationName || (isAssigned ? uName : ""),
        investigationSignatureEmpId: existing.investigationSignatureEmpId || (isAssigned ? uId : ""),
        investigationDeptDesignation: existing.investigationDeptDesignation || "",
        correctiveName: existing.correctiveName || (isAssigned ? uName : ""),
        correctiveSignatureEmpId: existing.correctiveSignatureEmpId || (isAssigned ? uId : ""),
        correctiveDeptDesignation: existing.correctiveDeptDesignation || "",
        preventiveName: existing.preventiveName || (isAssigned ? uName : ""),
        preventiveSignatureEmpId: existing.preventiveSignatureEmpId || (isAssigned ? uId : ""),
        preventiveDeptDesignation: existing.preventiveDeptDesignation || "",
        qualityReceivedBy: existing.qualityReceivedBy || (uRole === "Admin" ? uName : ""),
        qualityReceivedDeptDesignation: existing.qualityReceivedDeptDesignation || "",
        qualityClassification: existing.qualityClassification || "No harm",
        qualityRemarks: existing.qualityRemarks || "",
        qualityVerifiedByHead: existing.qualityVerifiedByHead || (uRole === "Admin" ? uName : ""),
        rcaImage: existing.rcaImage || "",
        qualityReceivedSignatureEmpId: existing.qualityReceivedSignatureEmpId || (uRole === "Admin" ? uId : "")
      });
      setInvestigationDate(existing.investigationDateTime ? new Date(existing.investigationDateTime) : (isAssigned ? new Date() : null));
      setReceivedDate(existing.qualityReceivedDateTime ? new Date(existing.qualityReceivedDateTime) : (uRole === "Admin" ? new Date() : null));
      setVerifiedDate(existing.qualityVerifiedDateTime ? new Date(existing.qualityVerifiedDateTime) : (uRole === "Admin" ? new Date() : null));
    } else {
      setFormData({
        why1: "",
        why2: "",
        why3: "",
        why4: "",
        why5: "",
        correctiveAction: "",
        preventiveAction: "",
        investigationName: isAssigned ? uName : "",
        investigationSignatureEmpId: isAssigned ? uId : "",
        investigationDeptDesignation: "",
        correctiveName: isAssigned ? uName : "",
        correctiveSignatureEmpId: isAssigned ? uId : "",
        correctiveDeptDesignation: "",
        preventiveName: isAssigned ? uName : "",
        preventiveSignatureEmpId: isAssigned ? uId : "",
        preventiveDeptDesignation: "",
        qualityReceivedBy: uRole === "Admin" ? uName : "",
        qualityReceivedDeptDesignation: "",
        qualityClassification: "No harm",
        qualityRemarks: "",
        qualityVerifiedByHead: uRole === "Admin" ? uName : "",
        rcaImage: "",
        qualityReceivedSignatureEmpId: uRole === "Admin" ? uId : ""
      });
      setInvestigationDate(isAssigned ? new Date() : null);
      setReceivedDate(uRole === "Admin" ? new Date() : null);
      setVerifiedDate(uRole === "Admin" ? new Date() : null);
    }
    setValidated(false);
    setError("");
    setViewMode("edit");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, rcaImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const submissionData = {
        ...formData,
        incidentId: selectedIncident.incidentNo || selectedIncident.id,
        investigationDateTime: investigationDate ? investigationDate.toISOString() : "",
        correctiveDateTime: new Date().toISOString(),
        preventiveDateTime: new Date().toISOString(),
        qualityReceivedDateTime: receivedDate ? receivedDate.toISOString() : "",
        qualityVerifiedDateTime: verifiedDate ? verifiedDate.toISOString() : "",
        "auth-user-id": localStorage.getItem("userId")
      };

      const response = await apiRequest(`${IndicatorBaseUrl}SupervisorInvestigation/`, "POST", submissionData);

      if (!response.success) {
        throw new Error(response.error || "Failed to save Supervisor Investigation");
      }

      message.success("Investigation & RCA saved successfully!");
      setFormSubmitted(true);
      await fetchData();
      setTimeout(() => {
        setFormSubmitted(false);
        setViewMode("list");
      }, 1500);
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to submit the form.");
      setError(err.message || "Failed to submit the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userAssignedIncidents = incidents.filter(inc => userRole !== "In-Charge" || checkIsAssigned(inc));
  
  const totalCount = userAssignedIncidents.length;
  const pendingCount = userAssignedIncidents.filter(inc => {
    const inv = getInvestigationForIncident(inc);
    return !inv || !inv.why1;
  }).length;
  const investigatedCount = userAssignedIncidents.filter(inc => {
    const inv = getInvestigationForIncident(inc);
    const isVerified = inv && (inv.qualityReceivedBy || (inv.qualityClassification && inv.qualityClassification !== "No harm"));
    return inv && inv.why1 && !isVerified;
  }).length;
  const verifiedCount = userAssignedIncidents.filter(inc => {
    const inv = getInvestigationForIncident(inc);
    return inv && (inv.qualityReceivedBy || (inv.qualityClassification && inv.qualityClassification !== "No harm"));
  }).length;

  const filteredIncidents = incidents.filter(inc => {
    if (userRole === "In-Charge" && !checkIsAssigned(inc)) return false;

    const inv = getInvestigationForIncident(inc);
    const isVerified = inv && (inv.qualityReceivedBy || (inv.qualityClassification && inv.qualityClassification !== "No harm"));
    const isInvestigated = inv && inv.why1;

    if (statusFilter === "Pending" && (isInvestigated || isVerified)) return false;
    if (statusFilter === "Investigated" && (!isInvestigated || isVerified)) return false;
    if (statusFilter === "Verified" && !isVerified) return false;

    const searchLower = searchTerm.toLowerCase();
    const incidentNo = (inc.incidentNo || "").toLowerCase();
    const location = (inc.incidentLocation || "").toLowerCase();
    const patientName = (inc.patientName || "").toLowerCase();
    const employeeName = (inc.employeeName || "").toLowerCase();
    return incidentNo.includes(searchLower) ||
      location.includes(searchLower) ||
      patientName.includes(searchLower) ||
      employeeName.includes(searchLower);
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncidents = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);

  const getInvolvedPersonText = (inc) => {
    if (inc.personInvolvedType === "Patient") {
      return `Patient: ${inc.patientName || "-"}`;
    } else if (inc.personInvolvedType === "Employee") {
      return `Employee: ${inc.employeeName || "-"}`;
    } else if (inc.personInvolvedType === "Instrument/Tools") {
      return `Instrument/Tools: ${inc.instrumentToolsDetails || "-"}`;
    } else {
      return `Others: ${inc.personInvolvedOthersDetails || "-"}`;
    }
  };

  const renderAllIncidentDetails = (incident) => {
    if (!incident) return null;

    let parsedClass = {};
    if (incident.classifications) {
      if (typeof incident.classifications === "string") {
        try {
          parsedClass = JSON.parse(incident.classifications);
        } catch (e) {
          parsedClass = {};
        }
      } else {
        parsedClass = incident.classifications;
      }
    }

    const classEntries = Object.entries(parsedClass).filter(
      ([_, items]) => Array.isArray(items) && items.length > 0
    );

    return (
      <InfoCard className="mb-4">
        <Card.Body>
          <h5 className="border-bottom pb-2 mb-3" style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-accent-dark, #4e4376)" }}>General Information</h5>
          <Row className="mb-3">
            <Col md={3}><strong>Incident No:</strong><br /> {incident.incidentNo || "-"}</Col>
            <Col md={3}><strong>Date & Time:</strong><br /> {incident.incidentDate} at {incident.incidentTime}</Col>
            <Col md={3}><strong>Location:</strong><br /> {incident.incidentLocation}</Col>
            <Col md={3}><strong>Witness Name:</strong><br /> {incident.witnessName || "-"}</Col>
          </Row>

          <h5 className="border-bottom pb-2 mb-3 mt-3" style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-accent-dark, #4e4376)" }}>Involved Person Details</h5>
          {incident.personInvolvedType === "Patient" && (
            <Row className="mb-3">
              <Col md={3}><strong>Patient Name:</strong><br /> {incident.patientName || "-"}</Col>
              <Col md={3}><strong>Age / Sex:</strong><br /> {incident.patientAgeSex || "-"}</Col>
              <Col md={2}><strong>UHID:</strong><br /> {incident.patientUhid || "-"}</Col>
              <Col md={2}><strong>MR No:</strong><br /> {incident.mrNo || "-"}</Col>
              <Col md={2}><strong>Doctor:</strong><br /> {incident.patientDoctor || "-"}</Col>
            </Row>
          )}
          {incident.personInvolvedType === "Employee" && (
            <Row className="mb-3">
              <Col md={3}><strong>Employee Name:</strong><br /> {incident.employeeName || "-"}</Col>
              <Col md={2}><strong>Age / Sex:</strong><br /> {incident.employeeAgeSex || "-"}</Col>
              <Col md={2}><strong>Designation:</strong><br /> {incident.designation || "-"}</Col>
              <Col md={2}><strong>Employee ID:</strong><br /> {incident.idNo || "-"}</Col>
              <Col md={3}><strong>Department:</strong><br /> {incident.employeeDept || "-"}</Col>
            </Row>
          )}
          {incident.personInvolvedType === "Instrument/Tools" && (
            <Row className="mb-3">
              <Col md={12}><strong>Instrument/Tools Details:</strong><br /> {incident.instrumentToolsDetails || "-"}</Col>
            </Row>
          )}
          {incident.personInvolvedType === "Others" && (
            <Row className="mb-3">
              <Col md={12}><strong>Specify Details:</strong><br /> {incident.personInvolvedOthersDetails || "-"}</Col>
            </Row>
          )}

          <h5 className="border-bottom pb-2 mb-3 mt-3" style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-accent-dark, #4e4376)" }}>Classifications</h5>
          <div className="p-2 border rounded mb-3" style={{ backgroundColor: "var(--color-surface, #ffffff)", color: "var(--color-text-primary)", borderColor: "var(--color-border)" }}>
            {classEntries.length === 0 ? (
              <span style={{ color: "var(--color-text-muted)" }}>No classifications selected.</span>
            ) : (
              classEntries.map(([category, items]) => (
                <div key={category} className="mb-1" style={{ fontSize: "14px" }}>
                  <strong>{category}:</strong> <span style={{ color: "var(--color-text-secondary)" }}>{items.join(", ")}</span>
                </div>
              ))
            )}
          </div>

          <h5 className="border-bottom pb-2 mb-3 mt-3" style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-accent-dark, #4e4376)" }}>Description of Incident</h5>
          <p className="p-2 border rounded mb-3" style={{ backgroundColor: "var(--color-surface, #ffffff)", color: "var(--color-text-primary)", borderColor: "var(--color-border)", whiteSpace: "pre-wrap" }}>{incident.descriptionOfIncident}</p>

          <h5 className="border-bottom pb-2 mb-3 mt-3" style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-accent-dark, #4e4376)" }}>Immediate Correction Taken</h5>
          <p className="p-2 border rounded mb-2" style={{ backgroundColor: "var(--color-surface, #ffffff)", color: "var(--color-text-primary)", borderColor: "var(--color-border)", whiteSpace: "pre-wrap" }}>{incident.immediateCorrection || "No immediate correction documented."}</p>
          <Row className="mb-3">
            <Col md={4}><strong>Actioned By:</strong><br /> {incident.correctionName || "-"}</Col>
            <Col md={4}><strong>Designation (ID):</strong><br /> {incident.correctionDesignation || "-"} ({incident.correctionEmpId || "-"})</Col>
            <Col md={4}><strong>Date & Time:</strong><br /> {incident.correctionDateTime ? dayjs(incident.correctionDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
          </Row>

          <h5 className="border-bottom pb-2 mb-3 mt-3" style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-accent-dark, #4e4376)" }}>Reported By Details</h5>
          <Row>
            <Col md={4}><strong>Reporter Name:</strong><br /> {incident.reportedBy || "-"}</Col>
            <Col md={4}><strong>Designation (ID):</strong><br /> {incident.reportedByDesignation || "-"} ({incident.reportedByEmpId || "-"})</Col>
            <Col md={4}><strong>Date & Time:</strong><br /> {incident.reportedByDateTime ? dayjs(incident.reportedByDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
          </Row>
        </Card.Body>
      </InfoCard>
    );
  };

  return (
    <StyledContainer>
      {viewMode === "list" && (
        <>
          <div className="d-flex align-items-center mb-3">
            <BackButton
              onClick={() => navigate("/IncidentDashboard")}
              className="me-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </BackButton>
          </div>

          <FormHeader>
            <h2>SUPERVISOR INVESTIGATION &amp; ROOT CAUSE ANALYSIS</h2>
            <span>Shanmuga Hospital Quality Department</span>
          </FormHeader>

          {/* Top KPI Metric Analytics */}
          <Row className="g-3 mb-4">
            <Col xs={12} sm={6} lg={3}>
              <KpiCard onClick={() => setStatusFilter("All")} accentColor="var(--color-accent-dark, #4e4376)">
                <div>
                  <div className="kpi-val">{totalCount}</div>
                  <div className="kpi-title">Total Incidents</div>
                </div>
                <div className="kpi-icon" bgColor="rgba(78, 67, 118, 0.1)" iconColor="var(--color-accent-dark, #4e4376)">
                  <FontAwesomeIcon icon={faClipboardList} />
                </div>
              </KpiCard>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <KpiCard onClick={() => setStatusFilter("Pending")} accentColor="#f59e0b">
                <div>
                  <div className="kpi-val">{pendingCount}</div>
                  <div className="kpi-title">Pending RCA</div>
                </div>
                <div className="kpi-icon" bgColor="rgba(245, 158, 11, 0.12)" iconColor="#d97706">
                  <FontAwesomeIcon icon={faClock} />
                </div>
              </KpiCard>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <KpiCard onClick={() => setStatusFilter("Investigated")} accentColor="#6366f1">
                <div>
                  <div className="kpi-val">{investigatedCount}</div>
                  <div className="kpi-title">Investigated</div>
                </div>
                <div className="kpi-icon" bgColor="rgba(99, 102, 241, 0.12)" iconColor="#4f46e5">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </div>
              </KpiCard>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <KpiCard onClick={() => setStatusFilter("Verified")} accentColor="#109b76">
                <div>
                  <div className="kpi-val">{verifiedCount}</div>
                  <div className="kpi-title">Verified Quality</div>
                </div>
                <div className="kpi-icon" bgColor="rgba(16, 155, 118, 0.12)" iconColor="#109b76">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
              </KpiCard>
            </Col>
          </Row>

          {/* Search, Filter & Date Bar */}
          <FilterBarCard>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={4}>
                <Form.Group controlId="searchBar">
                  <FormFieldLabel><FontAwesomeIcon icon={faSearch} /> Search Incidents:</FormFieldLabel>
                  <TextField
                    type="text"
                    placeholder="Search by Inc No, location, name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group controlId="statusFilter">
                  <FormFieldLabel><FontAwesomeIcon icon={faFilter} /> Status Filter:</FormFieldLabel>
                  <SelectField
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses ({totalCount})</option>
                    <option value="Pending">Pending RCA ({pendingCount})</option>
                    <option value="Investigated">Investigated ({investigatedCount})</option>
                    <option value="Verified">Verified ({verifiedCount})</option>
                  </SelectField>
                </Form.Group>
              </Col>

              <Col xs={6} md={2}>
                <Form.Group controlId="fromDate">
                  <FormFieldLabel>From Date:</FormFieldLabel>
                  <TextField
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={2}>
                <Form.Group controlId="toDate">
                  <FormFieldLabel>To Date:</FormFieldLabel>
                  <TextField
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={1} className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setFromDate(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
                    setToDate(dayjs().format("YYYY-MM-DD"));
                  }}
                  title="Reset Filters"
                  style={{ height: "42px", width: "100%" }}
                >
                  <FontAwesomeIcon icon={faUndo} />
                </Button>
              </Col>
            </Row>
          </FilterBarCard>

          <SectionTitle>
            <FontAwesomeIcon icon={faClipboardList} /> Incident Investigation Records
          </SectionTitle>

          {loading ? (
            <SpinnerContainer>
              <Spinner animation="border" role="status" style={{ width: "3rem", height: "3rem", color: "#2b5876" }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <div style={{ color: "#718096", fontSize: "16px", fontWeight: "500" }}>Fetching incident records...</div>
            </SpinnerContainer>
          ) : (
            <>
              <TableContainer>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Incident No</th>
                      <th style={{ width: "18%" }}>Date / Time</th>
                      <th style={{ width: "16%" }}>Location</th>
                      <th style={{ width: "22%" }}>Involved Person</th>
                      <th style={{ width: "13%" }}>Status</th>
                      <th style={{ width: "16%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentIncidents.length > 0 ? (
                      currentIncidents.map((inc, idx) => {
                        const inv = getInvestigationForIncident(inc);
                        return (
                          <tr key={inc.incidentNo || inc.id || idx}>
                            <td style={{ fontWeight: 700, color: "var(--color-accent-dark, #2b5876)" }}>{inc.incidentNo || "-"}</td>
                            <td>{inc.incidentDate} {inc.incidentTime}</td>
                            <td>{inc.incidentLocation}</td>
                            <td>{getInvolvedPersonText(inc)}</td>
                            <td>
                              {(() => {
                                if (!inv) {
                                  return (
                                    <Badge bg="warning" text="dark" style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "20px", fontWeight: "600" }}>
                                      ⏳ Pending
                                    </Badge>
                                  );
                                }
                                const isVerified = inv.qualityReceivedBy || (inv.qualityClassification && inv.qualityClassification !== "No harm");
                                if (isVerified) {
                                  return (
                                    <Badge bg="success" style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "20px", fontWeight: "600" }}>
                                      ✔ Verified
                                    </Badge>
                                  );
                                }
                                if (inv.why1) {
                                  return (
                                    <Badge style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "20px", fontWeight: "600", background: "var(--color-accent-dark, #4e4376)", color: "white" }}>
                                      🔍 Investigated
                                    </Badge>
                                  );
                                }
                                return (
                                  <Badge bg="warning" text="dark" style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "20px", fontWeight: "600" }}>
                                    ⏳ Pending
                                  </Badge>
                                );
                              })()}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-1">
                                <ActionButton variant="view" onClick={() => handleView(inc)}>
                                  <FontAwesomeIcon icon={faEye} /> View
                                </ActionButton>
                                <ActionButton variant="edit" onClick={() => handleEdit(inc)}>
                                  <FontAwesomeIcon icon={faEdit} /> Update
                                </ActionButton>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No incidents found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </TableContainer>

              {filteredIncidents.length > 0 && (
                <PaginationContainer>
                  <div style={{ color: "#718096", fontSize: "14px" }}>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredIncidents.length)} of {filteredIncidents.length} records
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
                        return <span key={page} style={{ padding: "6px 8px", color: "#a0aec0" }}>...</span>;
                      }
                      return null;
                    })}
                    <PageButton 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </PageButton>
                    <PageButton 
                      onClick={() => setCurrentPage(totalPages)} 
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </PageButton>
                  </div>
                </PaginationContainer>
              )}
            </>
          )}
        </>
      )}

      {viewMode === "view" && selectedIncident && (
        <>
          <div className="mb-3">
            <BackButton onClick={() => setViewMode("list")}>
              ← Back to List
            </BackButton>
          </div>

          <FormHeader>
            <h2>VIEW INCIDENT REPORT & RCA</h2>
            <span>CONFIDENTIAL • ID: {selectedIncident.incidentNo || "Pending"}</span>
          </FormHeader>

          <SectionTitle>
            <FontAwesomeIcon icon={faQuestionCircle} /> Incident Details
          </SectionTitle>
          {renderAllIncidentDetails(selectedIncident)}

          <SectionTitle>
            <FontAwesomeIcon icon={faFileMedical} /> Root Cause Analysis & Actions
          </SectionTitle>
          {getInvestigationForIncident(selectedIncident) ? (
            (() => {
              const inv = getInvestigationForIncident(selectedIncident);
              return (
                <FormCard className="mb-4">
                  <Card.Body>
                    <div className="mb-4">
                      <h6 className="border-bottom pb-2" style={{ fontWeight: "600", color: "var(--color-text-secondary)" }}>Investigator Details</h6>
                      <Row>
                        <Col md={4}><strong>In-Charge / Investigator Name:</strong><br /> {inv.investigationName || "-"}</Col>
                        <Col md={4}><strong>Employee ID:</strong><br /> {inv.investigationSignatureEmpId || "-"}</Col>
                        <Col md={4}><strong>Dept / Designation:</strong><br /> {inv.investigationDeptDesignation || "-"}</Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md={12}><strong>Investigation Date & Time:</strong><br /> {inv.investigationDateTime ? dayjs(inv.investigationDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                      </Row>
                    </div>

                    <div className="mb-3">
                      <strong>Root Cause Analysis (RCA):</strong>
                      <p className="p-3 rounded mt-1" style={{ backgroundColor: "var(--color-surface-raised, #f8f9fa)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}>{inv.why1 || "No details provided."}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Corrective Action (by Dept Incharge):</strong>
                      <p className="p-3 rounded mt-1" style={{ backgroundColor: "var(--color-surface-raised, #f8f9fa)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}>{inv.correctiveAction || "No details provided."}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Preventive Action (by HOD):</strong>
                      <p className="p-3 rounded mt-1" style={{ backgroundColor: "var(--color-surface-raised, #f8f9fa)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}>{inv.preventiveAction || "No details provided."}</p>
                    </div>
                    {inv.qualityClassification && (
                      <div className="mt-4 border-top pt-3">
                        <h6 className="mb-3" style={{ fontWeight: "600", color: "var(--color-accent-dark, #4e4376)" }}>Quality Department Review</h6>
                        <Row className="mb-3">
                          <Col md={3}><strong>Received By:</strong><br />{inv.qualityReceivedBy || "-"}</Col>
                          <Col md={3}><strong>Employee ID:</strong><br />{inv.qualityReceivedSignatureEmpId || "-"}</Col>
                          <Col md={3}><strong>Dept & Designation:</strong><br />{inv.qualityReceivedDeptDesignation || "-"}</Col>
                          <Col md={3}><strong>Received Date & Time:</strong><br />{inv.qualityReceivedDateTime ? dayjs(inv.qualityReceivedDateTime).format("DD/MM/YYYY hh:mm A") : "-"}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col md={6}><strong>Quality Classification:</strong><br /><Badge bg="info" className="px-2 py-1">{inv.qualityClassification}</Badge></Col>
                          <Col md={6}><strong>Verified By (Quality Head):</strong><br />{inv.qualityVerifiedByHead || "-"}</Col>
                        </Row>
                        {inv.qualityVerifiedDateTime && (
                          <Row className="mb-3">
                            <Col md={12}><strong>Verified Date & Time:</strong><br />{dayjs(inv.qualityVerifiedDateTime).format("DD/MM/YYYY hh:mm A")}</Col>
                          </Row>
                        )}
                        {inv.qualityRemarks && (
                          <div className="mb-3">
                            <strong>Quality Remarks:</strong>
                            <p className="p-3 rounded mt-1" style={{ backgroundColor: "var(--color-surface-raised, #f8f9fa)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}>{inv.qualityRemarks}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </FormCard>
              );
            })()
          ) : (
            <FormAlert variant="info">No Supervisor Investigation or RCA has been submitted yet for this incident report.</FormAlert>
          )}

          <div className="text-center">
            <BackButton onClick={() => setViewMode("list")}>Back to List</BackButton>
          </div>
        </>
      )}

      {viewMode === "edit" && selectedIncident && (
        <>
          <div className="mb-3">
            <BackButton onClick={() => setViewMode("list")}>
              <FontAwesomeIcon icon={faArrowLeft} /> Cancel
            </BackButton>
          </div>

          <FormHeader>
            <h2>ROOT CAUSE ANALYSIS (RCA) FORM</h2>
            <span>CONFIDENTIAL • SP Medifort Hospital Quality Department</span>
          </FormHeader>

          <IncidentHeaderBanner>
            <Row className="align-items-center">
              <Col md={3}>
                <strong>Incident No:</strong><br />
                <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-accent-dark, #4e4376)" }}>
                  {selectedIncident.incidentNo || "-"}
                </span>
              </Col>
              <Col md={3}>
                <strong>Incident Date &amp; Time:</strong><br />
                <span>{selectedIncident.incidentDate} at {selectedIncident.incidentTime}</span>
              </Col>
              <Col md={3}>
                <strong>Location:</strong><br />
                <span>{selectedIncident.incidentLocation}</span>
              </Col>
              <Col md={3}>
                <strong>Involved Person:</strong><br />
                <span>{getInvolvedPersonText(selectedIncident)}</span>
              </Col>
            </Row>
          </IncidentHeaderBanner>

          {/* Incident Details Overview (Read-Only) */}
          <SectionTitle>
            <FontAwesomeIcon icon={faSearch} /> Incident Overview (Read-Only)
          </SectionTitle>
          {renderAllIncidentDetails(selectedIncident)}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Notice for non-assigned users */}
            {!checkIsAssigned(selectedIncident) && (
              <LockBanner>
                <span style={{ fontSize: "18px" }}>🔒</span>
                <span>
                  You are not the assigned In-charge for this incident's Classification Item.
                  The Root Cause Analysis (RCA) section is read-only.
                </span>
              </LockBanner>
            )}

            {/* Root Cause Analysis Section Card */}
            <FormCard>
              <Card.Body>
                <SectionTitle style={{ marginTop: 0 }}>
                  <FontAwesomeIcon icon={faQuestionCircle} /> Root Cause Analysis (RCA)
                </SectionTitle>
                <Form.Group className="mb-4" controlId="why1">
                  <FormFieldLabel>Identify the root cause of the incident:</FormFieldLabel>
                  <TextAreaField
                    rows={6}
                    style={{ width: "100%", minHeight: "150px" }}
                    name="why1"
                    value={formData.why1}
                    onChange={handleInputChange}
                    required={checkIsAssigned(selectedIncident)}
                    disabled={!checkIsAssigned(selectedIncident)}
                    placeholder="Describe the root cause analysis..."
                  />
                </Form.Group>

                <Row>
                  <Col md={3}>
                    <Form.Group controlId="investigationName">
                      <FormFieldLabel>Investigator Name:</FormFieldLabel>
                      <TextField
                        type="text"
                        name="investigationName"
                        value={formData.investigationName}
                        onChange={handleInputChange}
                        required={checkIsAssigned(selectedIncident)}
                        disabled={!checkIsAssigned(selectedIncident)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="investigationSignatureEmpId">
                      <FormFieldLabel>Investigator Emp ID:</FormFieldLabel>
                      <TextField
                        type="text"
                        name="investigationSignatureEmpId"
                        value={formData.investigationSignatureEmpId}
                        onChange={handleInputChange}
                        required={checkIsAssigned(selectedIncident)}
                        disabled={!checkIsAssigned(selectedIncident)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="investigationDeptDesignation">
                      <FormFieldLabel>Investigator Dept/Designation:</FormFieldLabel>
                      <TextField
                        type="text"
                        name="investigationDeptDesignation"
                        value={formData.investigationDeptDesignation}
                        onChange={handleInputChange}
                        disabled={!checkIsAssigned(selectedIncident)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="investigationDate">
                      <FormFieldLabel className="d-block">Date & Time Received:</FormFieldLabel>
                      <DateField
                        selected={investigationDate}
                        onChange={(date) => setInvestigationDate(date)}
                        className="form-control"
                        showTimeSelect
                        dateFormat="dd/MM/yyyy h:mm aa"
                        disabled={!checkIsAssigned(selectedIncident)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </FormCard>

            {/* Corrective Action Card */}
            <FormCard>
              <Card.Body>
                <SectionTitle style={{ marginTop: 0 }}>
                  <FontAwesomeIcon icon={faFileMedical} /> Corrective Action By Department Incharge
                </SectionTitle>
                <Form.Group controlId="correctiveAction">
                  <FormFieldLabel>Corrective Action taken:</FormFieldLabel>
                  <TextAreaField
                    rows={5}
                    style={{ width: "100%", minHeight: "130px" }}
                    name="correctiveAction"
                    value={formData.correctiveAction}
                    onChange={handleInputChange}
                    required={checkIsAssigned(selectedIncident)}
                    disabled={!checkIsAssigned(selectedIncident)}
                    placeholder="Immediate fixes applied..."
                  />
                </Form.Group>
              </Card.Body>
            </FormCard>

            {/* Preventive Action Card */}
            <FormCard>
              <Card.Body>
                <SectionTitle style={{ marginTop: 0 }}>
                  <FontAwesomeIcon icon={faUserTie} /> Preventive Action By Head of the Department
                </SectionTitle>
                <Form.Group controlId="preventiveAction">
                  <FormFieldLabel>Preventive Action plan:</FormFieldLabel>
                  <TextAreaField
                    rows={5}
                    style={{ width: "100%", minHeight: "130px" }}
                    name="preventiveAction"
                    value={formData.preventiveAction}
                    onChange={handleInputChange}
                    required={checkIsAssigned(selectedIncident)}
                    disabled={!checkIsAssigned(selectedIncident)}
                    placeholder="Procedures implemented to prevent recurrence..."
                  />
                </Form.Group>
              </Card.Body>
            </FormCard>

            {/* Quality Department Card */}
            <FormCardQuality>
              <Card.Body>
                <SectionTitle style={{ marginTop: 0, color: "#109b76" }}>
                  <FontAwesomeIcon icon={faCheckDouble} /> To Be Filled By Quality Department
                </SectionTitle>

                {/* Notice for In-Charge users */}
                {userRole === "In-Charge" && (
                  <WarningBanner>
                    <span style={{ fontSize: "18px" }}>🔒</span>
                    <span>
                      This section is reserved for the <strong>Quality Department (Admin)</strong> only.
                      Your investigation input above has been submitted — no action required here.
                    </span>
                  </WarningBanner>
                )}

                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group controlId="qualityReceivedBy">
                      <FormFieldLabel>Received By (Name):</FormFieldLabel>
                      <TextField
                        type="text"
                        name="qualityReceivedBy"
                        value={formData.qualityReceivedBy}
                        onChange={handleInputChange}
                        disabled={userRole !== "Admin"}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="qualityReceivedSignatureEmpId">
                      <FormFieldLabel>Employee ID:</FormFieldLabel>
                      <TextField
                        type="text"
                        name="qualityReceivedSignatureEmpId"
                        value={formData.qualityReceivedSignatureEmpId}
                        onChange={handleInputChange}
                        disabled={userRole !== "Admin"}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="qualityReceivedDeptDesignation">
                      <FormFieldLabel>Dept & Designation:</FormFieldLabel>
                      <TextField
                        type="text"
                        name="qualityReceivedDeptDesignation"
                        value={formData.qualityReceivedDeptDesignation}
                        onChange={handleInputChange}
                        disabled={userRole !== "Admin"}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="receivedDate">
                      <FormFieldLabel className="d-block">Date & Time Received:</FormFieldLabel>
                      <DateField
                        selected={receivedDate}
                        onChange={(date) => setReceivedDate(date)}
                        className="form-control"
                        showTimeSelect
                        dateFormat="dd/MM/yyyy h:mm aa"
                        disabled={userRole !== "Admin"}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="qualityClassification">
                      <FormFieldLabel>Classification of Incident:</FormFieldLabel>
                      <SelectField
                        name="qualityClassification"
                        value={formData.qualityClassification}
                        onChange={handleInputChange}
                        disabled={userRole !== "Admin"}
                      >
                        <option value="No harm">No harm</option>
                        <option value="Near Miss">Near Miss</option>
                        <option value="Adverse Event">Adverse Event</option>
                        <option value="Sentinel Event">Sentinel Event</option>
                      </SelectField>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="qualityVerifiedByHead">
                      <FormFieldLabel>Verified By Quality Head (Name):</FormFieldLabel>
                      <TextField
                        type="text"
                        name="qualityVerifiedByHead"
                        value={formData.qualityVerifiedByHead}
                        onChange={handleInputChange}
                        disabled={userRole !== "Admin"}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="qualityRemarks">
                  <FormFieldLabel>Remarks (if any):</FormFieldLabel>
                  <TextAreaField
                    rows={4}
                    style={{ width: "100%", minHeight: "110px" }}
                    name="qualityRemarks"
                    value={formData.qualityRemarks}
                    onChange={handleInputChange}
                    placeholder="Add quality department review comments..."
                    disabled={userRole !== "Admin"}
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group controlId="verifiedDate">
                      <FormFieldLabel className="d-block">Verification Date & Time:</FormFieldLabel>
                      <DateField
                        selected={verifiedDate}
                        onChange={(date) => setVerifiedDate(date)}
                        className="form-control"
                        showTimeSelect
                        dateFormat="dd/MM/yyyy h:mm aa"
                        disabled={userRole !== "Admin"}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </FormCardQuality>

            <div className="text-center mt-4 d-flex justify-content-center gap-3">
              <BackButton type="button" onClick={() => setViewMode("list")}>
                Cancel
              </BackButton>
              <StyledButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save RCA / Action Plan"}
              </StyledButton>
            </div>

            <FormAlert variant="success" show={formSubmitted} className="mt-3">
              Supervisor root cause analysis saved successfully!
            </FormAlert>

            {error && (
              <FormAlert variant="danger" className="mt-3">
                {error}
              </FormAlert>
            )}
          </Form>
        </>
      )}
    </StyledContainer>
  );
};

export default SupervisorInvestigation;

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Row, Form, Col, Alert, Card, Tab, Nav, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faUserShield, faFileAlt, faArrowLeft, faSave, faUserCheck, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { message } from "antd";
import apiRequest from "../apiRequest";
import { TextField, SelectField, FormAlert } from "../Common/fields";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 30px;
  max-width: 1300px;
  background: #fdfdfd;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #109b76, #0c7a5d);
  color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  
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
  color: #109b76;
  border-bottom: 2px solid #eef2f5;
  padding-bottom: 8px;
  margin-top: 15px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledButton = styled.button`
  background: #109b76;
  color: white;
  border: none;
  padding: 8px 18px;
  font-size: 14.5px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 155, 118, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  width: auto;

  &:hover {
    background: #0c7a5d;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 155, 118, 0.3);
  }

  &:disabled {
    background: #a5d3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SaveItemButton = styled.button`
  background: #0d6efd;
  color: white;
  border: none;
  padding: 6px 14px;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  height: 34px;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.15);

  &:hover {
    background: #0b5ed7;
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(13, 110, 253, 0.25);
  }
  &:disabled {
    background: #9ec5fe;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DangerButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 18px;
  font-size: 14.5px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  width: auto;

  &:hover {
    background: #bd2130;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(220, 53, 69, 0.3);
  }
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 18px;
  font-size: 14.5px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  width: auto;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
  }
`;

const TabContainer = styled.div`
  margin-bottom: 30px;
  
  .nav-tabs {
    border-bottom: 2px solid #eef2f5;
  }
  
  .nav-link {
    color: #495057;
    font-weight: 600;
    border: none;
    padding: 12px 20px;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: transparent;
      color: #109b76;
    }
    
    &.active {
      color: #109b76;
      background-color: transparent;
      border-bottom: 3px solid #109b76;
    }
  }
`;

const ItemBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: #eef2f5;
  color: #334155;
  padding: 6px 12px;
  border-radius: 20px;
  margin: 4px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #cbd5e1;

  svg {
    margin-left: 8px;
    color: #94a3b8;
    cursor: pointer;
    &:hover {
      color: #ef4444;
    }
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  background: white;
  margin-bottom: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
    padding: 12px 16px;
    text-align: left;
    white-space: nowrap;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #edf2f7;
    color: #2d3748;
    white-space: nowrap;
  }

  tr:hover {
    background-color: #f8fafc;
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
  background: ${props => props.active ? "#109b76" : "white"};
  color: ${props => props.active ? "white" : "#4a5568"};
  border: 1px solid #cbd5e0;
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  width: auto;
  height: auto;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? "#109b76" : "#edf2f7"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CategoryHeader = styled.tr`
  background: linear-gradient(135deg, #109b76 0%, #0c7a5d 100%) !important;
  color: white !important;
  td, th {
    color: white !important;
    font-weight: 700;
    font-size: 14px;
    padding: 10px 14px !important;
    border-color: #0a6a50 !important;
  }
`;

const ItemRow = styled.tr`
  &:hover {
    background: #f0faf6 !important;
  }
`;

const AllocatedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #d1fae5;
  color: #065f46;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #6ee7b7;
`;

const UnallocatedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #fef3c7;
  color: #92400e;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #fcd34d;
`;

const TableFormSelect = styled(SelectField)`
  border: 1px solid #cbd5e1 !important;
  border-radius: 6px !important;
  padding: 6px 12px !important;
  font-size: 13.5px !important;
  transition: all 0.2s ease-in-out !important;
  width: 100% !important;
  max-width: 260px !important;
  height: auto !important;

  &:focus {
    border-color: #109b76 !important;
    box-shadow: 0 0 0 3px rgba(16, 155, 118, 0.15) !important;
  }
`;

const IncidentClassificationManager = () => {
  const navigate = useNavigate();
  const IndicatorBaseUrl = process.env.REACT_APP_BACKEND_INDICATORS_BASE_URL;
  
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  
  const [classifications, setClassifications] = useState([]);
  const [incharges, setIncharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Create / Edit state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [items, setItems] = useState([]);

  // Per-item saving state: { "clsId:itemText": true/false }
  const [savingItemKey, setSavingItemKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [classifications.length]);

  useEffect(() => {
    if (userRole !== "Admin") {
      setError("Access denied. Only administrators can access this page.");
      setTimeout(() => navigate("/IncidentDashboard"), 3000);
      return;
    }
    fetchData();
  }, [userRole]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [classRes, inchargesRes] = await Promise.all([
        apiRequest(`${IndicatorBaseUrl}IncidentClassification/`),
        apiRequest(`${IndicatorBaseUrl}get_incharges/`)
      ]);
 
      if (!classRes.success || !inchargesRes.success) {
        throw new Error(classRes.error || inchargesRes.error || "Failed to fetch classification or in-charge data");
      }
 
      const classData = classRes.data;
      const inchData = inchargesRes.data;
      
      setClassifications(classData);
      setIncharges(inchData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data from database.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    if (items.includes(newItemText.trim())) {
      message.warning("This item already exists in the list.");
      return;
    }
    setItems([...items, newItemText.trim()]);
    setNewItemText("");
  };

  const handleRemoveItem = (indexToRemove) => {
    setItems(items.filter((_, idx) => idx !== indexToRemove));
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setTitle(cls.title);
    setItems(cls.items || []);
    setError("");
    setSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setItems([]);
    setNewItemText("");
  };

  const handleSaveClassification = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      message.warning("Title is required.");
      return;
    }
    if (items.length === 0) {
      message.warning("At least one classification item is required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload = {
        title: title.trim(),
        items: items,
        "auth-user-id": userId
      };

      if (editingId) {
        payload.id = editingId;
      }

      const response = await apiRequest(`${IndicatorBaseUrl}IncidentClassification/`, "POST", payload);
 
      if (!response.success) {
        throw new Error(response.error || "Failed to save classification");
      }

      const msg = editingId ? "Classification updated successfully!" : "Classification created successfully!";
      message.success(msg);
      setSuccessMsg(msg);
      handleCancelEdit();
      await fetchData();
    } catch (err) {
      console.error(err);
      message.error(err.message || "An error occurred while saving.");
      setError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this classification?")) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await apiRequest(`${IndicatorBaseUrl}IncidentClassification/?id=${id}`, "DELETE");
 
      if (!response.success) {
        throw new Error(response.error || "Failed to delete classification");
      }

      message.success("Classification deleted successfully!");
      setSuccessMsg("Classification deleted successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      message.error(err.message || "An error occurred while deleting.");
      setError(err.message || "An error occurred while deleting.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Allocate in-charge for a single classification ITEM within a category.
   * Merges the new assignment into the category's item_incharges map and saves.
   */
  const handleAllocateItemIncharge = async (cls, itemText, inchargeId, inchargeName) => {
    const key = `${cls.id}:${itemText}`;
    setSavingItemKey(key);
    setError("");
    try {
      // Build updated item_incharges for this category
      const existingItemIncharges = cls.item_incharges || {};
      const updatedItemIncharges = {
        ...existingItemIncharges,
        [itemText]: {
          incharge_id: inchargeId,
          incharge_name: inchargeName
        }
      };

      const payload = {
        id: cls.id,
        item_incharges: updatedItemIncharges,
        "auth-user-id": userId
      };

      const response = await apiRequest(`${IndicatorBaseUrl}IncidentClassification/`, "POST", payload);
 
      if (!response.success) {
        throw new Error(response.error || "Failed to allocate In-charge");
      }

      message.success(`In-charge allocated to "${itemText}" successfully!`);
      await fetchData();
    } catch (err) {
      console.error(err);
      message.error(err.message || "An error occurred while allocating.");
      setError(err.message || "An error occurred while allocating.");
    } finally {
      setSavingItemKey(null);
    }
  };

  if (userRole !== "Admin") {
    return (
      <StyledContainer className="mt-5">
        <FormAlert variant="danger">{error || "Access Denied."}</FormAlert>
      </StyledContainer>
    );
  }

  // Summary: count how many items are allocated across all categories
  const totalItems = classifications.reduce((sum, cls) => sum + (cls.items ? cls.items.length : 0), 0);
  const allocatedItems = classifications.reduce((sum, cls) => {
    const itemIncharges = cls.item_incharges || {};
    const allocated = (cls.items || []).filter(item => itemIncharges[item] && itemIncharges[item].incharge_id).length;
    return sum + allocated;
  }, 0);

  const flatAllocations = [];
  classifications.forEach((cls) => {
    const clsItems = cls.items || [];
    clsItems.forEach((item) => {
      flatAllocations.push({
        cls: cls,
        item: item
      });
    });
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(flatAllocations.length / itemsPerPage);
  const currentAllocations = flatAllocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportAllocationExcel = () => {
    const exportData = flatAllocations.map(({ cls, item }) => {
      const itemIncharges = cls.item_incharges || {};
      const assignment = itemIncharges[item] || {};
      const currentInchargeName = assignment.incharge_name || "";
      
      return {
        "Category": cls.title,
        "Classification Item": item,
        "Currently Allocated In-charge": currentInchargeName || "Unallocated"
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Allocations");
    XLSX.writeFile(workbook, "Allocation_Report.xlsx");
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <PaginationContainer>
        <span className="text-muted" style={{ fontSize: "14px" }}>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, flatAllocations.length)} of{" "}
          {flatAllocations.length} items
        </span>
        <div className="d-flex align-items-center">
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            First
          </PageButton>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </PageButton>
          {pageNumbers.map(number => (
            <PageButton
              key={number}
              active={currentPage === number}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </PageButton>
          ))}
          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </PageButton>
          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            Last
          </PageButton>
        </div>
      </PaginationContainer>
    );
  };

  return (
    <StyledContainer className="mt-4">
      <div className="d-flex justify-content-start mb-3">
        <BackButton onClick={() => navigate("/IncidentDashboard")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </BackButton>
      </div>

      <FormHeader>
        <h2>INCIDENT CLASSIFICATIONS &amp; ALLOCATIONS</h2>
        <span>SP Medifort Hospital Quality Administration Panel</span>
      </FormHeader>

      {error && <FormAlert variant="danger" className="mb-3">{error}</FormAlert>}
      {successMsg && <FormAlert variant="success" className="mb-3">{successMsg}</FormAlert>}

      <TabContainer>
        <Tab.Container defaultActiveKey="classifications">
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="classifications">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                Classification of Incidents
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="allocations">
                <FontAwesomeIcon icon={faUserShield} className="me-2" />
                In-charge Allocation
                {totalItems > 0 && (
                  <Badge bg={allocatedItems === totalItems ? "success" : "warning"} className="ms-2" text={allocatedItems === totalItems ? "light" : "dark"}>
                    {allocatedItems}/{totalItems}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Tab 1: Create & Edit Classifications */}
            <Tab.Pane eventKey="classifications">
              <Row>
                <Col lg={5}>
                  <Card className="mb-4 shadow-sm border-0 bg-light p-3">
                    <Card.Body>
                      <SectionTitle>
                        {editingId ? <FontAwesomeIcon icon={faEdit} /> : <FontAwesomeIcon icon={faPlus} />}
                        {editingId ? "Edit Classification" : "Create Classification"}
                      </SectionTitle>
                      
                      <Form onSubmit={handleSaveClassification}>
                        <Form.Group className="mb-3" controlId="classTitle">
                          <Form.Label><strong>Classification Title:</strong></Form.Label>
                          <TextField
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Clinical Practice / Procedure"
                            required
                          />
                        </Form.Group>

                        <Form.Label><strong>Classification Items:</strong></Form.Label>
                        <div className="d-flex gap-2 mb-3">
                          <TextField
                            type="text"
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            placeholder="Add classification options..."
                          />
                          <StyledButton type="button" onClick={handleAddItem}>
                            <FontAwesomeIcon icon={faPlus} /> Add
                          </StyledButton>
                        </div>

                        <div className="mb-4 p-2 bg-white border rounded min-vh-10" style={{ minHeight: "120px" }}>
                          {items.length === 0 ? (
                            <span className="text-muted d-block text-center py-4">No items added yet. Add items above.</span>
                          ) : (
                            items.map((item, idx) => (
                              <ItemBadge key={idx}>
                                {item}
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleRemoveItem(idx)} />
                              </ItemBadge>
                            ))
                          )}
                        </div>

                        <div className="d-flex gap-2">
                          <StyledButton type="submit" disabled={loading}>
                            <FontAwesomeIcon icon={faSave} /> {editingId ? "Update" : "Save"}
                          </StyledButton>
                          {editingId && (
                            <BackButton type="button" onClick={handleCancelEdit}>
                              Cancel
                            </BackButton>
                          )}
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={7}>
                  <Card className="shadow-sm border-0">
                    <Card.Body>
                      <SectionTitle>
                        <FontAwesomeIcon icon={faFileAlt} /> Existing Classifications
                      </SectionTitle>

                      <div className="table-responsive">
                        <Table hover striped bordered className="align-middle">
                          <thead>
                            <tr style={{ backgroundColor: "#f8fafc" }}>
                              <th>Title</th>
                              <th>Items Count</th>
                              <th>Allocated</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classifications.length > 0 ? (
                              classifications.map((cls) => {
                                const itemIncharges = cls.item_incharges || {};
                                const allocated = (cls.items || []).filter(item => itemIncharges[item] && itemIncharges[item].incharge_id).length;
                                const total = (cls.items || []).length;
                                return (
                                  <tr key={cls.id}>
                                    <td><strong>{cls.title}</strong></td>
                                    <td>{total} items</td>
                                    <td>
                                      <Badge bg={allocated === total && total > 0 ? "success" : allocated > 0 ? "warning" : "secondary"}
                                        text={allocated > 0 && allocated < total ? "dark" : "light"}>
                                        {allocated}/{total} allocated
                                      </Badge>
                                    </td>
                                    <td>
                                      <div className="d-flex gap-2">
                                        <StyledButton type="button" onClick={() => handleEdit(cls)}>
                                          <FontAwesomeIcon icon={faEdit} /> Edit
                                        </StyledButton>
                                        <DangerButton type="button" onClick={() => handleDelete(cls.id)}>
                                          <FontAwesomeIcon icon={faTrash} /> Delete
                                        </DangerButton>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                  No classifications found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Tab 2: Per-Item In-charge Allocation */}
            <Tab.Pane eventKey="allocations">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                    <SectionTitle style={{ marginTop: 0, marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>
                      <FontAwesomeIcon icon={faUserShield} /> Allocate In-charge per Classification Item
                    </SectionTitle>
                    <StyledButton onClick={handleExportAllocationExcel} style={{ height: "36px", fontSize: "14px", backgroundColor: "#109b76" }}>
                      <FontAwesomeIcon icon={faFileExcel} /> Export XLS
                    </StyledButton>
                  </div>
                  <p className="text-muted mb-4">
                    Assign a responsible In-charge personnel to each individual classification item. Each item within a category can have its own designated In-charge.
                  </p>

                  {incharges.length === 0 && (
                    <Alert variant="warning">
                      No In-charge personnel found. Please ensure In-charge users are registered in the system.
                    </Alert>
                  )}

                  {classifications.length === 0 ? (
                    <Alert variant="info">
                      No classifications found. Create classifications in the "Classification of Incidents" tab first.
                    </Alert>
                  ) : (
                    <>
                      <TableContainer>
                        <table>
                          <thead>
                            <tr>
                              <th style={{ width: "30%" }}>Category</th>
                              <th style={{ width: "30%" }}>Classification Item</th>
                              <th style={{ width: "20%" }}>Currently Allocated In-charge</th>
                              <th style={{ width: "20%" }}>Assign In-charge</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentAllocations.length > 0 ? (
                              currentAllocations.map(({ cls, item }) => {
                                const itemIncharges = cls.item_incharges || {};
                                const assignment = itemIncharges[item] || {};
                                const currentInchargeId = assignment.incharge_id || "";
                                const currentInchargeName = assignment.incharge_name || "";
                                const itemKey = `${cls.id}:${item}`;
                                const isSaving = savingItemKey === itemKey;

                                return (
                                  <ItemRow key={itemKey}>
                                    <td style={{ fontWeight: 600, color: "#0c7a5d" }}>
                                      {cls.title}
                                    </td>
                                    <td>
                                      <span style={{ fontWeight: 500, color: "#374151" }}>{item}</span>
                                    </td>
                                    <td>
                                      {currentInchargeId ? (
                                        <AllocatedBadge>
                                          <FontAwesomeIcon icon={faUserCheck} />
                                          {currentInchargeName || currentInchargeId}
                                        </AllocatedBadge>
                                      ) : (
                                        <UnallocatedBadge>
                                          Unallocated
                                        </UnallocatedBadge>
                                      )}
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center gap-2">
                                        <TableFormSelect
                                          value={currentInchargeId}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const found = incharges.find(inc => String(inc.id) === String(val));
                                            const name = found ? found.name : "";
                                            handleAllocateItemIncharge(cls, item, val, name);
                                          }}
                                          disabled={isSaving || incharges.length === 0}
                                        >
                                          <option value="">-- Select In-charge --</option>
                                          {incharges.map((inc) => (
                                            <option key={inc.id} value={inc.id}>
                                              {inc.name} {inc.department ? `(${inc.department})` : ""}
                                            </option>
                                          ))}
                                        </TableFormSelect>
                                        {isSaving && (
                                          <span className="text-muted" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                                            Saving...
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  </ItemRow>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                  No items to allocate.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </TableContainer>
                      {renderPagination()}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </TabContainer>
    </StyledContainer>
  );
};

export default IncidentClassificationManager;

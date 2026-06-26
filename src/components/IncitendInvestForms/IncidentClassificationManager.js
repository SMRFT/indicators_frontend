import React, { useState, useEffect } from "react";
import { Row, Form, Col, Alert, Card, Tab, Nav, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faUserShield, faFileAlt, faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { message } from "antd";

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 30px;
  max-width: 1200px;
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
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 155, 118, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #0c7a5d;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 155, 118, 0.3);
  }

  &:disabled {
    background: #a5d3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const DangerButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 8px;

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
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);

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
      const headers = {
        Authorization: localStorage.getItem("access_token"),
      };
      
      const [classRes, inchargesRes] = await Promise.all([
        fetch(`${IndicatorBaseUrl}IncidentClassification/`, { headers }),
        fetch(`${IndicatorBaseUrl}get_incharges/`, { headers })
      ]);

      if (!classRes.ok || !inchargesRes.ok) {
        throw new Error("Failed to fetch classification or in-charge data");
      }

      const classData = await classRes.json();
      const inchData = await inchargesRes.json();
      
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

      const response = await fetch(`${IndicatorBaseUrl}IncidentClassification/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token")
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save classification");
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
      const response = await fetch(`${IndicatorBaseUrl}IncidentClassification/?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("access_token")
        }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete classification");
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

  const handleAllocateIncharge = async (clsId, inchId, inchName) => {
    setError("");
    setSuccessMsg("");
    try {
      const payload = {
        id: clsId,
        incharge_id: inchId,
        incharge_name: inchName,
        "auth-user-id": userId
      };

      const response = await fetch(`${IndicatorBaseUrl}IncidentClassification/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token")
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to allocate In-charge");
      }

      message.success("In-charge allocated successfully!");
      setSuccessMsg("In-charge allocated successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      message.error(err.message || "An error occurred while allocating.");
      setError(err.message || "An error occurred while allocating.");
    }
  };

  if (userRole !== "Admin") {
    return (
      <StyledContainer className="mt-5">
        <Alert variant="danger">{error || "Access Denied."}</Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer className="mt-4">
      <div className="d-flex justify-content-start mb-3">
        <BackButton onClick={() => navigate("/IncidentDashboard")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </BackButton>
      </div>

      <FormHeader>
        <h2>INCIDENT CLASSIFICATIONS & ALLOCATIONS</h2>
        <span>SP Medifort Hospital Quality Administration Panel</span>
      </FormHeader>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {successMsg && <Alert variant="success" className="mb-3">{successMsg}</Alert>}

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
                          <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Clinical Practice / Procedure"
                            required
                          />
                        </Form.Group>

                        <Form.Label><strong>Classification Items:</strong></Form.Label>
                        <div className="d-flex gap-2 mb-3">
                          <Form.Control
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
                              <th>In-charge</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classifications.length > 0 ? (
                              classifications.map((cls) => (
                                <tr key={cls.id}>
                                  <td><strong>{cls.title}</strong></td>
                                  <td>{cls.items ? cls.items.length : 0} items</td>
                                  <td>{cls.incharge_name || <span className="text-muted">Not allocated</span>}</td>
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
                              ))
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

            {/* Tab 2: In-charge Allocation */}
            <Tab.Pane eventKey="allocations">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <SectionTitle>
                    <FontAwesomeIcon icon={faUserShield} /> Allocate Category In-charge
                  </SectionTitle>
                  <p className="text-muted">Dynamically allocate incident categories to In-charge personnel fetched from profiles.</p>

                  <div className="table-responsive">
                    <Table bordered hover striped className="align-middle">
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc" }}>
                          <th>Classification Category</th>
                          <th>Currently Allocated In-charge</th>
                          <th>Allocate New In-charge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classifications.length > 0 ? (
                          classifications.map((cls) => {
                            const selectedInch = incharges.find(inc => String(inc.id) === String(cls.incharge_id));
                            return (
                              <tr key={cls.id}>
                                <td>
                                  <strong>{cls.title}</strong>
                                </td>
                                <td>
                                  {cls.incharge_name ? (
                                    <div>
                                      <strong>{cls.incharge_name}</strong>
                                      <br />
                                      <span className="text-muted small">ID: {cls.incharge_id}</span>
                                    </div>
                                  ) : (
                                    <span className="text-muted">Unallocated</span>
                                  )}
                                </td>
                                <td>
                                  <Form.Select
                                    value={cls.incharge_id || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const found = incharges.find(inc => String(inc.id) === String(val));
                                      const name = found ? found.name : "";
                                      handleAllocateIncharge(cls.id, val, name);
                                    }}
                                  >
                                    <option value="">-- Select In-charge --</option>
                                    {incharges.map((inc) => (
                                      <option key={inc.id} value={inc.id}>
                                        {inc.name} ({inc.department || "No Dept"}) - ID: {inc.id}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center text-muted py-4">
                              No classifications found. Create classifications first.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
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

import { useContext, useEffect, useState, useMemo } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  ListGroup,
  Col,
  Table,
  InputGroup,
  Modal,
  Badge,
  Spinner,
  Alert,
  Card,
  Pagination
} from "react-bootstrap";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUndo,
  FaFilter,
  FaSync,
  FaEye,
} from "react-icons/fa";
import {
  deleteProject,
  createProject,
  updateProject,
  restoreProject,
  getProjectPaging,
  searchProject,
  getEmployees
} from "../serviceAPI/projectService";
import { useToast } from '../component/Toast';
import { UserContext } from '../App';
import ProjectDetails from "../component/ProjectDetails";

function ProjectManagement() {
  const { user } = useContext(UserContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({});

  const [filters, setFilters] = useState({
    name: "",
    projectStatus: "",
    employeeSearch: "",
  });

  const [allEmployees, setAllEmployees] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    projectStatus: "not_started",
    employeeIds: [],
  });

  const { addToast } = useToast();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModalDetail, setShowModalDetail] = useState(false);

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setAllEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };
  fetchEmployees();
}, []);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowModalDetail(true);
  };

  const handleCloseModal = () => {
    setShowModalDetail(false);
  };

  useEffect(() => {
    if (isSearching) return;
    setLoading(true);
    const apiAll = async () => {
      const params = {
        currentPage: currentPage,
        pageSize: itemsPerPage
      };

      try {
        const resultProjects = await getProjectPaging(params);
        setTotalElement(resultProjects.data.totalElements);
        setTotalPage(resultProjects.data.totalPages);
        setCurrentPage(resultProjects.data.currentPage);
        setProjects(resultProjects.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    apiAll();
  }, [currentPage, itemsPerPage, isSearching]);
  
  useEffect(() => {
    if (!filters.name && !filters.projectStatus) {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  }, [filters]);

  useEffect(() => {
    if (!isSearching) return;
    setLoading(true);
    
    const searchApi = async () => {
      const resolvedFilters = {
        ...filters,
        currentPage: currentPage,
        pageSize: itemsPerPage,
      };

      const resultProjects = await searchProject(resolvedFilters);
      if (resultProjects.status == 200) {
        setProjects(resultProjects.data.data);
      } else {
        setProjects([]);
      }
      setTotalElement(resultProjects.data.totalElements);
      setTotalPage(resultProjects.data.totalPages);
      setCurrentPage(resultProjects.data.currentPage);
    }
    searchApi();
    setLoading(false);
  }, [filters, currentPage, isSearching, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isEditing) {
        try {
          const result = await updateProject(formData, formData.id);
          if (result.status === "Success") {
            const data = result.data;
            addToast(`Update project "${data.name}" successfully!`, true, false);
            setProjects(prevProjects =>
              prevProjects.map(project =>
                project.id === formData.id ? { ...data } : project
              )
            );
            setIsEditing(false)
            setShowFormModal(false);
          } else {
            setIsEditing(true);
            setShowFormModal(true);
            addToast(`Error: ${result.message}`, false, true)
          }
        } catch (error) {
          addToast(`An error occurred when updating project!: ${error}`, false, true)
        }
      } else {
        try {

          let copyDataWithoutID = { ...formData };
          delete copyDataWithoutID.id;

          const result = await createProject(copyDataWithoutID);
          if (result.status == "Success") {
            const data = result.data;
            setProjects(prevProjects => [data, ...prevProjects]);
            setIsEditing(false);
            setShowFormModal(false);
            setErrors({})
            addToast(`Create project "${data.name}" successfully!`, true, false)
          } else {
            setShowFormModal(true);
            addToast(`Error: ${result.message}`, false, true)
            if (result.error) {
              setErrors(result.error)
            }
          }
        } catch (error) { 
          addToast(`An error occurred when adding project!: ${error}`, false, true)
        }
      }
    } catch (error) {
      addToast(`An error occurred when adding or updating project!: ${error}`, false, true)
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      projectStatus: "not_started",
    });
  };

  const handleEdit = (project) => {

    const employeeIds = project.members?.map(member => member.employeeId) || [];

    setFormData({
      id: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      projectStatus: project.projectStatus,
      employeeIds: employeeIds,
    });

    // setFormData({ ...project });
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = async (project) => {
    if (window.confirm("Are you sure to delete this project?")) {
      try {
        setLoading(true);
        const result = await deleteProject(project.id);
        setProjects(prevProjects =>
          prevProjects.map(proj =>
            proj.id === project.id ? { ...proj, deleted: true, projectStatus: "cancelled" } : proj
          )
        );
      } catch (err) {
        setError("Cannot delete this project");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (project) => {
    try {
      setLoading(true);
      const result = await restoreProject(project.id);
      setProjects(prevProjects =>
        prevProjects.map(proj =>
          proj.id === project.id ? { ...proj, deleted: false, projectStatus: "in_progress" } : proj
        )
      );
    } catch (err) {
      setError("Cannot restore project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    let bg, text;
    switch(status) {
      case "not_started":
        bg = "secondary";
        text = "Not Started";
        break;
      case "in_progress":
        bg = "primary";
        text = "In Progress";
        break;
      case "on_hold":
        bg = "warning";
        text = "On Hold";
        break;
      case "completed":
        bg = "success";
        text = "Completed";
        break;
      case "cancelled":
        bg = "danger";
        text = "Cancelled";
        break;
      default:
        bg = "info";
        text = status;
    }
    return <Badge bg={bg} className="fs-6">{text}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-center">
            <i className="bi bi-folder me-2"></i>
            PROJECT MANAGEMENT
          </h2>
          <hr />
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Search
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Project Name</Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder="Search by project name"
                    value={filters.name}
                    onChange={(e) =>
                      setFilters({ ...filters, name: e.target.value })
                    }
                  />
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.projectStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, projectStatus: e.target.value })
                  }
                >
                  <option value="">All Statuses</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              className="me-2 btn-lg"
              onClick={() => setFilters({ name: "", projectStatus: "" })}
            >
              <FaSync className="me-2" />
              Refresh
            </Button>

            <Button
              variant="primary"
              className="btn-lg"
              onClick={() => setShowFormModal(true)}
            >
              <FaPlus className="me-2" />
              Add New Project
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModalDetail} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedProject ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading...</p>
            </div>
          ) : selectedProject ? (
            <ProjectDetails project={selectedProject} />
          ) : (
            <p className="text-danger text-center">Cannot load this project</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Project Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">List Projects</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th width="5%">#</th>
                    <th width="20%">Project Name</th>
                    <th width="25%">Description</th>
                    <th width="10%">Start Date</th>
                    <th width="10%">End Date</th>
                    <th width="10%">Status</th>
                    <th width="10%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, idx) => (
                    <tr key={project.id}>
                      <td>{idx + 1}</td>
                      <td>{project.name}</td>
                      <td>{project.description}</td>
                      <td>{project.startDate}</td>
                      <td>{project.endDate}</td>
                      <td>{renderStatus(project.projectStatus)}</td>
                      <td>
                        <div className="d-flex">
                          {project.deleted ? (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleRestore(project)}
                              title="Restore"
                              className="me-2"
                            >
                              <FaUndo />
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleView(project)}
                                title="Detail"
                                className="me-2"
                              >
                                <FaEye />
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleEdit(project)}
                                title="Edit"
                                className="me-2"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(project)}
                                title="Delete"
                              >
                                <FaTrash />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Pagination className="mt-4 justify-content-center">
        {Array.from({ length: Math.ceil(totalPage) }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Add/Edit Project Modal */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="d-flex align-items-center">
            {isEditing ? (
              <>
                <FaEdit className="me-2" /> Edit Project
              </>
            ) : (
              <>
                <FaPlus className="me-2" /> Add Project
              </>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold fs-5">Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="py-2 fs-5"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold fs-5">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="py-2 fs-5"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold fs-5">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="py-2 fs-5"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold fs-5">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="py-2 fs-5"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold fs-5">Status</Form.Label>
                  <Form.Select
                    value={formData.projectStatus}
                    onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}
                    className="py-2 fs-5"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold fs-5">Assign Employees</Form.Label>
                  
                  {/* Hiển thị các nhân viên đã chọn */}
                  {formData.employeeIds.length > 0 && (
                    <div className="mb-3 p-2 border rounded bg-light">
                      <h6>Selected Employees:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {formData.employeeIds.map(id => {
                          const emp = allEmployees.find(e => e.id === id);
                          return emp ? (
                            <Badge key={id} bg="primary" className="d-flex align-items-center">
                              {emp.email}
                              <button 
                                type="button" 
                                className="ms-2 btn-close btn-close-white btn-sm" 
                                onClick={() => setFormData({
                                  ...formData,
                                  employeeIds: formData.employeeIds.filter(eid => eid !== id)
                                })}
                              />
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Thanh tìm kiếm */}
                  <Form.Control
                    type="text"
                    placeholder="Search employees..."
                    className="mb-2"
                    onChange={(e) => setFilters({ ...filters, employeeSearch: e.target.value })}
                  />
                  
                  {/* Danh sách nhân viên với checkbox */}
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                    <ListGroup variant="flush">
                      {allEmployees
                        .filter(emp => 
                          !filters.employeeSearch || 
                          emp.email.toLowerCase().includes(filters.employeeSearch.toLowerCase())
                        )
                        .map(emp => (
                          <ListGroup.Item key={emp.id} className="d-flex align-items-center">
                            <Form.Check
                              type="checkbox"
                              id={`emp-${emp.id}`}
                              checked={formData.employeeIds.includes(emp.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    employeeIds: [...formData.employeeIds, emp.id]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    employeeIds: formData.employeeIds.filter(id => id !== emp.id)
                                  });
                                }
                              }}
                              className="me-2"
                            />
                            <label htmlFor={`emp-${emp.id}`} className="mb-0 flex-grow-1">
                              {emp.email}
                            </label>
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-4">
              <Button variant="outline-secondary" className="me-3" onClick={() => {
                setShowFormModal(false);
                resetForm();
                setIsEditing(false);
              }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProjectManagement;
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
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
  FaFilter,
  FaSync,
  FaEye,
} from "react-icons/fa";
import {
  getProjectByEmployeeID,
  searchProjectByEmployeeId,
} from "../serviceAPI/projectService";
import { useToast } from '../component/Toast';
import { UserContext } from '../App';
import ProjectDetails from "../component/ProjectDetails";

function Project() {
  const { user } = useContext(UserContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    projectStatus: "",
    employeeSearch: "",
  });

    const { addToast } = useToast();
    const [selectedProject, setSelectedProject] = useState(null);
    const [showModalDetail, setShowModalDetail] = useState(false);


    const handleCloseModal = () => {
        setShowModalDetail(false);
    };

    const handleView = (project) => {
        setSelectedProject(project);
        setShowModalDetail(true);
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
        const resultProjects = await getProjectByEmployeeID(user.id, params);
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
  }, [currentPage, itemsPerPage, isSearching, user.id]);
  
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

      const resultProjects = await searchProjectByEmployeeId(user.id, resolvedFilters);
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
            MY PROJECTS
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
          </div>
        </Card.Body>
      </Card>

        <Modal show={showModalDetail} onHide={handleCloseModal} size="xl">
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
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleView(project)}
                                    title="Detail"
                                    className="me-2"
                                >
                                    <FaEye />
                                </Button>
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

    </Container>
  );
}

export default Project;
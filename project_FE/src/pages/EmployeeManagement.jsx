import { useEffect, useState } from "react";
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
  Card
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
  FaUserCircle
} from "react-icons/fa";
import {
  getEmployees,
  deleteEmployee,
  createEmployee,
  updateEmployee,
  getRoles,
  restoreEmployee,
} from "../serviceAPI/employeeService";
import { useToast } from '../component/Toast';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [errors, setErrors] = useState({});

  const [filters, setFilters] = useState({
    userName: "",
    fullName: "",
    email: ""
  });
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    code: "",
    phone: "",
    password: "",
    roleName: "ROLE_USER",
  });

  const { addToast } = useToast();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModalDetail, setShowModalDetail] = useState(false);

  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setShowModalDetail(true);
  };

  const handleCloseModal = () => {
    setShowModalDetail(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [employeesRes, rolesRes] = await Promise.all([
        getEmployees(),
        getRoles()
      ]);
      setEmployees(employeesRes.data.data);
      setRoles(rolesRes.data);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    if (isEditing) {

      try {
        const result = await  await updateEmployee(formData, formData.id);

        if (result.status === "Success") {
            const data = result.data;

            alert(`Update employee with code "${data.code}" successfully!`);

            setEmployees(prevEmployee =>
                prevEmployee.map(employee =>
                    employee.id === formData.id ? { ...data } : employee
                )
            );
            setShowFormModal(true);
        } else {
            setIsEditing(true);
            addToast(`Lỗi: ${result.message}`, false, true)
            if (result.error) {
                setErrors(result.error)
            }
        }
    } catch (error) {
        addToast(`"An error occur when updating employee!: ${error}`, false, true)
    }

    } else {
        try {
          const result = await createEmployee(formData);

          if (result.status === "Success") {
              const data = result.data;

              addToast(`Create employee with code "${data.code}" successfully!`, true, false)

              setEmployees(prevEmployee => [
                  data,
                  ...prevEmployee
              ]);
            setShowFormModal(true);
            setErrors({})
          } else {
              setIsEditing(false);
              addToast(`Lỗi: ${result.message}`, false, true)
              if (result.error) {
                  setErrors(result.error)
              }
          }
      } catch (error) { 
          addToast(`An error occur when adding employee!: ${error}`, false, true)
      }
    }

    loadData();
    setShowFormModal(false);
    resetForm();
    setIsEditing(false);
  } catch (error) {
    addToast(`An error occur when adding or updating employee!: ${error}`, false, true)
  } finally {
      setLoading(false);
  }
};

  const resetForm = () => {
    setFormData({
      userName: "",
      fullName: "",
      email: "",
      code: "",
      phone: "",
      password: "",
      roleName: "ROLE_USER",
    });
  };

  const handleEdit = (emp) => {
    setFormData({ ...emp });
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this employee?")) {
      try {
        setLoading(true);
        await deleteEmployee(id);
        loadData();
      } catch (err) {
        setError("Cannot delete this employee");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      setLoading(true);
      await restoreEmployee(id);
      loadData();
    } catch (err) {
      setError("Cannot restore employee");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = employees.filter((e) => {
    const matchUser = filters.userName
      ? e.userName?.toLowerCase().includes(filters.userName.toLowerCase())
      : true;
    const matchName = filters.fullName
      ? e.fullName?.toLowerCase().includes(filters.fullName.toLowerCase())
      : true;
    const matchEmail = filters.email
      ? e.email?.toLowerCase().includes(filters.email.toLowerCase())
      : true;
    return matchUser && matchName && matchEmail;
  });

  // const renderStatus = (value) => (
  //   <Badge bg={value ? "success" : "secondary"} className="fs-6">
  //     {value ? "Hoạt động" : "Không hoạt động"}
  //   </Badge>
  // );

  const renderStatus = (value) => (
    <Badge bg={value ? "secondary" : "success"} className="fs-6">
      {value ? "Deleted" : "Actived"}
    </Badge>
  );

  return (
    <Container fluid className="py-4">

      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-center">
            <i className="bi bi-people-fill me-2"></i>
            MANAGER EMPLOYEES
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>User name</Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm theo tên đăng nhập"
                    value={filters.userName}
                    onChange={(e) =>
                      setFilters({ ...filters, userName: e.target.value })
                    }
                  />
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Full name</Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm theo họ tên"
                    value={filters.fullName}
                    onChange={(e) =>
                      setFilters({ ...filters, fullName: e.target.value })
                    }
                  />
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm theo email"
                    value={filters.email}
                    onChange={(e) =>
                      setFilters({ ...filters, email: e.target.value })
                    }
                  />
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              className="me-2 btn-lg"
              onClick={() => setFilters({ userName: "", fullName: "", email: "" })}
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
              Add new employee
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModalDetail} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedEmployee ? (
              <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading...</p>
              </div>
            ) : selectedEmployee ? (
              <Card className="shadow">
                <Card.Header className="bg-primary text-white d-flex align-items-center">
                  <FaUserCircle size={24} className="me-2" />
                  <h5 className="mb-0">Infomation</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}><strong>User name:</strong> {selectedEmployee.userName}</Col>
                    <Col md={6}><strong>Full name:</strong> {selectedEmployee.fullName}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><strong>Email:</strong> {selectedEmployee.email}</Col>
                    <Col md={6}><strong>Phone:</strong> {selectedEmployee.phone}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><strong>Code:</strong> {selectedEmployee.code}</Col>
                    <Col md={6}>
                      <strong>Role:</strong> <Badge bg="info">{selectedEmployee.roleName}</Badge>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Status:</strong>{" "}
                      <Badge bg={selectedEmployee.enabled ? "success" : "secondary"}>
                        {selectedEmployee.enabled ? "Actived" : "Inactived"}
                      </Badge>
                    </Col>
                    <Col md={6}>
                      <strong>Khóa:</strong>{" "}
                      <Badge bg={selectedEmployee.nonLocked ? "success" : "danger"}>
                        {selectedEmployee.nonLocked ? "Non locked" : "Locked"}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ) : (
              <p className="text-danger text-center">Cannot load this employee</p>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Employee Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">List employees</h5>
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
                    <th width="15%">User name</th>
                    <th width="15%">Full name</th>
                    <th width="10%">Code</th>
                    <th width="15%">Email</th>
                    <th width="10%">Phone</th>
                    <th width="10%">Role</th>
                    <th width="10%">Status</th>
                    <th width="10%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((emp, idx) => (
                    <tr key={emp.id}>
                      <td>{idx + 1}</td>
                      <td>{emp.userName}</td>
                      <td>{emp.fullName}</td>
                      <td>{emp.code}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>
                        <Badge bg="info">{emp.roleName}</Badge>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          {/* <small>Kích hoạt: {renderStatus(emp.enabled)}</small>
                          <small>Khóa: {renderStatus(!emp.nonLocked)}</small> */}
                          <small>{renderStatus(emp.deleted)}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          {emp.deleted ? (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleRestore(emp.id)}
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
                                onClick={() => handleView(emp)}
                                title="Detail"
                                className="me-2"
                              >
                                <FaEye />
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleEdit(emp)}
                                title="Edit"
                                className="me-2"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(emp.id)}
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

      {/* Add/Edit Employee Modal */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg" centered>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title className="d-flex align-items-center">
      {isEditing ? (
        <>
          <FaEdit className="me-2" /> Edit
        </>
      ) : (
        <>
          <FaPlus className="me-2" /> Add
        </>
      )}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {/* {globalError && (
  <Alert variant="danger" onClose={() => setGlobalError(null)} dismissible>
    {globalError}
  </Alert>
)} */}
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold fs-5">User name</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              required
              disabled={isEditing}
              className="py-2 fs-5"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold fs-5">Full name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="py-2 fs-5"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold fs-5">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="py-2 fs-5"
              isInvalid={!!errors.email}

            />
              <Form.Control.Feedback type="invalid">{errors?.email}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold fs-5">Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="py-2 fs-5"
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors?.phone}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold fs-5">Code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="py-2 fs-5"
              isInvalid={!!errors.code}
            />
            <Form.Control.Feedback type="invalid">{errors?.code}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold fs-5">Role</Form.Label>
            <Form.Select
              value={formData.roleName}
              onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
              className="py-2 fs-5"
            >
              {roles.map((ro, index) => (
                <option key={index} value={ro.roleName}>
                  {ro.roleName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {!isEditing && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-5">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="py-2 fs-5"
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors?.password}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      )}

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
          ) : isEditing ? "Edit" : "Add"}
        </Button>
      </div>
    </Form>
  </Modal.Body>
</Modal>
    </Container>
  );
}

export default EmployeeManagement;
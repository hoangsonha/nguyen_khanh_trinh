import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Table,
  InputGroup,
  Col,
  Modal,
  Badge,
} from "react-bootstrap";
import {
  getEmployees,
  deleteEmployee,
  createEmployee,
  updateEmployee,
  getRoles,
  restoreEmployee,
} from "../serviceAPI/employeeService";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function ProjectManagement() {
  const [employees, setEmployees] = useState([]);
  const [role, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ userName: "", fullName: "", email: "" });
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    code: "",
    phone: "",
    password: "",
    roleName: "ROLE_USER",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getEmployees();
    setEmployees(data.data);
    const data_role = await getRoles();
    setRoles(data_role.data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateEmployee(formData, formData.id);
    } else {
      await createEmployee(formData);
    }
    loadData();
    setShowFormModal(false);
    resetForm();
    setIsEditing(false);
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
    await deleteEmployee(id);
    loadData();
  };

  const handleRestore = async (id) => {
    await restoreEmployee(id);
  loadData();
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

  const renderStatus = (value) => (
    <Badge bg={value ? "success" : "secondary"}>
      {value ? "✓" : "✗"}
    </Badge>
  );


  return (
    <Container className="mt-4">
      <h3 className="text-center fw-bold mb-4">This feature is not available</h3>
    </Container>
  );
}

export default ProjectManagement;

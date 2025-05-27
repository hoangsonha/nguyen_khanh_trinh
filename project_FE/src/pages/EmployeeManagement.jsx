// import { useContext, useEffect, useState } from "react";
// import {
//   Button,
//   Form,
//   Container,
//   Row,
//   Col,
//   Table,
//   InputGroup,
//   Modal,
//   Badge,
//   Spinner,
//   Alert,
//   Card,
//   Pagination
// } from "react-bootstrap";
// import {
//   FaSearch,
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaUndo,
//   FaFilter,
//   FaSync,
//   FaEye,
// } from "react-icons/fa";
// import {
//   deleteEmployee,
//   createEmployee,
//   updateEmployee,
//   getRoles,
//   restoreEmployee,
//   getEmployeePaging,
//   search
// } from "../serviceAPI/employeeService";
// import { useToast } from '../component/Toast';
// import { UserContext } from '../App';
// import Informations from "../component/Informations";

// function EmployeeManagement() {

//   const { user } = useContext(UserContext);

//   const [employees, setEmployees] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPage, setTotalPage] = useState(1);
//   const [totalElement, setTotalElement] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const [isSearching, setIsSearching] = useState(false);

//   const [errors, setErrors] = useState({});

//   const [filters, setFilters] = useState({
//     userName: "",
//     fullName: "",
//     email: ""
//   });
//   const [formData, setFormData] = useState({
//     userName: "",
//     fullName: "",
//     email: "",
//     code: "",
//     phone: "",
//     password: "",
//     roleName: "ROLE_USER",
//   });

//   const { addToast } = useToast();

//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [showModalDetail, setShowModalDetail] = useState(false);

//   const handleView = (emp) => {
//     setSelectedEmployee(emp);
//     setShowModalDetail(true);
//   };

//   const handleCloseModal = () => {
//     setShowModalDetail(false);
//   };

//   useEffect(() => {
//     if (isSearching) return;
//     setLoading(true);
//     const apiAll = async () => {
//         const params = {
//             currentPage: currentPage,
//             pageSize: itemsPerPage
//         };

//         try {
//             const resultPurposes = await getEmployeePaging(params);
//             const rolesRes = await getRoles();

//             setRoles(rolesRes.data);
//             setTotalElement(resultPurposes.data.totalElements);
//             setTotalPage(resultPurposes.data.totalPages);
//             setCurrentPage(resultPurposes.data.currentPage);
//             setEmployees(resultPurposes.data.data);

//         } catch (error) {
//             console.error("Có lỗi xảy ra khi gọi api công dụng:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     apiAll();
//   }, [currentPage, itemsPerPage, isSearching]);
  
//    useEffect(() => {
//         if (!filters.userName && !filters.fullName && !filters.email) {
//             setIsSearching(false);
//         } else {
//             setIsSearching(true);
//         }
//     }, [filters]);

//     useEffect(() => {

//         if (!isSearching) return;

//         setLoading(true);
//         const searchApi = async () => {

//             const resolvedFilters = {
//                 ...filters,
//                 currentPage: currentPage,
//                 pageSize: itemsPerPage,
//             };

//             const resultVaccineUses = await search(resolvedFilters);

//             if (resultVaccineUses.status === 200) {
//                 setEmployees(resultVaccineUses.data.data);
 
//             } else {
//                 setEmployees([]);
//             }
//             setTotalElement(resultVaccineUses.data.totalElements);
//             setTotalPage(resultVaccineUses.data.totalPages);
//             setCurrentPage(resultVaccineUses.data.currentPage);
//         }
//         searchApi();
//         setLoading(false);
    
//     }, [filters, currentPage, isSearching, itemsPerPage])

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);

//       if (isEditing) {

//         try {
//           const result = await  await updateEmployee(formData, formData.id);

//           if (result.status === "Success") {
//               const data = result.data;

//               addToast(`Update employee with code "${data.code}" successfully!`, true, false);

//               setEmployees(prevEmployee =>
//                   prevEmployee.map(employee =>
//                       employee.id === formData.id ? { ...data } : employee
//                   )
//               );
//               setIsEditing(false)
//               setShowFormModal(false);
//           } else {
//               setIsEditing(true);
//               setShowFormModal(true);
//               addToast(`Lỗi: ${result.message}`, false, true)
//           }
//     } catch (error) {
//         addToast(`"An error occur when updating employee!: ${error}`, false, true)
//     }

//     } else {
//         try {
//           const result = await createEmployee(formData);

//           console.log(result)

//           if (result.status === "Success") {
//             const data = result.data;
//             setEmployees(prevEmployee => [
//                 data,
//                 ...prevEmployee
//             ]);
          
//             setIsEditing(false);
//             setShowFormModal(false);
//             setErrors({})
//             addToast(`Create employee with code "${data.code}" successfully!`, true, false)

//           } else {
//               setShowFormModal(true);
//               addToast(`Lỗi: ${result.message}`, false, true)
//               if (result.error) {
//                   setErrors(result.error)
//               }
//           }
//       } catch (error) { 
//           addToast(`An error occur when adding employee!: ${error}`, false, true)
//       }
//     }

//   } catch (error) {
//     addToast(`An error occur when adding or updating employee!: ${error}`, false, true)
//   } finally {
//       setLoading(false);
//   }
// };

//   const resetForm = () => {
//     setFormData({
//       userName: "",
//       fullName: "",
//       email: "",
//       code: "",
//       phone: "",
//       password: "",
//       roleName: "ROLE_USER",
//     });
//   };

//   const handleEdit = (emp) => {
//     setFormData({ ...emp });
//     setIsEditing(true);
//     setShowFormModal(true);
//   };

//   const handleDelete = async (empployee) => {
//     if (window.confirm("Are you sure to delete this employee?")) {
//       try {
//         setLoading(true);
//         const result = await deleteEmployee(empployee.id);
//         setEmployees(prevEmp =>
//               prevEmp.map(emp =>
//                   emp.email === result.email ? {  ...emp, deleted: true } : emp
//               )
//           );
//       } catch (err) {
//         setError("Cannot delete this employee");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleRestore = async (empployee) => {
//     try {
//       setLoading(true);
//       const result = await restoreEmployee(empployee.id);
//       setEmployees(prevEmp =>
//               prevEmp.map(emp =>
//                   emp.email === result.email ? {  ...emp, deleted: false } : emp
//               )
//           );
//     } catch (err) {
//       setError("Cannot restore employee");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStatus = (value) => (
//     <Badge bg={value ? "secondary" : "success"} className="fs-6">
//       {value ? "Deleted" : "Actived"}
//     </Badge>
//   );

//   return (
//     <Container fluid className="py-4">

//       <Row className="mb-4">
//         <Col>
//           <h2 className="fw-bold text-center">
//             <i className="bi bi-people-fill me-2"></i>
//             MANAGER EMPLOYEES
//           </h2>
//           <hr />
//         </Col>
//       </Row>

//       {error && (
//         <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Filter Section */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Header className="bg-light">
//           <h5 className="mb-0">
//             <FaFilter className="me-2" />
//             Search
//           </h5>
//         </Card.Header>
//         <Card.Body>
//           <Row>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>User name</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     placeholder="Tìm theo tên đăng nhập"
//                     value={filters.userName}
//                     onChange={(e) =>
//                       setFilters({ ...filters, userName: e.target.value })
//                     }
//                   />
//                   <InputGroup.Text>
//                     <FaSearch />
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Full name</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     placeholder="Tìm theo họ tên"
//                     value={filters.fullName}
//                     onChange={(e) =>
//                       setFilters({ ...filters, fullName: e.target.value })
//                     }
//                   />
//                   <InputGroup.Text>
//                     <FaSearch />
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     placeholder="Tìm theo email"
//                     value={filters.email}
//                     onChange={(e) =>
//                       setFilters({ ...filters, email: e.target.value })
//                     }
//                   />
//                   <InputGroup.Text>
//                     <FaSearch />
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>
//             </Col>
//           </Row>
//           <div className="d-flex justify-content-end">
//             <Button
//               variant="outline-secondary"
//               className="me-2 btn-lg"
//               onClick={() => setFilters({ userName: "", fullName: "", email: "" })}
//             >
//               <FaSync className="me-2" />
//               Refresh
//             </Button>

//             <Button
//               variant="primary"
//               className="btn-lg"
//               onClick={() => setShowFormModal(true)}
//             >
//               <FaPlus className="me-2" />
//               Add new employee
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>

//       <Modal show={showModalDetail} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Detail Employee</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {!selectedEmployee ? (
//               <div className="text-center my-5">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-3">Loading...</p>
//               </div>
//             ) : selectedEmployee ? (
//               <Informations employee={selectedEmployee} />
//             ) : (
//               <p className="text-danger text-center">Cannot load this employee</p>
//             )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Employee Table */}
//       <Card className="shadow-sm">
//         <Card.Header className="bg-light">
//           <h5 className="mb-0">List employees</h5>
//         </Card.Header>
//         <Card.Body>
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-3">Loading...</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <Table striped bordered hover className="mb-0">
//                 <thead className="table-dark">
//                   <tr>
//                     <th width="5%">#</th>
//                     <th width="15%">User name</th>
//                     <th width="15%">Full name</th>
//                     <th width="10%">Code</th>
//                     <th width="15%">Email</th>
//                     <th width="10%">Phone</th>
//                     <th width="10%">Role</th>
//                     <th width="10%">Status</th>
//                     <th width="10%">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {employees.map((emp, idx) => (
//                     <tr key={emp.id}>
//                       <td>{idx + 1}</td>
//                       <td>{emp.userName}</td>
//                       <td>{emp.fullName}</td>
//                       <td>{emp.code}</td>
//                       <td>{emp.email}</td>
//                       <td>{emp.phone}</td>
//                       <td>
//                         <Badge bg="info">{emp.roleName}</Badge>
//                       </td>
//                       <td>
//                         <div className="d-flex flex-column">
//                           <small>{renderStatus(emp.deleted)}</small>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="d-flex">
//                           {emp.email == user.email ? <>Your account</> : <>{emp.deleted ? (
//                             <Button
//                               variant="outline-success"
//                               size="sm"
//                               onClick={() => handleRestore(emp)}
//                               title="Restore"
//                               className="me-2"
//                             >
//                               <FaUndo />
//                             </Button>
//                           ) : (
//                             <>
//                              <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => handleView(emp)}
//                                 title="Detail"
//                                 className="me-2"
//                               >
//                                 <FaEye />
//                               </Button>
//                               <Button
//                                 variant="outline-warning"
//                                 size="sm"
//                                 onClick={() => handleEdit(emp)}
//                                 title="Edit"
//                                 className="me-2"
//                               >
//                                 <FaEdit />
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => handleDelete(emp)}
//                                 title="Delete"
//                               >
//                                 <FaTrash />
//                               </Button>
//                             </>
//                           )}</>}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       <Pagination className="mt-4 justify-content-center">
//           {Array.from({ length: Math.ceil(totalPage) }, (_, i) => (
//               <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
//                   {i + 1}
//               </Pagination.Item>
//           ))}
//       </Pagination>

//       {/* Add/Edit Employee Modal */}
//       <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg" centered>
//   <Modal.Header closeButton className="bg-primary text-white">
//     <Modal.Title className="d-flex align-items-center">
//       {isEditing ? (
//         <>
//           <FaEdit className="me-2" /> Edit
//         </>
//       ) : (
//         <>
//           <FaPlus className="me-2" /> Add
//         </>
//       )}
//     </Modal.Title>
//   </Modal.Header>

//   <Modal.Body>

//     <Form onSubmit={handleSubmit}>
//       <Row>
//         <Col md={6}>
//           <Form.Group className="mb-3">
//             <Form.Label className="fw-semibold fs-5">User name</Form.Label>
//             <Form.Control
//               type="text"
//               name="userName"
//               value={formData.userName}
//               onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
//               required
//               disabled={isEditing}
//               className="py-2 fs-5"
//             />
//           </Form.Group>
//         </Col>
//         <Col md={6}>
//           <Form.Group className="mb-3">
//             <Form.Label className="fw-semibold fs-5">Full name</Form.Label>
//             <Form.Control
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//               required
//               className="py-2 fs-5"
//             />
//           </Form.Group>
//         </Col>
//       </Row>

//       <Row>
//         <Col md={6}>
//           <Form.Group className="mb-3">
//             <Form.Label className="fw-semibold fs-5">Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               disabled={isEditing}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               required
//               className="py-2 fs-5"
//               isInvalid={!!errors.email}

//             />
//               <Form.Control.Feedback type="invalid">{errors?.email}</Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col md={6}>
//           <Form.Group className="mb-3">
//             <Form.Label className="fw-semibold fs-5">Phone</Form.Label>
//             <Form.Control
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               className="py-2 fs-5"
//               isInvalid={!!errors.phone}
//             />
//             <Form.Control.Feedback type="invalid">{errors?.phone}</Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>

//       <Row>
//         <Col md={6}>
//           <Form.Group className="mb-3">
//             <Form.Label className="fw-semibold fs-5">Code</Form.Label>
//             <Form.Control
//               type="text"
//               name="code"
//               value={formData.code}
//               onChange={(e) => setFormData({ ...formData, code: e.target.value })}
//               className="py-2 fs-5"
//               isInvalid={!!errors.code}
//             />
//             <Form.Control.Feedback type="invalid">{errors?.code}</Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col md={6}>
//           <Form.Group className="mb-3">
//             <Form.Label className="fw-semibold fs-5">Role</Form.Label>
//             <Form.Select
//               value={formData.roleName}
//               onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
//               className="py-2 fs-5"
//             >
//               {roles.map((ro, index) => (
//                 <option key={index} value={ro.roleName}>
//                   {ro.roleName}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       {!isEditing && (
//         <Row>
//           <Col md={6}>
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold fs-5">Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//                 className="py-2 fs-5"
//               isInvalid={!!errors.password}
//             />
//             <Form.Control.Feedback type="invalid">{errors?.password}</Form.Control.Feedback>
//             </Form.Group>
//           </Col>
//         </Row>
//       )}

//       <div className="d-flex justify-content-end mt-4">
//         <Button variant="outline-secondary" className="me-3" onClick={() => {
//           setShowFormModal(false);
//           resetForm();
//           setIsEditing(false);
//         }}>
//           Cancel
//         </Button>
//         <Button variant="primary" type="submit" disabled={loading}>
//           {loading ? (
//             <>
//               <Spinner animation="border" size="sm" className="me-2" />
//               Saving...
//             </>
//           ) : isEditing ? "Edit" : "Add"}
//         </Button>
//       </div>
//     </Form>
//   </Modal.Body>
// </Modal>
//     </Container>
//   );
// }
// 
// export default EmployeeManagement;

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
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUserTie,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaKey,
  FaStickyNote
} from "react-icons/fa";
import {
  deleteEmployee,
  createEmployee,
  updateEmployee,
  getRoles,
  restoreEmployee,
  getEmployeePaging,
  search
} from "../serviceAPI/employeeService";
import { useToast } from '../component/Toast';
import { UserContext } from '../App';
import Informations from "../component/Informations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Salary type enum
// const SalaryType = {
//   FIXED: "FIXED",
//   HOURLY: "HOURLY"
// };

// function EmployeeManagement() {
//   const { user } = useContext(UserContext);
//   const [employees, setEmployees] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPage, setTotalPage] = useState(1);
//   const [totalElement, setTotalElement] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const [isSearching, setIsSearching] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [filters, setFilters] = useState({
//     userName: "",
//     fullName: "",
//     email: ""
//   });

//   const [formData, setFormData] = useState({
//     userName: "",
//     fullName: "",
//     email: "",
//     code: "",
//     phone: "",
//     password: "",
//     roleName: "ROLE_USER",
//     startDate: new Date(),
//     endDate: null,
//     salaryType: SalaryType.FIXED,
//     baseSalary: "",
//     note: ""
//   });

//   const { addToast } = useToast();
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [showModalDetail, setShowModalDetail] = useState(false);

//   const handleView = (emp) => {
//     setSelectedEmployee(emp);
//     setShowModalDetail(true);
//   };

//   console.log(selectedEmployee)

//     console.log(showModalDetail)

//   const handleCloseModal = () => {
//     setShowModalDetail(false);
//   };

//   useEffect(() => {
//     if (isSearching) return;
//     setLoading(true);
//     const apiAll = async () => {
//       const params = {
//         currentPage: currentPage,
//         pageSize: itemsPerPage
//       };

//       try {
//         const resultPurposes = await getEmployeePaging(params);
//         const rolesRes = await getRoles();

//         setRoles(rolesRes.data);
//         setTotalElement(resultPurposes.data.totalElements);
//         setTotalPage(resultPurposes.data.totalPages);
//         setCurrentPage(resultPurposes.data.currentPage);
//         setEmployees(resultPurposes.data.data);

//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     apiAll();
//   }, [currentPage, itemsPerPage, isSearching]);
  
//   useEffect(() => {
//     if (!filters.userName && !filters.fullName && !filters.email) {
//       setIsSearching(false);
//     } else {
//       setIsSearching(true);
//     }
//   }, [filters]);

//   useEffect(() => {
//     if (!isSearching) return;
//     setLoading(true);
    
//     const searchApi = async () => {
//       const resolvedFilters = {
//         ...filters,
//         currentPage: currentPage,
//         pageSize: itemsPerPage,
//       };

//       const resultVaccineUses = await search(resolvedFilters);

//       if (resultVaccineUses.status === 200) {
//         setEmployees(resultVaccineUses.data.data);
//       } else {
//         setEmployees([]);
//       }
//       setTotalElement(resultVaccineUses.data.totalElements);
//       setTotalPage(resultVaccineUses.data.totalPages);
//       setCurrentPage(resultVaccineUses.data.currentPage);
//     }
//     searchApi();
//     setLoading(false);
//   }, [filters, currentPage, isSearching, itemsPerPage]);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);

//       const payload = {
//         ...formData,
//         startDate: formData.startDate.toISOString().split('T')[0],
//         endDate: formData.endDate ? formData.endDate.toISOString().split('T')[0] : null,
//         baseSalary: typeof formData.baseSalary === 'number' 
//           ? formData.baseSalary 
//           : parseFormattedCurrency(formData.baseSalary)
//       };

//       if (isEditing) {
//         try {
//           const result = await updateEmployee(payload, formData.id);

//           if (result.status === "Success") {
//             const data = result.data;
//             addToast(`Updated employee with code "${data.code}" successfully!`, true, false);
//             setEmployees(prevEmployee =>
//               prevEmployee.map(employee =>
//                 employee.id === formData.id ? { ...data } : employee
//               )
//             );
//             setIsEditing(false)
//             setShowFormModal(false);
//           } else {
//             setIsEditing(true);
//             setShowFormModal(true);
//             addToast(`Error: ${result.message}`, false, true)
//           }
//         } catch (error) {
//           addToast(`An error occurred when updating employee: ${error}`, false, true)
//         }
//       } else {
//         try {

//           const result = await createEmployee(payload);

//           if (result.status === "Success") {
//             const data = result.data;
//             setEmployees(prevEmployee => [data, ...prevEmployee]);
//             setIsEditing(false);
//             setShowFormModal(false);
//             setErrors({});
//             addToast(`Created employee with code "${data.code}" successfully!`, true, false);
//           } else {
//             setShowFormModal(true);
//             addToast(`Error: ${result.message}`, false, true);
//             if (result.error) {
//               setErrors(result.error);
//             }
//           }
//         } catch (error) { 
//           addToast(`An error occurred when adding employee: ${error}`, false, true);
//         }
//       }
//     } catch (error) {
//       addToast(`An error occurred: ${error}`, false, true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (emp) => {
//     setFormData({ 
//       ...emp,
//       startDate: emp.startDate ? new Date(emp.startDate) : new Date(),
//       endDate: emp.endDate ? new Date(emp.endDate) : null
//     });
//     setIsEditing(true);
//     setShowFormModal(true);
//   };

//   const handleDelete = async (employee) => {
//     if (window.confirm("Are you sure to delete this employee?")) {
//       try {
//         setLoading(true);
//         const result = await deleteEmployee(employee.id);
//         setEmployees(prevEmp =>
//           prevEmp.map(emp =>
//             emp.email === result.email ? { ...emp, deleted: true } : emp
//           )
//         );
//       } catch (err) {
//         setError("Cannot delete this employee");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleRestore = async (employee) => {
//     try {
//       setLoading(true);
//       const result = await restoreEmployee(employee.id);
//       setEmployees(prevEmp =>
//         prevEmp.map(emp =>
//           emp.email === result.email ? { ...emp, deleted: false } : emp
//         )
//       );
//     } catch (err) {
//       setError("Cannot restore employee");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       userName: "",
//       fullName: "",
//       email: "",
//       code: "",
//       phone: "",
//       password: "",
//       roleName: "ROLE_USER",
//       startDate: new Date(),
//       endDate: null,
//       salaryType: SalaryType.FIXED,
//       baseSalary: "",
//       note: ""
//     });
//     setErrors({});
//   };

//   const renderStatus = (value) => (
//     <Badge bg={value ? "secondary" : "success"} className="fs-6">
//       {value ? "Inactive" : "Active"}
//     </Badge>
//   );

// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('vi-VN', {
//     style: 'decimal', // Use decimal style instead of currency
//     useGrouping: true, // Enable thousand separators
//     maximumFractionDigits: 0 // No decimal places
//   }).format(amount || 0);
// };

// // Parse formatted string back to number for backend (1.000 -> 1000)
// const parseFormattedCurrency = (formattedValue) => {
//   if (!formattedValue) return 0;
//   // Remove all dots (.) and convert to number
//   return Number(formattedValue.replace(/\./g, ''));
// };

//   return (
//     <Container fluid className="py-4" style={{ maxWidth: '1800px' }}>
//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center">
//             <h2 className="fw-bold text-gradient">
//               <FaUserTie className="me-3" />
//               EMPLOYEE MANAGEMENT
//             </h2>
//             <Button
//               variant="primary"
//               className="btn-pill"
//               onClick={() => {
//                 resetForm();
//                 setShowFormModal(true);
//               }}
//             >
//               <FaPlus className="me-2" />
//               New Employee
//             </Button>
//           </div>
//           <hr className="mt-3 mb-4" style={{ borderTop: '2px solid rgba(0,0,0,0.1)' }} />
//         </Col>
//       </Row>

//       {/* Filter Section */}
//       <Card className="mb-4 border-0 shadow-sm">
//         <Card.Header className="bg-white border-0">
//           <h5 className="mb-0 text-primary">
//             <FaFilter className="me-2" />
//             Employee Search
//           </h5>
//         </Card.Header>
//         <Card.Body className="pt-0">
//           <Row>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label className="text-muted small">Username</Form.Label>
//                 <InputGroup className="input-group-alternative">
//                   <InputGroup.Text className="bg-light">
//                     <FaSearch className="text-muted" />
//                   </InputGroup.Text>
//                   <Form.Control
//                     placeholder="Search by username"
//                     value={filters.userName}
//                     onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
//                     className="border-start-0"
//                   />
//                 </InputGroup>
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label className="text-muted small">Full Name</Form.Label>
//                 <InputGroup className="input-group-alternative">
//                   <InputGroup.Text className="bg-light">
//                     <FaSearch className="text-muted" />
//                   </InputGroup.Text>
//                   <Form.Control
//                     placeholder="Search by full name"
//                     value={filters.fullName}
//                     onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
//                     className="border-start-0"
//                   />
//                 </InputGroup>
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label className="text-muted small">Email</Form.Label>
//                 <InputGroup className="input-group-alternative">
//                   <InputGroup.Text className="bg-light">
//                     <FaSearch className="text-muted" />
//                   </InputGroup.Text>
//                   <Form.Control
//                     placeholder="Search by email"
//                     value={filters.email}
//                     onChange={(e) => setFilters({ ...filters, email: e.target.value })}
//                     className="border-start-0"
//                   />
//                 </InputGroup>
//               </Form.Group>
//             </Col>
//           </Row>
//           <div className="d-flex justify-content-end">
//             <Button
//               variant="outline-light"
//               className="me-2 text-dark"
//               onClick={() => setFilters({ userName: "", fullName: "", email: "" })}
//             >
//               <FaSync className="me-2" />
//               Reset Filters
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Employee Table */}
//       <Card className="border-0 shadow-sm">
//         <Card.Header className="bg-white border-0">
//           <div className="d-flex justify-content-between align-items-center">
//             <h5 className="mb-0 text-primary">Employee Records</h5>
//             <div className="d-flex align-items-center">
//               <span className="text-muted small me-2">Show:</span>
//               <Form.Select 
//                 size="sm" 
//                 className="form-select-sm"
//                 style={{width: '80px'}}
//                 value={itemsPerPage}
//                 onChange={(e) => setItemsPerPage(Number(e.target.value))}
//               >
//                 <option value="5">5</option>
//                 <option value="10">10</option>
//                 <option value="20">20</option>
//                 <option value="50">50</option>
//               </Form.Select>
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body className="px-0">
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-3 text-muted">Loading employee data...</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <Table hover className="align-middle mb-0">
//                 <thead className="bg-light">
//                   <tr>
//                     <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">#</th>
//                     <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Employee</th>
//                     <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Contact</th>
//                     <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Salary</th>
//                     <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
//                     <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-end">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {employees.map((emp, idx) => (
//                     <tr key={emp.id}>
//                       <td className="ps-4">
//                         <span className="text-xs font-weight-bold">{(currentPage - 1) * itemsPerPage + idx + 1}</span>
//                       </td>
//                       <td>
//                         <div className="d-flex px-2 py-1">
//                           <div className="d-flex flex-column justify-content-center">
//                             <h6 className="mb-0 text-sm">{emp.fullName}</h6>
//                             <p className="text-xs text-secondary mb-0">
//                               <FaIdCard className="me-1" /> {emp.code} - @{emp.userName}
//                             </p>
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="d-flex flex-column">
//                           <span className="text-xs font-weight-bold mb-1">
//                             <FaEnvelope className="me-1" /> {emp.email}
//                           </span>
//                           <span className="text-xs text-secondary">
//                             <FaPhone className="me-1" /> {emp.phone || 'N/A'}
//                           </span>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="d-flex flex-column">
//                           <span className="text-xs font-weight-bold">
//                             {formatCurrency(
//                             emp.employmentHistories?.[0]?.salaryPolicies?.[0]?.baseSalary || 0
//                           )} VNĐ
//                           </span>
//                           <span className="text-xs text-secondary">
//                             {emp.salaryType === SalaryType.FIXED ? 'Monthly' : 'Hourly'}
//                           </span>
//                         </div>
//                       </td>
//                       <td>
//                         {renderStatus(emp.deleted)}
//                       </td>
//                       <td className="text-end pe-4">
//                         <div className="d-flex  justify-content-end">
//                           {emp.email === user.email ? (
//                             <span className="badge badge-sm bg-light text-dark">Your account</span>
//                           ) : <>{emp.deleted ? (
//                             <Button
//                               variant="outline-success"
//                               size="sm"
//                               onClick={() => handleRestore(emp)}
//                               title="Restore"
//                               className="me-2"
//                             >
//                               <FaUndo />
//                             </Button>
//                           ) : (
//                             <>
//                             <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => handleView(emp)}
//                                 title="Detail"
//                                 className="me-2"
//                               >
//                                 <FaEye />
//                               </Button>
//                               <Button
//                                 variant="outline-warning"
//                                 size="sm"
//                                 onClick={() => handleEdit(emp)}
//                                 title="Edit"
//                                 className="me-2"
//                               >
//                                 <FaEdit />
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => handleDelete(emp)}
//                                 title="Delete"
//                               >
//                                 <FaTrash />
//                               </Button>
//                             </>
//                           )}</>}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Pagination */}
//       <div className="d-flex justify-content-between align-items-center mt-4">
//         <div className="text-muted small">
//           Showing <span className="fw-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
//           <span className="fw-bold">{Math.min(currentPage * itemsPerPage, totalElement)}</span> of{' '}
//           <span className="fw-bold">{totalElement}</span> employees
//         </div>
//         <Pagination className="mb-0">
//           <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
//           <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          
//           {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
//             let pageNumber;
//             if (totalPage <= 5) {
//               pageNumber = i + 1;
//             } else if (currentPage <= 3) {
//               pageNumber = i + 1;
//             } else if (currentPage >= totalPage - 2) {
//               pageNumber = totalPage - 4 + i;
//             } else {
//               pageNumber = currentPage - 2 + i;
//             }
            
//             return (
//               <Pagination.Item 
//                 key={pageNumber} 
//                 active={pageNumber === currentPage} 
//                 onClick={() => handlePageChange(pageNumber)}
//               >
//                 {pageNumber}
//               </Pagination.Item>
//             );
//           })}
          
//           <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPage} />
//           <Pagination.Last onClick={() => handlePageChange(totalPage)} disabled={currentPage === totalPage} />
//         </Pagination>
//       </div>

// <Modal show={showModalDetail} onHide={handleCloseModal} size="lg">
//               <Modal.Header closeButton>
//                 <Modal.Title>Detail Employee</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 {!selectedEmployee ? (
//                     <div className="text-center my-5">
//                       <Spinner animation="border" variant="primary" />
//                       <p className="mt-3">Loading...</p>
//                     </div>
//                   ) : selectedEmployee ? (
//                     <Informations employee={selectedEmployee} />
//                   ) : (
//                     <p className="text-danger text-center">Cannot load this employee</p>
//                   )}
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button variant="secondary" onClick={handleCloseModal}>
//                   Close
//                 </Button>
//               </Modal.Footer>
//             </Modal>

//       {/* Add/Edit Employee Modal */}
//       <Modal show={showFormModal} onHide={() => {
//         setShowFormModal(false);
//         resetForm();
//         setIsEditing(false);
//       }} size="lg" centered backdrop="static">
//         <Modal.Header closeButton className="border-0 pb-0">
//           <Modal.Title className="text-primary">
//             <h4 className="mb-0">
//               {isEditing ? (
//                 <>
//                   <FaEdit className="me-2" /> Edit Employee
//                 </>
//               ) : (
//                 <>
//                   <FaPlus className="me-2" /> Create New Employee
//                 </>
//               )}
//             </h4>
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="pt-0 pb-4">
//           <Form onSubmit={handleSubmit}>
//             {/* Personal Information Card */}
//             <Card className="border-0 shadow-sm mb-4">
//               <Card.Header className="bg-white border-0 pb-0">
//                 <h6 className="mb-3 text-primary">
//                   <FaUserTie className="me-2" />
//                   Personal Information
//                 </h6>
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">Username</Form.Label>
//                       <InputGroup className="input-group-alternative">
//                         <InputGroup.Text className="bg-light">
//                           <FaIdCard className="text-muted" />
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           name="userName"
//                           value={formData.userName}
//                           onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
//                           required
//                           disabled={isEditing}
//                           isInvalid={!!errors.userName}
//                           className="border-start-0"
//                           placeholder="employee123"
//                         />
//                       </InputGroup>
//                       <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">Full Name</Form.Label>
//                       <InputGroup className="input-group-alternative">
//                         <InputGroup.Text className="bg-light">
//                           <FaUserTie className="text-muted" />
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           name="fullName"
//                           value={formData.fullName}
//                           onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                           required
//                           isInvalid={!!errors.fullName}
//                           className="border-start-0"
//                           placeholder="John Doe"
//                         />
//                       </InputGroup>
//                       <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">Email</Form.Label>
//                       <InputGroup className="input-group-alternative">
//                         <InputGroup.Text className="bg-light">
//                           <FaEnvelope className="text-muted" />
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           disabled={isEditing}
//                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                           required
//                           isInvalid={!!errors.email}
//                           className="border-start-0"
//                           placeholder="employee@company.com"
//                         />
//                       </InputGroup>
//                       <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">Phone</Form.Label>
//                       <InputGroup className="input-group-alternative">
//                         <InputGroup.Text className="bg-light">
//                           <FaPhone className="text-muted" />
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                           isInvalid={!!errors.phone}
//                           className="border-start-0"
//                           placeholder="+1 (555) 123-4567"
//                         />
//                       </InputGroup>
//                       <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">Employee Code</Form.Label>
//                       <InputGroup className="input-group-alternative">
//                         <InputGroup.Text className="bg-light">
//                           <FaIdCard className="text-muted" />
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           name="code"
//                           value={formData.code}
//                           onChange={(e) => setFormData({ ...formData, code: e.target.value })}
//                           required
//                           isInvalid={!!errors.code}
//                           className="border-start-0"
//                           placeholder="EMP-001"
//                         />
//                       </InputGroup>
//                       <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">Role</Form.Label>
//                       <InputGroup className="input-group-alternative">
//                         <InputGroup.Text className="bg-light">
//                           <FaUserTie className="text-muted" />
//                         </InputGroup.Text>
//                         <Form.Select
//                           value={formData.roleName}
//                           onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
//                           required
//                           className="border-start-0"
//                         >
//                           {roles.map((ro, index) => (
//                             <option key={index} value={ro.roleName}>
//                               {ro.roleName}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </InputGroup>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             {/* Employment Details Card */}
//             <Card className="border-0 shadow-sm mb-4">
//               <Card.Header className="bg-white border-0 pb-0">
//                 <h6 className="mb-3 text-primary">
//                   <FaCalendarAlt className="me-2" />
//                   Employment Details
//                 </h6>
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">Start Date</Form.Label>
//                       <DatePicker
//                         selected={formData.startDate}
//                         onChange={(date) => setFormData({ ...formData, startDate: date })}
//                         className="form-control ps-3"
//                         dateFormat="MMMM d, yyyy"
//                         required
//                         placeholderText="Select start date"
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">End Date (Optional)</Form.Label>
//                       <DatePicker
//                         selected={formData.endDate}
//                         onChange={(date) => setFormData({ ...formData, endDate: date })}
//                         className="form-control ps-3"
//                         dateFormat="MMMM d, yyyy"
//                         minDate={formData.startDate}
//                         isClearable
//                         placeholderText="No end date"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             {/* Salary Information Card */}
//             <Card className="border-0 shadow-sm mb-4">
//               <Card.Header className="bg-white border-0 pb-0">
//                 <h6 className="mb-3 text-primary">
//                   <FaMoneyBillWave className="me-2" />
//                   Salary Information
//                 </h6>
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">Salary Type</Form.Label>
//                       <Form.Select
//                         value={formData.salaryType}
//                         onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
//                         required
//                         className="ps-3"
//                       >
//                         <option value={SalaryType.FIXED}>Fixed Monthly Salary</option>
//                         <option value={SalaryType.HOURLY}>Hourly Wage</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="text-muted small">
//                         {formData.salaryType === SalaryType.FIXED ? "Monthly Salary" : "Hourly Rate"}
//                       </Form.Label>
//                       <InputGroup className="input-group-alternative">
//                         <InputGroup.Text className="bg-light">VNĐ</InputGroup.Text>
//                         <Form.Control
//                           type="text" // Changed from number to text to allow formatted input
//                           name="baseSalary"
//                           value={formatCurrency(formData.baseSalary)} // Format the display value
//                           onChange={(e) => {
//                             // Parse the formatted value back to a number before setting state
//                             const formattedValue = e.target.value.replace(/\./g, '');
//                             const numericValue = formattedValue ? parseInt(formattedValue, 10) : '';
//                             setFormData({ ...formData, baseSalary: numericValue });
//                           }}
//                           required
//                           isInvalid={!!errors.baseSalary}
//                           className="border-start-0"
//                           placeholder={formData.salaryType === SalaryType.FIXED ? "e.g. 3.000.000" : "e.g. 150.000"}
//                           onBlur={(e) => {
//                             // Format properly on blur
//                             if (e.target.value) {
//                               const numericValue = parseFormattedCurrency(e.target.value);
//                               setFormData({ ...formData, baseSalary: numericValue });
//                             }
//                           }}
//                         />
//                       </InputGroup>
//                       <Form.Control.Feedback type="invalid">{errors.baseSalary}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             {/* Additional Information Card */}
//             {!isEditing && (
//               <Card className="border-0 shadow-sm mb-4">
//                 <Card.Header className="bg-white border-0 pb-0">
//                   <h6 className="mb-3 text-primary">
//                     <FaKey className="me-2" />
//                     Account Setup
//                   </h6>
//                 </Card.Header>
//                 <Card.Body>
//                   <Row>
//                     <Col md={6}>
//                       <Form.Group className="mb-3">
//                         <Form.Label className="text-muted small">Password</Form.Label>
//                         <InputGroup className="input-group-alternative">
//                           <InputGroup.Text className="bg-light">
//                             <FaKey className="text-muted" />
//                           </InputGroup.Text>
//                           <Form.Control
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                             required
//                             isInvalid={!!errors.password}
//                             className="border-start-0"
//                             placeholder="Create password"
//                           />
//                         </InputGroup>
//                         <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
//                       </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                       <Form.Group className="mb-3">
//                         <Form.Label className="text-muted small">Notes</Form.Label>
//                         <InputGroup className="input-group-alternative">
//                           <InputGroup.Text className="bg-light">
//                             <FaStickyNote className="text-muted" />
//                           </InputGroup.Text>
//                           <Form.Control
//                             as="textarea"
//                             rows={1}
//                             name="note"
//                             value={formData.note}
//                             onChange={(e) => setFormData({ ...formData, note: e.target.value })}
//                             className="border-start-0"
//                             placeholder="Additional notes..."
//                           />
//                         </InputGroup>
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             )}

//             <div className="d-flex justify-content-end mt-4">
//               <Button 
//                 variant="outline-secondary" 
//                 className="me-3 px-4" 
//                 onClick={() => {
//                   setShowFormModal(false);
//                   resetForm();
//                   setIsEditing(false);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 variant="primary" 
//                 type="submit" 
//                 disabled={loading}
//                 className="px-4"
//               >
//                 {loading ? (
//                   <>
//                     <Spinner animation="border" size="sm" className="me-2" />
//                     {isEditing ? "Updating..." : "Creating..."}
//                   </>
//                 ) : isEditing ? "Update Employee" : "Create Employee"}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// }

// export default EmployeeManagement;


const SalaryType = {
  FIXED: "FIXED",
  HOURLY: "HOURLY",
}

function EmployeeManagement() {
  const { user } = useContext(UserContext)
  const [employees, setEmployees] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [totalElement, setTotalElement] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [isSearching, setIsSearching] = useState(false)
  const [errors, setErrors] = useState({})

  const [filters, setFilters] = useState({
    userName: "",
    fullName: "",
    email: "",
  })

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    code: "",
    phone: "",
    password: "",
    roleName: "ROLE_USER",
    startDate: new Date(),
    endDate: null,
    salaryType: SalaryType.FIXED,
    baseSalary: "",
    note: "",
  })

  const { addToast } = useToast()
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showModalDetail, setShowModalDetail] = useState(false)

  const handleView = (emp) => {
    setSelectedEmployee(emp)
    setShowModalDetail(true)
  }

  const handleCloseModal = () => {
    setShowModalDetail(false)
  }

  useEffect(() => {
    if (isSearching) return
    setLoading(true)
    const apiAll = async () => {
      const params = {
        currentPage: currentPage,
        pageSize: itemsPerPage,
      }

      try {
        const resultPurposes = await getEmployeePaging(params)
        const rolesRes = await getRoles()

        setRoles(rolesRes.data)
        setTotalElement(resultPurposes.data.totalElements)
        setTotalPage(resultPurposes.data.totalPages)
        setCurrentPage(resultPurposes.data.currentPage)
        setEmployees(resultPurposes.data.data)
      } catch (error) {
        console.error("Error fetching employees:", error)
      } finally {
        setLoading(false)
      }
    }
    apiAll()
  }, [currentPage, itemsPerPage, isSearching])

  useEffect(() => {
    if (!filters.userName && !filters.fullName && !filters.email) {
      setIsSearching(false)
    } else {
      setIsSearching(true)
    }
  }, [filters])

  useEffect(() => {
    if (!isSearching) return
    setLoading(true)

    const searchApi = async () => {
      const resolvedFilters = {
        ...filters,
        currentPage: currentPage,
        pageSize: itemsPerPage,
      }

      const resultVaccineUses = await search(resolvedFilters)

      if (resultVaccineUses.status === 200) {
        setEmployees(resultVaccineUses.data.data)
      } else {
        setEmployees([])
      }
      setTotalElement(resultVaccineUses.data.totalElements)
      setTotalPage(resultVaccineUses.data.totalPages)
      setCurrentPage(resultVaccineUses.data.currentPage)
    }
    searchApi()
    setLoading(false)
  }, [filters, currentPage, isSearching, itemsPerPage])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      // const payload = {
      //   ...formData,
      //   startDate: formData.startDate.toISOString().split("T")[0],
      //   endDate: formData.endDate ? formData.endDate.toISOString().split("T")[0] : null,
      //   baseSalary:
      //     typeof formData.baseSalary === "number" ? formData.baseSalary : parseFormattedCurrency(formData.baseSalary),
      // }

    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const payload = {
      ...formData,
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      baseSalary: typeof formData.baseSalary === "number" 
        ? formData.baseSalary 
        : parseFormattedCurrency(formData.baseSalary),
    };

      console.log('payload da ne: ', payload)

      if (isEditing) {
        try {
          const result = await updateEmployee(payload, formData.id)

          if (result.status === "Success") {
            const data = result.data
            addToast(`Updated employee with code "${data.code}" successfully!`, true, false)
            setEmployees((prevEmployee) =>
              prevEmployee.map((employee) => (employee.id === formData.id ? { ...data } : employee)),
            )
            setIsEditing(false)
            setShowFormModal(false)
          } else {
            setIsEditing(true)
            setShowFormModal(true)
            addToast(`Error: ${result.message}`, false, true)
          }
        } catch (error) {
          addToast(`An error occurred when updating employee: ${error}`, false, true)
        }
      } else {
        try {

          const result = await createEmployee(payload)

          if (result.status === "Success") {
            const data = result.data
            setEmployees((prevEmployee) => [data, ...prevEmployee])
            setIsEditing(false)
            setShowFormModal(false)
            setErrors({})
            addToast(`Created employee with code "${data.code}" successfully!`, true, false)
          } else {
            setShowFormModal(true)
            addToast(`Error: ${result.message}`, false, true)
            if (result.error) {
              setErrors(result.error)
            }
          }
        } catch (error) {
          addToast(`An error occurred when adding employee: ${error}`, false, true)
        }
      }
    } catch (error) {
      addToast(`An error occurred: ${error}`, false, true)
    } finally {
      setLoading(false)
    }
  }

  // const handleEdit = (emp) => {
  //   // Extract salary from the nested structure
  //   const baseSalary = emp.employmentHistories?.[0]?.salaryPolicies?.[0]?.baseSalary || emp.baseSalary || 0

  //   setFormData({
  //     ...emp,
  //     // Fix salary extraction
  //     baseSalary: baseSalary,
  //     // Fix date handling to avoid timezone issues
  //     startDate: emp.employmentHistories?.[0]?.startDate ? new Date(emp.employmentHistories?.[0]?.startDate + "T00:00:00") : new Date(),
  //     endDate: emp.employmentHistories?.[0]?.endDate ? new Date(emp.employmentHistories?.[0]?.endDate + "T00:00:00") : null,
  //   })
  //   setIsEditing(true)
  //   setShowFormModal(true)
  // }

  const handleEdit = (emp) => {
    // Tìm employment history mới nhất
    const newestEmployment = emp.employmentHistories?.find(history => history.isNewest) || {};
    
    // Tìm salary policy mới nhất trong employment history đó
    const newestSalaryPolicy = newestEmployment.salaryPolicies?.find(policy => policy.isNewest) || {};

    setFormData({
      ...emp,
      // Lấy thông tin từ salary policy mới nhất
      baseSalary: newestSalaryPolicy.baseSalary || emp.baseSalary || 0,
      salaryType: newestSalaryPolicy.salaryType || SalaryType.FIXED,
      
      // Lấy thông tin từ employment history mới nhất
      startDate: newestEmployment.startDate 
        ? new Date(newestEmployment.startDate + "T00:00:00") 
        : new Date(),
      endDate: newestEmployment.endDate 
        ? new Date(newestEmployment.endDate + "T00:00:00") 
        : null,
    });
    
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = async (employee) => {
    if (window.confirm("Are you sure to delete this employee?")) {
      try {
        setLoading(true)
        const result = await deleteEmployee(employee.id)
        setEmployees((prevEmp) => prevEmp.map((emp) => (emp.email === result.email ? { ...emp, deleted: true } : emp)))
      } catch (err) {
        setError("Cannot delete this employee")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRestore = async (employee) => {
    try {
      setLoading(true)
      const result = await restoreEmployee(employee.id)
      setEmployees((prevEmp) => prevEmp.map((emp) => (emp.email === result.email ? { ...emp, deleted: false } : emp)))
    } catch (err) {
      setError("Cannot restore employee")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      userName: "",
      fullName: "",
      email: "",
      code: "",
      phone: "",
      password: "",
      roleName: "ROLE_USER",
      startDate: new Date(),
      endDate: null,
      salaryType: SalaryType.FIXED,
      baseSalary: "",
      note: "",
    })
    setErrors({})
  }

  const renderStatus = (value) => (
    <Badge bg={value ? "secondary" : "success"} className="fs-6">
      {value ? "Inactive" : "Active"}
    </Badge>
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal", // Use decimal style instead of currency
      useGrouping: true, // Enable thousand separators
      maximumFractionDigits: 0, // No decimal places
    }).format(amount || 0)
  }

  // Parse formatted string back to number for backend (1.000 -> 1000)
  const parseFormattedCurrency = (formattedValue) => {
    if (!formattedValue) return 0
    // Remove all dots (.) and convert to number
    return Number(formattedValue.replace(/\./g, ""))
  }

  return (
    <Container fluid className="py-4" style={{ maxWidth: "1800px" }}>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold text-gradient">
              <FaUserTie className="me-3" />
              EMPLOYEE MANAGEMENT
            </h2>
            <Button
              variant="primary"
              className="btn-pill"
              onClick={() => {
                resetForm()
                setShowFormModal(true)
              }}
            >
              <FaPlus className="me-2" />
              New Employee
            </Button>
          </div>
          <hr className="mt-3 mb-4" style={{ borderTop: "2px solid rgba(0,0,0,0.1)" }} />
        </Col>
      </Row>

      {/* Filter Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <h5 className="mb-0 text-primary">
            <FaFilter className="me-2" />
            Employee Search
          </h5>
        </Card.Header>
        <Card.Body className="pt-0">
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted small">Username</Form.Label>
                <InputGroup className="input-group-alternative">
                  <InputGroup.Text className="bg-light">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by username"
                    value={filters.userName}
                    onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
                    className="border-start-0"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted small">Full Name</Form.Label>
                <InputGroup className="input-group-alternative">
                  <InputGroup.Text className="bg-light">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by full name"
                    value={filters.fullName}
                    onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
                    className="border-start-0"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted small">Email</Form.Label>
                <InputGroup className="input-group-alternative">
                  <InputGroup.Text className="bg-light">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by email"
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    className="border-start-0"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-light"
              className="me-2 text-dark"
              onClick={() => setFilters({ userName: "", fullName: "", email: "" })}
            >
              <FaSync className="me-2" />
              Reset Filters
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Employee Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-primary">Employee Records</h5>
            <div className="d-flex align-items-center">
              <span className="text-muted small me-2">Show:</span>
              <Form.Select
                size="sm"
                className="form-select-sm"
                style={{ width: "80px" }}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="px-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading employee data...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">#</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Employee</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Contact</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Salary</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <tr key={emp.id}>
                      <td className="ps-4">
                        <span className="text-xs font-weight-bold">{(currentPage - 1) * itemsPerPage + idx + 1}</span>
                      </td>
                      <td>
                        <div className="d-flex px-2 py-1">
                          <div className="d-flex flex-column justify-content-center">
                            <h6 className="mb-0 text-sm">{emp.fullName}</h6>
                            <p className="text-xs text-secondary mb-0">
                              <FaIdCard className="me-1" /> {emp.code} - @{emp.userName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-xs font-weight-bold mb-1">
                            <FaEnvelope className="me-1" /> {emp.email}
                          </span>
                          <span className="text-xs text-secondary">
                            <FaPhone className="me-1" /> {emp.phone || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-xs font-weight-bold">
                            {formatCurrency(
                              emp.employmentHistories?.find(h => h.isNewest)?.salaryPolicies?.find(p => p.isNewest)?.baseSalary || 0
                            )} VNĐ
                          </span>
                          <span className="text-xs text-secondary">
                            {
                              emp.employmentHistories?.find(h => h.isNewest)?.salaryPolicies?.find(p => p.isNewest)?.salaryType === SalaryType.FIXED 
                                ? "Monthly" 
                                : "Hourly"
                            }
                          </span>
                        </div>
                      </td>
                      <td>{renderStatus(emp.deleted)}</td>
                      <td className="text-end pe-4">
                        <div className="d-flex  justify-content-end">
                          {emp.email === user.email ? (
                            <span className="badge badge-sm bg-light text-dark">Your account</span>
                          ) : (
                            <>
                              {emp.deleted ? (
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => handleRestore(emp)}
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
                                    onClick={() => handleDelete(emp)}
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </Button>
                                </>
                              )}
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

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="text-muted small">
          Showing <span className="fw-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="fw-bold">{Math.min(currentPage * itemsPerPage, totalElement)}</span> of{" "}
          <span className="fw-bold">{totalElement}</span> employees
        </div>
        <Pagination className="mb-0">
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

          {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
            let pageNumber
            if (totalPage <= 5) {
              pageNumber = i + 1
            } else if (currentPage <= 3) {
              pageNumber = i + 1
            } else if (currentPage >= totalPage - 2) {
              pageNumber = totalPage - 4 + i
            } else {
              pageNumber = currentPage - 2 + i
            }

            return (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            )
          })}

          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPage} />
          <Pagination.Last onClick={() => handlePageChange(totalPage)} disabled={currentPage === totalPage} />
        </Pagination>
      </div>

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
            <Informations employee={selectedEmployee} />
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

      {/* Add/Edit Employee Modal */}
      <Modal
        show={showFormModal}
        onHide={() => {
          setShowFormModal(false)
          resetForm()
          setIsEditing(false)
        }}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-primary">
            <h4 className="mb-0">
              {isEditing ? (
                <>
                  <FaEdit className="me-2" /> Edit Employee
                </>
              ) : (
                <>
                  <FaPlus className="me-2" /> Create New Employee
                </>
              )}
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 pb-4">
          <Form onSubmit={handleSubmit}>
            {/* Personal Information Card */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pb-0">
                <h6 className="mb-3 text-primary">
                  <FaUserTie className="me-2" />
                  Personal Information
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">Username</Form.Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroup.Text className="bg-light">
                          <FaIdCard className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                          required
                          disabled={isEditing}
                          isInvalid={!!errors.userName}
                          className="border-start-0"
                          placeholder="employee123"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">Full Name</Form.Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroup.Text className="bg-light">
                          <FaUserTie className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                          isInvalid={!!errors.fullName}
                          className="border-start-0"
                          placeholder="John Doe"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">Email</Form.Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroup.Text className="bg-light">
                          <FaEnvelope className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled={isEditing}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          isInvalid={!!errors.email}
                          className="border-start-0"
                          placeholder="employee@company.com"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">Phone</Form.Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroup.Text className="bg-light">
                          <FaPhone className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          isInvalid={!!errors.phone}
                          className="border-start-0"
                          placeholder="+1 (555) 123-4567"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">Employee Code</Form.Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroup.Text className="bg-light">
                          <FaIdCard className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="code"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          required
                          isInvalid={!!errors.code}
                          className="border-start-0"
                          placeholder="EMP-001"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">Role</Form.Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroup.Text className="bg-light">
                          <FaUserTie className="text-muted" />
                        </InputGroup.Text>
                        <Form.Select
                          value={formData.roleName}
                          onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                          required
                          className="border-start-0"
                        >
                          {roles.map((ro, index) => (
                            <option key={index} value={ro.roleName}>
                              {ro.roleName}
                            </option>
                          ))}
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Employment Details Card */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pb-0">
                <h6 className="mb-3 text-primary">
                  <FaCalendarAlt className="me-2" />
                  Employment Details
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">Start Date</Form.Label>
                      <DatePicker
                        selected={formData.startDate}
                        onChange={(date) => setFormData({ ...formData, startDate: date })}
                        className="form-control ps-3"
                        dateFormat="MMMM d, yyyy"
                        required
                        placeholderText="Select start date"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">End Date (Optional)</Form.Label>
                      <DatePicker
                        selected={formData.endDate}
                        onChange={(date) => setFormData({ ...formData, endDate: date })}
                        className="form-control ps-3"
                        dateFormat="MMMM d, yyyy"
                        minDate={formData.startDate}
                        isClearable
                        placeholderText="No end date"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Salary Information Card */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pb-0">
                <h6 className="mb-3 text-primary">
                  <FaMoneyBillWave className="me-2" />
                  Salary Information
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">Salary Type</Form.Label>
                      <Form.Select
                        value={formData.salaryType}
                        onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
                        required
                        className="ps-3"
                      >
                        <option value={SalaryType.FIXED}>Fixed Monthly Salary</option>
                        <option value={SalaryType.HOURLY}>Hourly Wage</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small">
                        {formData.salaryType === SalaryType.FIXED ? "Monthly Salary" : "Hourly Rate"}
                      </Form.Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroup.Text className="bg-light">VNĐ</InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="baseSalary"
                          value={
                            typeof formData.baseSalary === "number"
                              ? formatCurrency(formData.baseSalary)
                              : formData.baseSalary
                          }
                          onChange={(e) => {
                            const formattedValue = e.target.value.replace(/\./g, "")
                            const numericValue = formattedValue ? Number.parseInt(formattedValue, 10) : ""
                            setFormData({ ...formData, baseSalary: numericValue })
                          }}
                          required
                          isInvalid={!!errors.baseSalary}
                          className="border-start-0"
                          placeholder={formData.salaryType === SalaryType.FIXED ? "e.g. 3.000.000" : "e.g. 150.000"}
                          onBlur={(e) => {
                            if (e.target.value) {
                              const numericValue = parseFormattedCurrency(e.target.value)
                              setFormData({ ...formData, baseSalary: numericValue })
                            }
                          }}
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.baseSalary}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Additional Information Card */}
            {!isEditing && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-0 pb-0">
                  <h6 className="mb-3 text-primary">
                    <FaKey className="me-2" />
                    Account Setup
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted small">Password</Form.Label>
                        <InputGroup className="input-group-alternative">
                          <InputGroup.Text className="bg-light">
                            <FaKey className="text-muted" />
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            isInvalid={!!errors.password}
                            className="border-start-0"
                            placeholder="Create password"
                          />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted small">Notes</Form.Label>
                        <InputGroup className="input-group-alternative">
                          <InputGroup.Text className="bg-light">
                            <FaStickyNote className="text-muted" />
                          </InputGroup.Text>
                          <Form.Control
                            as="textarea"
                            rows={1}
                            name="note"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="border-start-0"
                            placeholder="Additional notes..."
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="outline-secondary"
                className="me-3 px-4"
                onClick={() => {
                  setShowFormModal(false)
                  resetForm()
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading} className="px-4">
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : isEditing ? (
                  "Update Employee"
                ) : (
                  "Create Employee"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default EmployeeManagement

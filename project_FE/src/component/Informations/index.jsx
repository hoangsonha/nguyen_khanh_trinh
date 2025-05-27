// import { Card, Row, Col, Badge } from "react-bootstrap";
// import { FaUserCircle } from "react-icons/fa";

// function Informations({ employee }) {
//   if (!employee) return null;

//   return (
//     <Card className="shadow">
//       <Card.Header className="bg-primary text-white d-flex align-items-center">
//         <FaUserCircle size={24} className="me-2" />
//         <h5 className="mb-0">Information</h5>
//       </Card.Header>
//       <Card.Body>
//         <Row className="mb-3">
//           <Col md={6}><strong>User name:</strong> {employee.userName}</Col>
//           <Col md={6}><strong>Full name:</strong> {employee.fullName}</Col>
//         </Row>
//         <Row className="mb-3">
//           <Col md={6}><strong>Email:</strong> {employee.email}</Col>
//           <Col md={6}><strong>Phone:</strong> {employee.phone}</Col>
//         </Row>
//         <Row className="mb-3">
//           <Col md={6}><strong>Code:</strong> {employee.code}</Col>
//           <Col md={6}>
//             <strong>Role:</strong> <Badge bg="info">{employee.roleName}</Badge>
//           </Col>
//         </Row>
//         <Row className="mb-3">
//           <Col md={6}>
//             <strong>Status:</strong>{" "}
//             <Badge bg={employee.enabled ? "success" : "secondary"}>
//               {employee.enabled ? "Actived" : "Inactived"}
//             </Badge>
//           </Col>
//           <Col md={6}>
//             <strong>Locked:</strong>{" "}
//             <Badge bg={employee.nonLocked ? "success" : "danger"}>
//               {employee.nonLocked ? "Non locked" : "Locked"}
//             </Badge>
//           </Col>
//         </Row>
//       </Card.Body>
//     </Card>
//   );
// }

// export default Informations;

import { Card, Row, Col, Badge, Table, Accordion } from "react-bootstrap";
import { 
  FaUserCircle, 
  FaIdCard, 
  FaEnvelope, 
  FaPhone, 
  FaUserTag, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaHistory, 
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaUnlock
} from "react-icons/fa";

function Informations({ employee }) {
  
  console.log(employee)
  
  if (!employee) return null;

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format currency in Vietnamese format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="employee-details">
      {/* Personal Information Card */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Header className="bg-gradient-primary text-white d-flex align-items-center py-3">
          <FaUserCircle size={24} className="me-2" />
          <h5 className="mb-0 fw-bold">Employee Information</h5>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="mb-4">
            <Col md={6} className="mb-3 mb-md-0">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-box bg-light rounded-circle p-2 me-3">
                  <FaIdCard className="text-primary" size={18} />
                </div>
                <div>
                  <div className="text-muted small">Employee ID</div>
                  <div className="fw-bold">{employee.code}</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <div className="icon-box bg-light rounded-circle p-2 me-3">
                  <FaUserCircle className="text-primary" size={18} />
                </div>
                <div>
                  <div className="text-muted small">Username</div>
                  <div className="fw-bold">{employee.userName}</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <div className="icon-box bg-light rounded-circle p-2 me-3">
                  <FaUserTag className="text-primary" size={18} />
                </div>
                <div>
                  <div className="text-muted small">Role</div>
                  <Badge bg="primary" pill className="px-3 py-2">
                    {employee.roleName.replace('ROLE_', '')}
                  </Badge>
                </div>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <div className="icon-box bg-light rounded-circle p-2 me-3">
                  <FaUserCircle className="text-primary" size={18} />
                </div>
                <div>
                  <div className="text-muted small">Full Name</div>
                  <div className="fw-bold">{employee.fullName}</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <div className="icon-box bg-light rounded-circle p-2 me-3">
                  <FaEnvelope className="text-primary" size={18} />
                </div>
                <div>
                  <div className="text-muted small">Email</div>
                  <div className="fw-bold">{employee.email}</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <div className="icon-box bg-light rounded-circle p-2 me-3">
                  <FaPhone className="text-primary" size={18} />
                </div>
                <div>
                  <div className="text-muted small">Phone</div>
                  <div className="fw-bold">{employee.phone || 'N/A'}</div>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="status-section p-3 bg-light rounded-3 mt-2">
            <h6 className="mb-3 text-primary d-flex align-items-center">
              <FaInfoCircle className="me-2" />
              Account Status
            </h6>
            <Row>
              <Col md={4} className="mb-2 mb-md-0">
                <div className="d-flex align-items-center">
                  {employee.enabled ? 
                    <FaCheckCircle className="text-success me-2" size={18} /> : 
                    <FaTimesCircle className="text-secondary me-2" size={18} />
                  }
                  <div>
                    <div className="text-muted small">Account</div>
                    <Badge bg={employee.enabled ? "success" : "secondary"} className="px-3">
                      {employee.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </Col>
              
              <Col md={4} className="mb-2 mb-md-0">
                <div className="d-flex align-items-center">
                  {employee.nonLocked ? 
                    <FaUnlock className="text-success me-2" size={18} /> : 
                    <FaLock className="text-danger me-2" size={18} />
                  }
                  <div>
                    <div className="text-muted small">Locked</div>
                    <Badge bg={employee.nonLocked ? "success" : "danger"} className="px-3">
                      {employee.nonLocked ? "Unlocked" : "Locked"}
                    </Badge>
                  </div>
                </div>
              </Col>
              
              <Col md={4}>
                <div className="d-flex align-items-center">
                  {!employee.deleted ? 
                    <FaCheckCircle className="text-success me-2" size={18} /> : 
                    <FaTimesCircle className="text-danger me-2" size={18} />
                  }
                  <div>
                    <div className="text-muted small">Deleted</div>
                    <Badge bg={!employee.deleted ? "success" : "danger"} className="px-3">
                      {!employee.deleted ? "No" : "Yes"}
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      {/* Employment History Card */}
      {employee.employmentHistories && employee.employmentHistories.length > 0 && (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-gradient-primary text-white d-flex align-items-center py-3">
            <FaHistory size={24} className="me-2" />
            <h5 className="mb-0 fw-bold">Employment History</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <Accordion defaultActiveKey="0" className="employment-history">
              {employee.employmentHistories.map((history, index) => (
                <Accordion.Item key={index} eventKey={index.toString()} className="border-0 mb-3 shadow-sm">
                  <Accordion.Header>
                    <div className="d-flex align-items-center w-100 justify-content-between pe-3">
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="text-primary me-2" />
                        <span className="fw-bold">
                          {formatDate(history.startDate)} - {formatDate(history.endDate)}
                        </span>
                      </div>
                      <Badge 
                        bg={history.status === "ACTIVE" ? "success" : 
                           history.status === "PENDING" ? "warning" : "secondary"}
                        className="ms-2 px-3"
                      >
                        {history.status}
                      </Badge>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="bg-light rounded-bottom">
                    {history.note && (
                      <div className="mb-3 p-3 bg-white rounded">
                        <h6 className="text-primary mb-2">Notes</h6>
                        <p className="mb-0">{history.note || "No notes available"}</p>
                      </div>
                    )}
                    
                    <h6 className="text-primary mb-3 d-flex align-items-center">
                      <FaMoneyBillWave className="me-2" />
                      Salary Information
                    </h6>
                    
                    <div className="table-responsive">
                      <Table hover className="bg-white rounded">
                        <thead className="table-light">
                          <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Effective From</th>
                            <th>Effective To</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.salaryPolicies && history.salaryPolicies.map((salary, idx) => (
                            <tr key={idx}>
                              <td>
                                <Badge bg="info" className="px-3">
                                  {salary.salaryType === "FIXED" ? "Monthly" : "Hourly"}
                                </Badge>
                              </td>
                              <td className="fw-bold text-primary">
                                {formatCurrency(salary.baseSalary)}
                              </td>
                              <td>{formatDate(salary.effectiveFrom)}</td>
                              <td>{formatDate(salary.effectiveTo)}</td>
                              <td>
                                <Badge bg={salary.isNewest && !salary.deleted ? "success" : "danger"} className="px-3">
                                  {salary.isNewest && !salary.deleted ? "Valid" : "Invalid"}
                                </Badge>
                                {/* {console.log('Salary:', { 
                                  isNewest: salary.isNewest, 
                                  isDeleted: salary.isDeleted,
                                  condition: salary.isNewest && !salary.isDeleted 
                                })} */}
                              </td>
                            </tr>
                          ))}
                          {(!history.salaryPolicies || history.salaryPolicies.length === 0) && (
                            <tr>
                              <td colSpan={4} className="text-center">No salary information available</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Informations;
import { useContext, useEffect, useState } from "react";
import { 
  Container, 
  Button, 
  Spinner, 
  Badge, 
  Col, 
  Row, 
  Card, 
  Table,
  ListGroup,
  Accordion,
  Alert
} from "react-bootstrap";
import { FaUserCircle, FaUsers, FaTasks, FaExclamationTriangle, FaUser, FaEnvelope, FaIdCard, FaInfoCircle } from "react-icons/fa";

function ProjectDetails({ project }) {

  const renderStatusBadge = (status) => {
    let bg = "secondary";
    let text = "Unknown";
    
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
    
    return <Badge bg={bg}>{text}</Badge>;
  };

  return (
    // <Container className="mt-4">

    //   {!project ? (
    //     <div className="text-center my-5">
    //       <Spinner animation="border" variant="primary" />
    //       <p className="mt-3">Loading...</p>
    //     </div>
    //   ) : project ? (
    //     <>
    //       <Card className="shadow mb-4">
    //         <Card.Header className="bg-primary text-white d-flex align-items-center">
    //           <FaUserCircle size={24} className="me-2" />
    //           <h5 className="mb-0">Project Information</h5>
    //         </Card.Header>
    //         <Card.Body>
    //           <Row className="mb-3">
    //             <Col md={6}>
    //               <strong>Project Name:</strong> 
    //               <div className="fs-5">{project.name}</div>
    //             </Col>
    //             <Col md={6}>
    //               <strong>Status:</strong>
    //               <div>{renderStatusBadge(project.projectStatus)}</div>
    //             </Col>
    //           </Row>
              
    //           <Row className="mb-3">
    //             <Col md={6}>
    //               <strong>Start Date:</strong>
    //               <div>{project.startDate}</div>
    //             </Col>
    //             <Col md={6}>
    //               <strong>End Date:</strong>
    //               <div>{project.endDate}</div>
    //             </Col>
    //           </Row>
              
    //           <Row className="mb-3">
    //             <Col md={12}>
    //               <strong>Description:</strong>
    //               <div className="p-2 bg-light rounded">{project.description || "No description"}</div>
    //             </Col>
    //           </Row>
              
    //           <Row>
    //             <Col md={12}>
    //               <strong>Created By:</strong>
    //               <div>
    //                 Code: <Badge bg="info" className="me-2">{project.employeeCode}</Badge>
    //                 Full Name: <Badge bg="info" className="me-2">{project.employeeFullName}</Badge>
    //                 Email: <Badge bg="info" className="me-2">{project.employeeEmail}</Badge>
    //               </div>
    //             </Col>
    //           </Row>
    //         </Card.Body>
    //       </Card>

    //       <Accordion defaultActiveKey="0" className="mb-4">
    //         <Accordion.Item eventKey="0">
    //           <Accordion.Header>
    //             <FaUsers className="me-2" />
    //             Team Members ({project.members?.length || 0})
    //           </Accordion.Header>
    //           <Accordion.Body>
    //             {project.members?.length > 0 ? (
    //               <Table striped bordered hover>
    //                 <thead>
    //                   <tr>
    //                     <th>#</th>
    //                     <th>Employee Code</th>
    //                     <th>Email</th>
    //                     <th>Role</th>
    //                     <th>Status</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {project.members.map((member, index) => (
    //                     <tr key={member.id}>
    //                       <td>{index + 1}</td>
    //                       <td>{member.employeeCode}</td>
    //                       <td>{member.employeeEmail}</td>
    //                       <td>{member.roleInProject.split('@')[0].split('.').pop()}</td>
    //                       <td>{renderStatusBadge(member.status)}</td>
    //                     </tr>
    //                   ))}
    //                 </tbody>
    //               </Table>
    //             ) : (
    //               <div className="text-center py-3 text-muted">
    //                 No members assigned to this project
    //               </div>
    //             )}
    //           </Accordion.Body>
    //         </Accordion.Item>

    //         <Accordion.Item eventKey="1">
    //           <Accordion.Header>
    //             <FaTasks className="me-2" />
    //             Tasks ({project.tasks?.length || 0})
    //           </Accordion.Header>
    //           <Accordion.Body>
    //             {project.tasks?.length > 0 ? (
    //               <ListGroup variant="flush">
    //                 {project.tasks.map(task => (
    //                   <ListGroup.Item key={task.id}>
    //                     {task.name}
    //                   </ListGroup.Item>
    //                 ))}
    //               </ListGroup>
    //             ) : (
    //               <div className="text-center py-3 text-muted">
    //                 No tasks created for this project
    //               </div>
    //             )}
    //           </Accordion.Body>
    //         </Accordion.Item>
    //       </Accordion>
    //     </>
    //   ) : (
    //     <p className="text-danger text-center">Project not found.</p>
    //   )}
    // </Container>
  
    <Container className="mt-4">
  {!project ? (
    <div className="text-center my-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3">Loading...</p>
    </div>
  ) : project ? (
    <>
      {/* Project Information Card */}
      <Card className="shadow mb-4">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <FaInfoCircle size={24} className="me-2" />
          <h5 className="mb-0">Project Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-4">
                <h6 className="text-muted mb-2">Project Name</h6>
                <p className="fs-4 fw-bold">{project.name}</p>
              </div>
              
              <div className="mb-4">
                <h6 className="text-muted mb-2">Description</h6>
                <div className="p-3 bg-light rounded">
                  {project.description || "No description available"}
                </div>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="mb-4">
                <h6 className="text-muted mb-2">Status</h6>
                <div className="fs-5">{renderStatusBadge(project.projectStatus)}</div>
              </div>
              
              <div className="mb-4">
                <h6 className="text-muted mb-2">Timeline</h6>
                <div className="d-flex gap-4">
                  <div>
                    <h6 className="text-muted small">Start Date</h6>
                    <p>{project.startDate}</p>
                  </div>
                  <div>
                    <h6 className="text-muted small">End Date</h6>
                    <p>{project.endDate}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-muted mb-2">Created By</h6>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="info" className="d-flex align-items-center">
                    <FaIdCard className="me-1" /> {project.employeeCode || "N/A"}
                  </Badge>
                  <Badge bg="info" className="d-flex align-items-center">
                    <FaUser className="me-1" /> {project.employeeFullName || "N/A"}
                  </Badge>
                  <Badge bg="info" className="d-flex align-items-center">
                    <FaEnvelope className="me-1" /> {project.employeeEmail || "N/A"}
                  </Badge>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Team Members Card */}
      <Accordion defaultActiveKey="0" className="mb-4">

  {/* Team Members Accordion */}
  <Accordion.Item eventKey="0">
    <Accordion.Header>
      <FaUsers className="me-2 text-primary" />
      Team Members ({project.members?.length || 0})
    </Accordion.Header>
    <Accordion.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
      {project.members?.length > 0 ? (
        <div className="table-responsive">
          <Table striped hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th width="5%">#</th>
                <th width="20%">Code</th>
                <th width="30%">Email</th>
                <th width="20%">Role</th>
                <th width="15%">Status</th>
              </tr>
            </thead>
            <tbody>
              {project.members.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>{member.employeeCode}</td>
                  <td>{member.employeeEmail}</td>
                  <td>
                    <Badge bg="secondary">
                      {member.roleInProject.split('@')[0].split('.').pop()}
                    </Badge>
                  </td>
                  <td>{renderStatusBadge(member.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-4 text-muted">
          <FaUsers size={32} className="mb-2" />
          <p>No members assigned to this project</p>
        </div>
      )}
    </Accordion.Body>
  </Accordion.Item>

  {/* Tasks Accordion */}
  <Accordion.Item eventKey="1">
    <Accordion.Header>
      <FaTasks className="me-2 text-primary" />
      Tasks ({project.tasks?.length || 0})
    </Accordion.Header>
   <Accordion.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
      {project.tasks?.length > 0 ? (
        <ListGroup variant="flush">
          {project.tasks.map(task => (
            <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center py-3">
              <div>
                <h6 className="mb-1 fw-bold">{task.name}</h6>
                <small className="text-muted">{task.description || "No description"}</small>
              </div>
              <Badge bg={task.status === 'completed' ? 'success' : 'warning'} className="fs-6">
                {task.status}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="text-center py-4 text-muted">
          <FaTasks size={32} className="mb-2" />
          <p>No tasks created for this project</p>
        </div>
      )}
    </Accordion.Body>
  </Accordion.Item>

</Accordion>
    </>
  ) : (
    <Alert variant="danger" className="text-center">
      <FaExclamationTriangle className="me-2" />
      Project not found
    </Alert>
  )}
</Container>
  );
}

export default ProjectDetails;
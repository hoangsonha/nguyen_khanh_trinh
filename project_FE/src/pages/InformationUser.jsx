import { useContext, useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import { getEmployeeById } from "../serviceAPI/employeeService";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";

function InformationUser() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const result = await getEmployeeById(user.id);
      setUserLogin(result.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" />
        Quay lại
      </Button>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải thông tin...</p>
        </div>
      ) : userLogin ? (
        <Card className="shadow">
          <Card.Header className="bg-primary text-white d-flex align-items-center">
            <FaUserCircle size={24} className="me-2" />
            <h5 className="mb-0">Thông tin cá nhân</h5>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}><strong>Tên đăng nhập:</strong> {userLogin.userName}</Col>
              <Col md={6}><strong>Họ và tên:</strong> {userLogin.fullName}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}><strong>Email:</strong> {userLogin.email}</Col>
              <Col md={6}><strong>Số điện thoại:</strong> {userLogin.phone}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}><strong>Mã nhân viên:</strong> {userLogin.code}</Col>
              <Col md={6}>
                <strong>Vai trò:</strong> <Badge bg="info">{userLogin.roleName}</Badge>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Trạng thái:</strong>{" "}
                <Badge bg={userLogin.enabled ? "success" : "secondary"}>
                  {userLogin.enabled ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </Col>
              <Col md={6}>
                <strong>Khóa:</strong>{" "}
                <Badge bg={userLogin.nonLocked ? "success" : "danger"}>
                  {userLogin.nonLocked ? "Không khóa" : "Đã khóa"}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-danger text-center">Không tìm thấy thông tin người dùng.</p>
      )}
    </Container>
  );
}

export default InformationUser;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [attendance, setAttendance] = useState([]);

  // ✅ Redirect ถ้ายังไม่ได้สแกนใบหน้า
  useEffect(() => {
    if (!user) return;
    if (!user.faceScanned) {
      navigate("/save-face");
    }
  }, [user, navigate]);

  // ✅ Logout
  const handleLogout = () => {
    logout(); // ล้าง context
    navigate("/login"); // กลับหน้า login
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const attendanceRes = await axios.get(`http://localhost:5000/api/attendance/history/${user.student_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendance(attendanceRes.data.history);
      } catch (err) {
        console.error("❌ ดึงข้อมูลล้มเหลว", err);
      }
    };

    fetchData();
  }, [user, token]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>🎓 หน้าหลักนักศึกษา</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>🚪 ออกจากระบบ</button>
      </div>

      {user && (
        <div className="card p-4 shadow mt-3">
          <h4>{user.full_name} ({user.student_id})</h4>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* <h3 className="mt-4">📚 วิชาที่ลงทะเบียน</h3>
      <ul className="list-group mb-4">
        {courses.map((course) => (
          <li key={course.course_id} className="list-group-item">
            {course.course_name} - {course.schedule}
          </li>
        ))}
      </ul> */}

      <div className="text-center mb-4">
        <button className="btn btn-primary w-100" onClick={() => navigate("/scan-face")}>
          📸 สแกนใบหน้าเพื่อเช็คชื่อ
        </button>
      </div>

      <h3 className="mt-4">📅 ประวัติการเช็คชื่อ</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>วันที่</th>
            <th>เวลา</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record, index) => (
            <tr key={index}>
              <td>{new Date(record.scan_time).toLocaleDateString()}</td>
              <td>{new Date(record.scan_time).toLocaleTimeString()}</td>
              <td>
                <span className={`badge bg-${record.status === "Present" ? "success" : record.status === "Late" ? "warning" : "danger"}`}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashboard;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <span className="navbar-brand">🎓 Face Attendance</span>

        {user && (
          <>
            <div className="navbar-nav me-auto">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
              <Link className="nav-link" to="/scan-face">Scan</Link>
              <Link className="nav-link" to="/attendance-history">History</Link>
            </div>

            <div className="d-flex align-items-center text-white me-3">
              <small>
                👤 {user.full_name} ({user.student_id}) - <b>{user.role}</b>
              </small>
            </div>

            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              🚪 Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

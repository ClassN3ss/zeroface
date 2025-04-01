import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const Login = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ เพิ่มเพื่ออัปเดต context

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        studentId,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(user, token); // ✅ แจ้งให้ AuthContext รู้ว่า login แล้ว

      alert("✅ Login Successful!");

      if (!user.faceScanned) {
        navigate("/save-face");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert("❌ Login Failed! Please check your credentials.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card custom-card p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Sign In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="form-control mb-3"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-3"
            required
          />
          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
        <div className="text-center mt-3">
          <a href="/register">Not have account? Register here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

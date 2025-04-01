import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import { useAuth } from "../context/AuthContext"; // ✅ ใช้ context
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const SaveFace = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { user, login } = useAuth(); // ✅ context

  const [message, setMessage] = useState("📷 หันหน้าตรง แล้วกด 'บันทึกใบหน้า'");
  const [loading, setLoading] = useState(false);

  // ✅ ปิดกล้องอย่างปลอดภัย
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("❌ ไม่สามารถเปิดกล้อง:", err);
      setMessage("❌ โปรดอนุญาตให้ใช้กล้อง");
    }
  };

  const loadModels = useCallback(async () => {
    try {
      setMessage("🔄 กำลังโหลดโมเดล...");
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      setMessage("📷 พร้อมแล้ว! หันหน้าตรง แล้วกดปุ่ม");
      startCamera();
    } catch (err) {
      console.error("❌ โหลดโมเดลไม่สำเร็จ", err);
      setMessage("❌ โหลดโมเดลไม่สำเร็จ");
    }
  }, []);

  useEffect(() => {
    loadModels();
    return () => stopCamera(); // ✅ cleanup
  }, [loadModels]);

  const captureFace = async () => {
    setLoading(true);
    setMessage("🔄 กำลังตรวจจับใบหน้า...");

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (!detections.length) {
      setMessage("❌ ไม่พบใบหน้า ลองใหม่อีกครั้ง");
      setLoading(false);
      return;
    }

    const descriptorArray = Array.from(detections[0].descriptor);

    try {
      const res = await fetch("http://localhost:5000/auth/upload-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ faceDescriptor: descriptorArray }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "❌ บันทึกใบหน้าไม่สำเร็จ");

      alert("✅ บันทึกใบหน้าสำเร็จ!");

      // ✅ อัปเดต context
      user.faceScanned = true;
      login(user, localStorage.getItem("token"));

      navigate("/dashboard");
      stopCamera();
    } catch (err) {
      console.error("❌ อัปโหลดใบหน้าไม่สำเร็จ", err);
      setMessage("❌ บันทึกใบหน้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2>📸 บันทึกใบหน้า</h2>
      <p className="mt-2">{message}</p>

      <div className="d-flex justify-content-center my-3">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="400"
          height="300"
          style={{
            transform: "scaleX(-1)",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      <div className="d-flex justify-content-center gap-2">
        <button className="btn btn-success" onClick={captureFace} disabled={loading}>
          {loading ? "กำลังบันทึก..." : "📥 บันทึกใบหน้า"}
        </button>
        <button className="btn btn-secondary" onClick={() => { stopCamera(); navigate(-1); }}>
          🔙 กลับ
        </button>
      </div>
    </div>
  );
};

export default SaveFace;

const Attendance = require("../models/Attendance");

exports.checkIn = async (req, res) => {
  try {
    const { studentId, fullName, latitude, longitude, method } = req.body;

    if (!studentId || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing check-in data" });
    }

    // Optional: เช็คเวลาว่า "late" หรือเปล่า
    const now = new Date();
    const hour = now.getHours();
    const status = hour >= 9 ? "Late" : "Present"; // ตัวอย่าง: เข้างานก่อน 9 โมง

    const newCheckIn = new Attendance({
      studentId,
      fullName,
      status,
      location_data: { latitude, longitude },
    });

    await newCheckIn.save();
    res.json({ message: "✅ เช็คชื่อสำเร็จ", status });
  } catch (err) {
    res.status(500).json({ message: "❌ เช็คชื่อไม่สำเร็จ", error: err.message });
  }
};

exports.getHistoryByStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      const history = await Attendance.find({ studentId }).sort({ scan_time: -1 });
  
      res.json({ history });
    } catch (err) {
      res.status(500).json({ message: "ไม่สามารถดึงข้อมูลประวัติได้", error: err.message });
    }
};
  

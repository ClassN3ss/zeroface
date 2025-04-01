const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../configuration/config");

const cosineDistance = (a, b) => {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return 1 - dot / (magA * magB);
};

exports.findStudentByFace = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;
    if (!faceDescriptor || faceDescriptor.length !== config.face.descriptorLength) {
      return res.status(400).json({ message: "Invalid face descriptor" });
    }

    const students = await User.find({ role: "student", faceScanned: true });

    let bestMatch = null;
    let lowestDistance = Infinity;

    for (const student of students) {
      if (!student.faceDescriptor) continue;
      const dist = cosineDistance(faceDescriptor, student.faceDescriptor);
      if (dist < lowestDistance) {
        lowestDistance = dist;
        bestMatch = student;
      }
    }

    if (!bestMatch || lowestDistance > 0.5) {
      return res.status(404).json({ message: "No matching student found" });
    }

    res.json({
      studentId: bestMatch.student_id,
      fullName: bestMatch.full_name,
      distance: lowestDistance.toFixed(4),
    });
  } catch (err) {
    res.status(500).json({ message: "Error finding student", error: err.message });
  }
};

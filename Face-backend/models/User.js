const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  full_name: { type: String, required: true },
  email: { type: String },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  faceScanned: { type: Boolean, default: false },
  faceDescriptor: { type: [Number] }, // 128 ค่า descriptor
});

module.exports = mongoose.model("User", userSchema);

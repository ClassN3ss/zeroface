const express = require("express");
const router = express.Router();
const { register, login, uploadFace } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/upload-face", uploadFace); // บันทึก face descriptor

module.exports = router;

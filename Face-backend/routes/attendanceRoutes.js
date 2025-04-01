const express = require("express");
const router = express.Router();
const { checkIn, getHistoryByStudent } = require("../controllers/attendanceController");


router.post("/checkin", checkIn);
router.get("/history/:studentId", getHistoryByStudent);

module.exports = router;

const express = require("express");
const { generateOTP, verifyOTP } = require("../controllers/authController");

const router = express.Router();

// Generate OTP
router.post("/generate-otp", generateOTP);

// Verify OTP
router.post("/verify-otp", verifyOTP);

module.exports = router;

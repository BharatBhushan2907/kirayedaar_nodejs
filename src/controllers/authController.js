const otpGenerator = require("otp-generator");
const User = require("../models/User");
const otpCache = new Map(); // Temporary OTP storage (use Redis in production)

const generateOTP = async (req, res) => {
    const { phone } = req.body;

    try {
        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        otpCache.set(phone, otp); // Store OTP temporarily

        // Simulate sending OTP via SMS (replace this with an actual SMS service)
        console.log(`OTP for ${phone}: ${otp}`);

        res.status(200).json({ message: "OTP sent successfully.", status:true });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    try {
        const validOtp = otpCache.get(phone);

        if (!validOtp || validOtp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP.", status: false });
        }

        otpCache.delete(phone); // Clear OTP after use

        // Check if user exists
        let user = await User.findOne({ phone });

        if (user) {
            return res.status(200).json({
                message: "Login successful.",
                user: {
                    phone: user.phone,
                    role: user.role,
                    isRegistered: true, // Registration is complete
                },
                status:true
            });
        } else {
            return res.status(200).json({
                message: "OTP verified. Registration pending.",
                user: {
                    phone: phone,
                    role: null, // Role is undefined since registration isn't complete
                    isRegistered: false, // Registration is pending
                },
                status:true
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

module.exports = { generateOTP, verifyOTP };

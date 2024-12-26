const express = require("express");
const { addUserDetails } = require("../controllers/userController");

const router = express.Router();

// Add user details
router.post("/add-details", addUserDetails);

module.exports = router;

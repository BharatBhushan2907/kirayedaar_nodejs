const express = require("express");
const { addProperty, getAddPropertyForm } = require("../controllers/propertyController");

const router = express.Router();

// Add a new property
router.post('/add-property', addProperty);

// get add property form content
router.get("/form", getAddPropertyForm);

// Get properties by landlord ID
// router.get("/landlord/:id", getPropertiesByLandlord);

// Get all properties
// router.get("/", getAllProperties);

module.exports = router;

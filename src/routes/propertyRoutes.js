const express = require("express");
const { addProperty, getAddPropertyForm, listProperties } = require("../controllers/propertyController");

const router = express.Router();

// Add a new property
router.post('/add-property', addProperty);

// get add property form content
router.get("/form", getAddPropertyForm);

// Get properties by landlord ID
// router.get("/landlord/:id", getPropertiesByLandlord);

// Get all properties (public, supports ?city= ?page= ?limit=)
router.get("/", listProperties);

module.exports = router;

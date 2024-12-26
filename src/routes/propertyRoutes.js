const express = require("express");
const { addProperty, getPropertiesByLandlord, getAllProperties } = require("../controllers/propertyController");

const router = express.Router();

// Add a new property
router.post("/add", addProperty);

// Get properties by landlord ID
router.get("/landlord/:id", getPropertiesByLandlord);

// Get all properties
router.get("/", getAllProperties);

module.exports = router;

const express = require("express");
const router = express.Router();
const { addTenant, getPropertiesByLandlord } = require("../controllers/landlordController");


// Route to add a tenant for a landlord
router.post("/add-tenant", addTenant);
router.get("/properties", getPropertiesByLandlord);


module.exports = router;

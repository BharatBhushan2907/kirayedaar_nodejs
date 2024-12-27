const Landlord = require("../models/Landlord");
const Property = require("../models/Property");

const addProperty = async (req, res) => {
    const { name, address, roomDetails, areaDetails, floorDetails, phone } = req.body;
    try {
        const landlord = await Landlord.findOne({ phone });
      if (!landlord) {
        return res.status(404).json({
          success: false,
          message: 'Landlord not found',
        });
      }
  
      // Create a new property
      const newProperty = new Property({
        landlordId: landlord._id,
        name,
        address,
        roomDetails,
        areaDetails,
        floorDetails,
      });
  
      const savedProperty = await newProperty.save();
  
      // Link the property to the landlord
      landlord.properties = landlord.properties || [];
      landlord.properties.push(savedProperty._id);
      await landlord.save();
  
      res.status(201).json({
        success: true,
        message: 'Property added successfully',
        property: savedProperty,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
};

const getPropertiesByLandlord = async (req, res) => {
    const { id } = req.params;

    try {
        const properties = await Property.find({ landlordId: id });
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

module.exports = { getPropertiesByLandlord, getAllProperties, addProperty };
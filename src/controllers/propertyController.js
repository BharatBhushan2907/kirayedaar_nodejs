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


const getAddPropertyForm = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Fetch landlord details from the database
    const landlord = await Landlord.findOne({ phone });

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    // Include existing property address if available
    const defaultPropertyDetails = landlord.address || {};

    const formFields = {
      sections: [
        {
          sectionTitle: "Where is it located?",
          fields: [
            { name: "city", type: "text", label: "City", required: true, defaultValue: defaultPropertyDetails.city || "" },
            { name: "society", type: "text", label: "Society", required: true, defaultValue: defaultPropertyDetails.society || "" },
            { name: "locality", type: "text", label: "Locality", required: true, defaultValue: defaultPropertyDetails.locality || "" },
            { name: "houseNumber", type: "text", label: "House Number", required: true, defaultValue: defaultPropertyDetails.houseNumber || "" },
          ],
        },
        {
          sectionTitle: "Room Details",
          fields: [
            { name: "bedrooms", type: "number", label: "Number of Bedrooms", required: true },
            { name: "bathrooms", type: "number", label: "Number of Bathrooms", required: true },
            { name: "balconies", type: "number", label: "Number of Balconies", required: false },
            { name: "otherRooms", type: "array", label: "Other Rooms (e.g., Study, Servant Room)", required: false },
            { name: "parkingAvailable", type: "boolean", label: "Parking Available?", required: true },
          ],
        },
        {
          sectionTitle: "Area Details",
          fields: [
            { name: "carpetArea", type: "number", label: "Carpet Area (in sq. ft.)", required: true },
            { name: "builtUpArea", type: "number", label: "Built-up Area (in sq. ft.)", required: false },
            { name: "superBuiltUpArea", type: "number", label: "Super Built-up Area (in sq. ft.)", required: false },
          ],
        },
        {
          sectionTitle: "Floor Details",
          fields: [
            { name: "totalFloors", type: "number", label: "Total Floors in Building", required: true },
            { name: "propertyOnFloor", type: "number", label: "Property Floor Number", required: true },
          ],
        },
      ],
    };

    res.status(200).json({
      success: true,
      message: "Property form retrieved successfully",
      form: formFields,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching property form",
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

module.exports = { getPropertiesByLandlord, getAllProperties, addProperty, getAddPropertyForm };
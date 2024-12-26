const Property = require("../models/Property");

const addProperty = async (req, res) => {
    const { name, address, rent, landlordId } = req.body;

    try {
        const newProperty = new Property({ name, address, rent, landlordId });
        await newProperty.save();

        res.status(201).json({ message: "Property added successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
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
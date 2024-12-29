const Tenant = require("../models/Tenant");
const Landlord = require("../models/Landlord");
const Property = require("../models/Property");

exports.addTenant = async (req, res) => {
  try {
    const { landlordPhoneNumber, tenantPhoneNumber, propertyId } = req.body;

    // Validate input
    if (!landlordPhoneNumber || !tenantPhoneNumber || !propertyId) {
      return res.status(400).json({
        success: false,
        message: "Landlord phone number, tenant phone number, and property ID are required.",
      });
    }

    // Find the landlord by phone number
    const landlord = await Landlord.findOne({ phone: landlordPhoneNumber });
    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found.",
      });
    }

    // Check if the property belongs to the landlord
    const property = await Property.findOne({ _id: propertyId, landlordId: landlord._id });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property does not belong to this landlord.",
      });
    }

    // Check if the tenant already exists
    let tenant = await Tenant.findOne({ phoneNumber: tenantPhoneNumber });

    if (!tenant) {
      // Create a new tenant if not found
      tenant = new Tenant({
        phone: tenantPhoneNumber,
        landlords: [
          {
            landlord: landlord._id,
            property: property._id,
            isActive: true,
            startDate: new Date(),
          },
        ]
      });

      await tenant.save();
    } else {
      // Check if the landlord is already linked
      const existingLandlordLink = tenant.landlords.find(
        (entry) => entry.landlord.toString() === landlord._id.toString() && entry.isActive
      );

      if (existingLandlordLink) {
        return res.status(400).json({
          success: false,
          message: "This landlord is already linked with the tenant.",
        });
      }

      // Add the landlord and property to the tenant's respective arrays
      tenant.landlords.push({
        landlord: landlord._id,
        property: property._id,
        isActive: true,
        startDate: new Date(),
      });

      await tenant.save();
    }

    // Add tenant to landlord's tenants list if not already present
    const existingTenantLink = landlord.tenants.find(
      (tenantId) => tenantId.toString() === tenant._id.toString()
    );

    if (!existingTenantLink) {
      landlord.tenants.push(tenant._id);
      await landlord.save();
    }

    res.status(200).json({
      success: true,
      message: "Tenant added successfully.",
      tenant: {
        phone: tenant.phoneNumber,
        landlords: tenant.landlords,
        properties: tenant.properties,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while adding tenant.",
    });
  }
};


exports.getPropertiesByLandlord = async (req, res) => {
  try {
    const { phone } = req.query;

    // Validate input
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Landlord phone number is required.",
      });
    }

    // Find the landlord by phone number
    const landlord = await Landlord.findOne({ phone: phone });

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found.",
      });
    }

    // Fetch all properties linked to the landlord
    const properties = await Property.find({ landlordId: landlord._id });

    res.status(200).json({
      success: true,
      message: "Properties fetched successfully.",
      properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching properties.",
    });
  }
};

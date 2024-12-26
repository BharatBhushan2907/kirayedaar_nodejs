const Landlord = require("../models/Landlord");
const Tenant = require("../models/Tenant");
const { UserRole, TenantStatus, ApprovalStatus } = require('../enums/enums');


const addUserDetails = async (req, res) => {
    const { phone, role, name, email, address } = req.body;

    try {
        // Validate role input
        if (!Object.values(UserRole).includes(role)) {
            return res.status(400).json({ message: "Invalid role provided." , status:false});
        }

        if (!phone || !name || !address) {
            return res.status(400).json({ message: "Phone, name, and address are required.", status:false });
        }

        // Address validation
        const { houseNumber, society, locality, city, pinCode, state } = address;
        if (!houseNumber || !society || !locality || !city || !pinCode || !state) {
            return res.status(400).json({ message: "Complete address details are required.",  status:false });
        }

        // Handle landlord details
        if (role === "LANDLORD") {
            let landlord = await Landlord.findOne({ phone });
            if (!landlord) {
                landlord = new Landlord({
                    phone,
                    name,
                    email,
                    address,
                });
                await landlord.save();
                return res.status(201).json({ message: "Landlord details added successfully.", landlord,  status:true });
            } else {
                return res.status(400).json({ message: "Landlord already exists with this phone number.",  status:false });
            }
        }

        // Handle tenant details
        if (role === "TENANT") {
            let tenant = await Tenant.findOne({ phone });
            if (tenant) {
                return res.status(400).json({ message: "Tenant already exists with this phone number." });
            }

            tenant = new Tenant({
                phone,
                name,
                email,
                address,
                landlord: null, // No landlord linked by default
                isApproved: false, // Approval will be handled separately
            });

            await tenant.save();

            res.status(201).json({
                message: "Tenant details added successfully.",
                tenant,
                approvalStatus: TenantStatus.PENDING_APPROVAL,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

module.exports = { addUserDetails };


module.exports = { addUserDetails };


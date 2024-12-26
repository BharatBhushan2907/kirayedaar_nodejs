// Define all enums as constants
const UserRole = Object.freeze({
    LANDLORD: "LANDLORD",
    TENANT: "TENANT",
});

const TenantStatus = Object.freeze({
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    PENDING_APPROVAL: "PENDING_APPROVAL",
});

const ApprovalStatus = Object.freeze({
    APPROVED: "APPROVED",
    PENDING: "PENDING",
    REJECTED: "REJECTED",
});

// Export enums for use across the application
module.exports = {
    UserRole,
    TenantStatus,
    ApprovalStatus,
};

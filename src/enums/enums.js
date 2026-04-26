const UserRole = Object.freeze({
  LANDLORD: 'LANDLORD',
  TENANT: 'TENANT',
});

const TenancyStatus = Object.freeze({
  PENDING: 'pending',
  ACTIVE: 'active',
  ENDED: 'ended',
  REJECTED: 'rejected',
});

const RentStatus = Object.freeze({
  PAID: 'paid',
  PENDING: 'pending',
});

const EvidenceType = Object.freeze({
  MOVE_IN: 'move-in',
  MOVE_OUT: 'move-out',
});

// Legacy — kept for backwards compatibility
const TenantStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
});

const ApprovalStatus = Object.freeze({
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
});

module.exports = {
  UserRole,
  TenancyStatus,
  RentStatus,
  EvidenceType,
  TenantStatus,
  ApprovalStatus,
};

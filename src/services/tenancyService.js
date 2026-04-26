const Tenancy = require('../models/Tenancy');
const Tenant = require('../models/Tenant');
const Landlord = require('../models/Landlord');
const Property = require('../models/Property');
const AppError = require('../utils/AppError');

const requestLink = async (landlordId, { tenantPhone, propertyId, rentAmount, depositAmount, startDate }) => {
  // Validate landlord owns the property
  const property = await Property.findOne({ _id: propertyId, landlordId });
  if (!property) throw new AppError('Property not found or does not belong to you', 404);

  // Find registered tenant
  const tenant = await Tenant.findOne({ phone: tenantPhone });
  if (!tenant) throw new AppError('Tenant not found. They must register first', 404);

  // No active tenancy for this property
  const existing = await Tenancy.findOne({ propertyId, status: 'active' });
  if (existing) throw new AppError('This property already has an active tenancy', 409);

  // No pending request between same pair
  const pendingExists = await Tenancy.findOne({
    landlordId,
    tenantId: tenant._id,
    propertyId,
    status: 'pending',
  });
  if (pendingExists) throw new AppError('A pending tenancy request already exists', 409);

  const tenancy = await Tenancy.create({
    tenantId: tenant._id,
    landlordId,
    propertyId,
    rentAmount,
    depositAmount,
    startDate,
  });

  return tenancy;
};

const respondLink = async (tenantId, { tenancyId, action }) => {
  const tenancy = await Tenancy.findOne({ _id: tenancyId, tenantId, status: 'pending' });
  if (!tenancy) throw new AppError('Tenancy request not found or already responded', 404);

  if (action === 'approve') {
    tenancy.status = 'active';
    await tenancy.save();

    // Sync embedded arrays for profile lookups
    await Promise.all([
      Tenant.findByIdAndUpdate(tenantId, {
        $push: {
          landlords: {
            landlord: tenancy.landlordId,
            property: tenancy.propertyId,
            isActive: true,
            startDate: tenancy.startDate,
          },
        },
      }),
      Landlord.findByIdAndUpdate(tenancy.landlordId, {
        $addToSet: { 'tenants': { tenant: tenantId, isActive: true, startDate: tenancy.startDate } },
      }),
    ]);
  } else {
    tenancy.status = 'rejected';
    await tenancy.save();
  }

  return tenancy;
};

const listTenancies = async (userId, role) => {
  const filter = role === 'LANDLORD' ? { landlordId: userId } : { tenantId: userId };
  return Tenancy.find(filter)
    .populate('tenantId', 'name phone email')
    .populate('landlordId', 'name phone email')
    .populate('propertyId', 'name address')
    .sort({ createdAt: -1 })
    .lean();
};

const endTenancy = async (userId, role, tenancyId) => {
  const filter = role === 'LANDLORD'
    ? { _id: tenancyId, landlordId: userId, status: 'active' }
    : { _id: tenancyId, tenantId: userId, status: 'active' };

  const tenancy = await Tenancy.findOne(filter);
  if (!tenancy) throw new AppError('Active tenancy not found', 404);

  tenancy.status = 'ended';
  tenancy.endDate = new Date();
  await tenancy.save();

  // Deactivate embedded references
  await Promise.all([
    Tenant.updateOne(
      { _id: tenancy.tenantId, 'landlords.landlord': tenancy.landlordId },
      { $set: { 'landlords.$.isActive': false, 'landlords.$.endDate': new Date() } }
    ),
    Landlord.updateOne(
      { _id: tenancy.landlordId, 'tenants.tenant': tenancy.tenantId },
      { $set: { 'tenants.$.isActive': false, 'tenants.$.endDate': new Date() } }
    ),
  ]);

  return tenancy;
};

module.exports = { requestLink, respondLink, listTenancies, endTenancy };

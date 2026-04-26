const RentLog = require('../models/RentLog');
const Tenancy = require('../models/Tenancy');
const AppError = require('../utils/AppError');

const _assertAccess = async (tenancyId, userId, role) => {
  const filter = role === 'LANDLORD'
    ? { _id: tenancyId, landlordId: userId }
    : { _id: tenancyId, tenantId: userId };
  const tenancy = await Tenancy.findOne(filter);
  if (!tenancy) throw new AppError('Tenancy not found or access denied', 404);
  return tenancy;
};

const addRentLog = async (userId, { tenancyId, month, amount }) => {
  await _assertAccess(tenancyId, userId, 'LANDLORD');

  const existing = await RentLog.findOne({ tenancyId, month });
  if (existing) throw new AppError(`Rent log for ${month} already exists`, 409);

  return RentLog.create({ tenancyId, month, amount });
};

const listRentLogs = async (tenancyId, userId, role) => {
  await _assertAccess(tenancyId, userId, role);
  return RentLog.find({ tenancyId }).sort({ month: -1 }).lean();
};

const markPaid = async (userId, { rentLogId }) => {
  const rentLog = await RentLog.findById(rentLogId).populate('tenancyId');
  if (!rentLog) throw new AppError('Rent log not found', 404);

  if (rentLog.tenancyId.landlordId.toString() !== userId) {
    throw new AppError('Access denied', 403);
  }
  if (rentLog.status === 'paid') throw new AppError('Rent log already marked as paid', 400);

  rentLog.status = 'paid';
  rentLog.paidAt = new Date();
  await rentLog.save();
  return rentLog;
};

module.exports = { addRentLog, listRentLogs, markPaid };

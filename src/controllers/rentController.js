const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const rentService = require('../services/rentService');

const addRentLog = asyncHandler(async (req, res) => {
  const rentLog = await rentService.addRentLog(req.user.userId, req.body);
  success(res, rentLog, 'Rent log added', 201);
});

const listRentLogs = asyncHandler(async (req, res) => {
  const { tenancyId } = req.query;
  const { userId, role } = req.user;
  const logs = await rentService.listRentLogs(tenancyId, userId, role);
  success(res, logs);
});

const markPaid = asyncHandler(async (req, res) => {
  const rentLog = await rentService.markPaid(req.user.userId, req.body);
  success(res, rentLog, 'Rent marked as paid');
});

module.exports = { addRentLog, listRentLogs, markPaid };

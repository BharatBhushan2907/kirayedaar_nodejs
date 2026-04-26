const asyncHandler = require('../utils/asyncHandler');
const receiptService = require('../services/receiptService');

const generateReceipt = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const data = await receiptService.generateReceipt(userId, role, req.body);
  receiptService.streamReceiptPDF(res, data);
});

module.exports = { generateReceipt };

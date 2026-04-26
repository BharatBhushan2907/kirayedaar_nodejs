const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const waitlistService = require('../services/waitlistService');

const joinWaitlist = asyncHandler(async (req, res) => {
  const entry = await waitlistService.joinWaitlist(req.body);
  success(res, { id: entry._id }, "You're on the list! We'll reach out soon.", 201);
});

module.exports = { joinWaitlist };

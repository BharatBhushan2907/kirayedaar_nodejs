const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const contactService = require('../services/contactService');

const submitContact = asyncHandler(async (req, res) => {
  const entry = await contactService.submitContact(req.body);
  success(res, { id: entry._id }, 'Message received! We will get back to you within 24 hours.', 201);
});

module.exports = { submitContact };

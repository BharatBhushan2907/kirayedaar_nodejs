const Contact = require('../models/Contact');
const logger = require('../utils/logger');

const submitContact = async ({ name, email, subject, message }) => {
  const entry = await Contact.create({ name, email, subject, message });
  logger.info(`[Contact] New inquiry from ${email} — subject: ${subject}`);
  return entry;
};

module.exports = { submitContact };

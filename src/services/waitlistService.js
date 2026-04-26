const Waitlist = require('../models/Waitlist');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const joinWaitlist = async ({ name, phone, email, role, city }) => {
  const existing = await Waitlist.findOne({ phone });
  if (existing) throw new AppError('You are already on the waitlist', 409);

  const entry = await Waitlist.create({ name, phone, email, role, city });
  logger.info(`[Waitlist] New signup: ${phone} (${role}) — ${city || 'city not provided'}`);
  return entry;
};

module.exports = { joinWaitlist };

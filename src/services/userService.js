const Tenant = require('../models/Tenant');
const Landlord = require('../models/Landlord');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const _getModel = (role) => (role === 'LANDLORD' ? Landlord : Tenant);

const registerUser = async ({ phone, role, name, email, address }) => {
  const [existingTenant, existingLandlord] = await Promise.all([
    Tenant.findOne({ phone }),
    Landlord.findOne({ phone }),
  ]);

  if (existingTenant || existingLandlord) {
    throw new AppError('User already exists with this phone number', 409);
  }

  const Model = _getModel(role);
  const user = await Model.create({ phone, name, email, address });

  const token = signToken({
    userId: user._id.toString(),
    phone: user.phone,
    role: user.role,
  });

  return { user, token };
};

const getUserProfile = async (userId, role) => {
  const Model = _getModel(role);
  const user = await Model.findById(userId).lean();
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateUserProfile = async (userId, role, updates) => {
  const Model = _getModel(role);
  // Only allow safe fields
  const allowed = ['name', 'email', 'address'];
  const sanitized = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );

  const user = await Model.findByIdAndUpdate(userId, sanitized, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = { registerUser, getUserProfile, updateUserProfile };

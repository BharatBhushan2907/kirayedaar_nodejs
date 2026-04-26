const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const userService = require('../services/userService');

const addUserDetails = asyncHandler(async (req, res) => {
  const { phone, role, name, email, address } = req.body;
  const { user, token } = await userService.registerUser({ phone, role, name, email, address });
  success(res, { user, token }, 'Registration successful', 201);
});

const getProfile = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const user = await userService.getUserProfile(userId, role);
  success(res, user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const user = await userService.updateUserProfile(userId, role, req.body);
  success(res, user, 'Profile updated successfully');
});

module.exports = { addUserDetails, getProfile, updateProfile };

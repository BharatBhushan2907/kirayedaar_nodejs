const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protects routes — requires a valid Bearer JWT.
 * Attaches req.user = { userId, phone, role } on success.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authorization token is missing or invalid', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token); // throws if invalid/expired
  req.user = decoded;
  next();
});

/**
 * Restricts access to specific roles.
 * Usage: authorize('LANDLORD') or authorize('TENANT', 'LANDLORD')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};

module.exports = { authenticate, authorize };

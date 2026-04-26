const AppError = require('../utils/AppError');

/**
 * Validates req.body against a Joi schema.
 * Usage: router.post('/route', validate(schema), controller)
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return next(new AppError(message, 422));
  }
  next();
};

module.exports = validate;

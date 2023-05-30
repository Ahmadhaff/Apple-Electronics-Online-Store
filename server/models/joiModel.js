const Joi = require('joi');

const passwordComplexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().required().min(passwordComplexityOptions.min).max(passwordComplexityOptions.max)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,30}$/)
    .message(`Password must be between ${passwordComplexityOptions.min} and ${passwordComplexityOptions.max} characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character.`),
  role: Joi.string().valid('admin', 'user', 'customer_service').default('user'),
});

module.exports = userSchema;

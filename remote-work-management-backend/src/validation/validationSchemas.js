const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  secondName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm Password does not match Password'
  }),
  role: Joi.string().valid('JOB_SEEKER', 'EMPLOYER', 'ADMIN').required(),
  country: Joi.string().optional(),
  location: Joi.string().optional(),
  address: Joi.string().optional(),
  company: Joi.string().optional(),
  resume: Joi.any().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

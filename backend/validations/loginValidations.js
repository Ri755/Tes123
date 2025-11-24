const Joi = require("joi");

const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.empty': 'Harap Isi Username',
        'any.required': 'Username Dibutuhkan'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Harap Isi Password',
        'any.required': 'Password Dibutuhkan'
    })
});

module.exports = loginSchema;

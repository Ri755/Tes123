const Joi = require("joi");

const searchHistorySchema = Joi.object({
  pesanan_email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Email tidak valid",
      "any.required": "Email harus diisi",
    }),
});

const validateHistorySearch = (req, res, next) => {
  const { error, value } = searchHistorySchema.validate(req.query);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.query = value;
  next();
};

module.exports = {
  validateHistorySearch,
};

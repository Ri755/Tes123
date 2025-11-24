const Joi = require("joi");

const detailMenuValidation = {
  create: (req, res, next) => {
    const schema = Joi.object({
      detail_menu_nama_bahan: Joi.string().required().messages({
        "string.empty": "Nama bahan is required",
        "any.required": "Nama bahan is required",
      }),
      detail_menu_jumlah: Joi.number().positive().required().messages({
        "number.base": "Jumlah must be a number",
        "number.positive": "Jumlah must be positive",
        "any.required": "Jumlah is required",
      }),
      detail_menu_satuan: Joi.string().required().min(1).messages({
        "string.empty": "Satuan is required",
        "any.required": "Satuan is required",
      }),
      detail_menu_harga: Joi.number().integer().min(1).required().messages({
        "number.base": "Total harga must be a number",
        "number.integer": "Total harga must be an integer",
        "number.min": "Total harga cannot be negative",
        "any.required": "Total harga is required",
      }),
      menu_id: Joi.number().integer().positive().required().messages({
        "number.base": "Menu ID must be a number",
        "number.integer": "Menu ID must be an integer",
        "number.positive": "Menu ID must be positive",
        "any.required": "Menu ID is required",
      }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    next();
  },

  update: (req, res, next) => {
    const schema = Joi.object({
      detail_menu_nama_bahan: Joi.string().optional().messages({
        "string.empty": "Nama bahan cannot be empty",
      }),
      detail_menu_jumlah: Joi.number().positive().min(1).optional().messages({
        "number.base": "Jumlah must be a number",
        "number.positive": "Jumlah must be positive",
      }),
      detail_menu_satuan: Joi.string().optional().messages({
        "string.empty": "Satuan cannot be empty",
      }),
      detail_menu_harga: Joi.number().integer().min(1).optional().messages({
        "number.base": "Total harga must be a number",
        "number.integer": "Total harga must be an integer",
        "number.min": "Total harga cannot be negative",
      }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    next();
  },
};

module.exports = detailMenuValidation;

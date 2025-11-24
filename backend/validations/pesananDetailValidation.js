// validations/pesananDetailValidation.js
const Joi = require("joi");

const createPesananDetailSchema = Joi.object({
  menu_id: Joi.number().integer().required().messages({
    "number.base": "Menu ID harus berupa angka",
    "any.required": "Menu ID wajib diisi",
  }),
  pesanan_detail_jumlah: Joi.number().integer().min(1).required().messages({
    "number.base": "Jumlah harus berupa angka",
    "number.min": "Jumlah minimal 1",
    "any.required": "Jumlah wajib diisi",
  }),
  pesanan_id: Joi.number().integer().required().messages({
    "number.base": "Pesanan ID harus berupa angka",
    "any.required": "Pesanan ID wajib diisi",
  }),
});

const createPesananSchema = Joi.object({
  pesanan_nama: Joi.string().min(1).max(255).required().trim().messages({
    "string.empty": "Nama pesanan wajib diisi",
    "string.min": "Nama minimal 1 karakter",
    "any.required": "Nama pesanan wajib diisi",
  }),
  pesanan_lokasi: Joi.string().min(1).max(255).required().trim().messages({
    "string.empty": "Lokasi pesanan wajib diisi",
    "string.min": "Lokasi minimal 1 karakter",
    "any.required": "Lokasi pesanan wajib diisi",
  }),
  pesanan_email: Joi.string().email().required().trim().lowercase().messages({
    "string.email": "Email harus valid",
    "string.empty": "Email wajib diisi",
    "any.required": "Email wajib diisi",
  }),
  pesanan_tanggal: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "Tanggal harus berformat YYYY-MM-DD",
    }),
  pesanan_tanggal_pengiriman: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Tanggal pengiriman harus berformat YYYY-MM-DD",
      "any.required": "Tanggal pengiriman wajib diisi",
    }),
});

module.exports = {
  createPesananDetailSchema,
  createPesananSchema,
};

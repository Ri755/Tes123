const Joi = require("joi");

const addBahanBakuSchema = Joi.object({
  bahan_baku_nama: Joi.string().required().messages({
    "string.empty": "Nama bahan baku tidak boleh kosong!",
    "any.required": "Nama bahan baku harus diisi!",
  }),
  bahan_baku_jumlah: Joi.number().min(1).required().messages({
    "number.base": "Jumlah bahan baku harus berupa angka!",
    "number.min": "Jumlah bahan baku harus lebih dari 0!",
    "any.required": "Jumlah bahan baku harus diisi!",
  }),
  bahan_baku_harga: Joi.number().min(1).required().messages({
    "number.base": "Harga bahan baku harus berupa angka!",
    "number.min": "Harga bahan baku harus lebih dari 0!",
    "any.required": "Harga bahan baku harus diisi!",
  }),
  bahan_baku_satuan: Joi.string().required().messages({
    "string.empty": "Satuan bahan baku tidak boleh kosong!",
    "any.required": "Satuan bahan baku harus diisi!",
  }),
  bahan_baku_harga_satuan: Joi.number().min(1).required().messages({
    "number.base": "Harga satuan bahan baku harus berupa angka!",
    "number.min": "Harga satuan bahan baku harus lebih dari 0!",
    "any.required": "Harga satuan bahan baku harus diisi!",
  }),
});
const updateBahanBakuSchema = Joi.object({
  bahan_baku_nama: Joi.string().required().messages({
    "string.empty": "Nama bahan baku tidak boleh kosong!",
    "any.required": "Nama bahan baku harus diisi!",
  }),
  bahan_baku_jumlah: Joi.number().min(0).required().messages({
    "number.base": "Jumlah bahan baku harus berupa angka!",
    "number.min": "Jumlah bahan baku tidak boleh negatif!",
    "any.required": "Jumlah bahan baku harus diisi!",
  }),
  bahan_baku_harga: Joi.number().min(0).required().messages({
    "number.base": "Harga bahan baku harus berupa angka!",
    "number.min": "Harga bahan baku tidak boleh negatif!",
    "any.required": "Harga bahan baku harus diisi!",
  }),
  bahan_baku_satuan: Joi.string().required().messages({
    "string.empty": "Satuan bahan baku tidak boleh kosong!",
    "any.required": "Satuan bahan baku harus diisi!",
  }),
  bahan_baku_harga_satuan: Joi.number().min(0).required().messages({
    "number.base": "Harga satuan bahan baku harus berupa angka!",
    "number.min": "Harga satuan bahan baku tidak boleh negatif!",
    "any.required": "Harga satuan bahan baku harus diisi!",
  }),
});
const addPembelianSchema = Joi.object({
  bahan_baku_id: Joi.number().integer().positive().required(),
  pembelian_jumlah: Joi.number().positive().required(),
  pembelian_satuan: Joi.string().trim().min(1).required(),
  pembelian_harga_satuan: Joi.number().integer().min(0).required(),
});

module.exports = {
  addBahanBakuSchema,
  addPembelianSchema,
  updateBahanBakuSchema,
};

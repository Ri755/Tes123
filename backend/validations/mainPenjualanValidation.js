const Joi = require("joi");

const headerPenjualanSchema = Joi.object({
  header_penjualan_tanggal: Joi.date().required(),
  header_penjualan_jenis: Joi.string().valid("offline", "online").required(),
  header_penjualan_keterangan: Joi.string().required(),
  header_penjualan_biaya_tambahan: Joi.number().integer().min(0).default(0),
  header_penjualan_uang_muka: Joi.number().integer().min(0).default(0),
});

const detailPenjualanSchema = Joi.object({
  header_penjualan_id: Joi.number().integer().required(),
  menu_id: Joi.number().integer().required(),
  penjualan_jumlah: Joi.number().integer().min(1).required(),
});

module.exports = {
  headerPenjualanSchema,
  detailPenjualanSchema,
};

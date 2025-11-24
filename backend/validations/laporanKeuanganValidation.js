const Joi = require("joi");

const filterLaporanSchema = Joi.object({
  jenis_laporan: Joi.string()
    .valid("penjualan", "pembelian", "pesanan", "all")
    .required(),
  tanggal_awal: Joi.date().optional().allow(null, ""),
  tanggal_akhir: Joi.date().optional().allow(null, ""),
  menu_id: Joi.number().integer().optional().allow(null, ""),
  bahan_baku_id: Joi.number().integer().optional().allow(null, ""),
});

module.exports = {
  filterLaporanSchema,
};

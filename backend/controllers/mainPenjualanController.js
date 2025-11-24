const HeaderPenjualan = require("../models/headerPenjualanModel");
const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const {
  headerPenjualanSchema,
  detailPenjualanSchema,
} = require("../validations/mainPenjualanValidation");

// Response utility
const createResponse = (res, status, msg, payload = null) => {
  const result = { message: msg };
  if (payload !== null) result.data = payload;
  res.status(status).json(result);
};

// Error utility
const errorResponse = (res, error, msg) => {
  console.error(error);
  createResponse(res, 500, msg, { error: error.message });
};

// Include config untuk relasi
const penjualanInclude = {
  model: Penjualan,
  as: "penjualans",
  include: [{ model: Menu, as: "menu" }],
};

// Create Header Penjualan
exports.createHeaderPenjualan = async (req, res) => {
  const validation = headerPenjualanSchema.validate(req.body);

  if (validation.error) {
    return createResponse(res, 400, "Validation error", {
      details: validation.error.details[0].message,
    });
  }

  try {
    const newHeader = await HeaderPenjualan.create(validation.value);
    createResponse(res, 201, "Header penjualan berhasil dibuat", newHeader);
  } catch (err) {
    errorResponse(res, err, "Gagal membuat header penjualan");
  }
};

// Create Detail Penjualan
exports.createDetailPenjualan = async (req, res) => {
  const validation = detailPenjualanSchema.validate(req.body);

  if (validation.error) {
    return createResponse(res, 400, "Validation error", {
      details: validation.error.details[0].message,
    });
  }

  try {
    // Cek keberadaan header dan menu secara paralel
    const [header, menu] = await Promise.all([
      HeaderPenjualan.findByPk(validation.value.header_penjualan_id),
      Menu.findByPk(validation.value.menu_id),
    ]);

    if (!header) {
      return createResponse(res, 404, "Header penjualan tidak ditemukan");
    }
    if (!menu) {
      return createResponse(res, 404, "Menu tidak ditemukan");
    }

    const newDetail = await Penjualan.create(validation.value);
    createResponse(res, 201, "Detail penjualan berhasil dibuat", newDetail);
  } catch (err) {
    errorResponse(res, err, "Gagal membuat detail penjualan");
  }
};

// Get All Penjualan dengan Header
exports.getAllPenjualan = async (req, res) => {
  try {
    const dataPenjualan = await HeaderPenjualan.findAll({
      include: [penjualanInclude],
      order: [["createdAt", "DESC"]],
    });
    createResponse(
      res,
      200,
      "Berhasil mengambil data penjualan",
      dataPenjualan
    );
  } catch (err) {
    errorResponse(res, err, "Gagal mengambil data penjualan");
  }
};

// Get Penjualan by ID
exports.getPenjualanById = async (req, res) => {
  const { id } = req.params;

  try {
    const dataPenjualan = await HeaderPenjualan.findByPk(id, {
      include: [penjualanInclude],
    });

    if (!dataPenjualan) {
      return createResponse(res, 404, "Penjualan tidak ditemukan");
    }

    createResponse(
      res,
      200,
      "Berhasil mengambil data penjualan",
      dataPenjualan
    );
  } catch (err) {
    errorResponse(res, err, "Gagal mengambil data penjualan");
  }
};

// Update Header Penjualan
exports.updateHeaderPenjualan = async (req, res) => {
  const { id } = req.params;
  const validation = headerPenjualanSchema.validate(req.body);

  if (validation.error) {
    return createResponse(res, 400, "Validation error", {
      details: validation.error.details[0].message,
    });
  }

  try {
    const header = await HeaderPenjualan.findByPk(id);
    if (!header) {
      return createResponse(res, 404, "Header penjualan tidak ditemukan");
    }

    await header.update(validation.value);
    createResponse(res, 200, "Header penjualan berhasil diupdate", header);
  } catch (err) {
    errorResponse(res, err, "Gagal update header penjualan");
  }
};

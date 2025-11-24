const HeaderPenjualan = require("../models/headerPenjualanModel");
const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const {
  headerPenjualanSchema,
  updateHeaderPenjualanSchema,
  detailPenjualanSchema,
} = require("../validations/detailPenjualanValidation");

// Utility: Standard response handler
const sendResponse = (res, statusCode, message, data = null) => {
  const response = { message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

// Utility: Error handler
const handleError = (res, err, defaultMessage) => {
  console.error(err);
  return sendResponse(res, 500, defaultMessage, { error: err.message });
};

// Utility: Include configuration
const menuInclude = {
  model: Penjualan,
  as: "penjualans",
  include: [{ model: Menu, as: "menu" }],
};

// Create Header Penjualan
exports.createHeaderPenjualan = async (req, res) => {
  const { error, value } = headerPenjualanSchema.validate(req.body);
  if (error) {
    return sendResponse(res, 400, "Validation error", {
      details: error.details[0].message,
    });
  }

  try {
    const headerPenjualan = await HeaderPenjualan.create(value);
    return sendResponse(
      res,
      201,
      "Header penjualan berhasil dibuat",
      headerPenjualan
    );
  } catch (err) {
    return handleError(res, err, "Gagal membuat header penjualan");
  }
};

// Update Header Penjualan
exports.updateHeaderPenjualan = async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateHeaderPenjualanSchema.validate(req.body);

  if (error) {
    return sendResponse(res, 400, "Validation error", {
      details: error.details[0].message,
    });
  }

  try {
    const headerPenjualan = await HeaderPenjualan.findByPk(id);
    if (!headerPenjualan) {
      return sendResponse(res, 404, "Header penjualan tidak ditemukan");
    }

    await headerPenjualan.update(value);
    return sendResponse(
      res,
      200,
      "Header penjualan berhasil diupdate",
      headerPenjualan
    );
  } catch (err) {
    return handleError(res, err, "Gagal update header penjualan");
  }
};

// Create Detail Penjualan
exports.createDetailPenjualan = async (req, res) => {
  const { error, value } = detailPenjualanSchema.validate(req.body);
  if (error) {
    return sendResponse(res, 400, "Validation error", {
      details: error.details[0].message,
    });
  }

  try {
    const [headerExists, menuExists] = await Promise.all([
      HeaderPenjualan.findByPk(value.header_penjualan_id),
      Menu.findByPk(value.menu_id),
    ]);

    if (!headerExists) {
      return sendResponse(res, 404, "Header penjualan tidak ditemukan");
    }
    if (!menuExists) {
      return sendResponse(res, 404, "Menu tidak ditemukan");
    }

    const penjualan = await Penjualan.create(value);
    return sendResponse(
      res,
      201,
      "Detail penjualan berhasil dibuat",
      penjualan
    );
  } catch (err) {
    return handleError(res, err, "Gagal membuat detail penjualan");
  }
};

// Get All Penjualan dengan Header
exports.getAllPenjualan = async (req, res) => {
  try {
    const penjualan = await HeaderPenjualan.findAll({
      include: [menuInclude],
      order: [["createdAt", "DESC"]],
    });
    return sendResponse(
      res,
      200,
      "Berhasil mengambil data penjualan",
      penjualan
    );
  } catch (err) {
    return handleError(res, err, "Gagal mengambil data penjualan");
  }
};

// Get Penjualan by ID
exports.getPenjualanById = async (req, res) => {
  const { id } = req.params;

  try {
    const penjualan = await HeaderPenjualan.findByPk(id, {
      include: [menuInclude],
    });

    if (!penjualan) {
      return sendResponse(res, 404, "Penjualan tidak ditemukan");
    }

    return sendResponse(
      res,
      200,
      "Berhasil mengambil data penjualan",
      penjualan
    );
  } catch (err) {
    return handleError(res, err, "Gagal mengambil data penjualan");
  }
};

// Delete Detail Penjualan
exports.deleteDetailPenjualan = async (req, res) => {
  const { id } = req.params;

  try {
    const penjualan = await Penjualan.findByPk(id);
    if (!penjualan) {
      return sendResponse(res, 404, "Detail penjualan tidak ditemukan");
    }

    await penjualan.destroy();
    return sendResponse(res, 200, "Detail penjualan berhasil dihapus");
  } catch (err) {
    return handleError(res, err, "Gagal menghapus detail penjualan");
  }
};

// Get Detail Penjualan by Header ID
exports.getDetailByHeaderId = async (req, res) => {
  const { headerId } = req.params;

  try {
    const details = await Penjualan.findAll({
      where: { header_penjualan_id: headerId },
      include: [{ model: Menu, as: "menu" }],
    });
    return sendResponse(
      res,
      200,
      "Berhasil mengambil detail penjualan",
      details
    );
  } catch (err) {
    return handleError(res, err, "Gagal mengambil detail penjualan");
  }
};

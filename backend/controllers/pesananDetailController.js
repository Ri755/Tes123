// controllers/pesananDetailController.js
const PesananDetail = require("../models/PesananDetail");
const Pesanan = require("../models/Pesanan");

// Mengambil semua required modules dari versi HEAD (Versi Anda)
const Menu = require("../models/menuModels");
const Pegawai = require("../models/pegawai");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createPesananDetailSchema,
  createPesananSchema,
} = require("../validations/pesananDetailValidation");

// === CREATE PESANAN DETAIL ===
exports.createPesananDetail = async (req, res) => {
  try {
    const { error } = createPesananDetailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { menu_id, pesanan_detail_jumlah, pesanan_id } = req.body;

    const newPesananDetail = await PesananDetail.create({
      menu_id,
      pesanan_detail_jumlah,
      pesanan_id,
    });

    return res.status(201).json({
      success: true,
      message: "Pesanan detail created successfully",
      data: newPesananDetail,
    });
  } catch (error) {
    console.error("Error creating pesanan detail:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create pesanan detail",
      error: error.message,
    });
  }
};

// === CREATE PESANAN ===
exports.createPesanan = async (req, res) => {
  try {
    const { error } = createPesananSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      pesanan_nama,
      pesanan_lokasi,
      pesanan_email,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
    } = req.body;

    const newPesanan = await Pesanan.create({
      pesanan_nama,
      pesanan_lokasi,
      pesanan_email,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Pesanan created successfully",
      data: newPesanan,
    });
  } catch (error) {
    console.error("Error creating pesanan:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create pesanan",
      error: error.message,
    });
  }
};

// =================================== TAMBAHAN ==============================

// === SHOW PESANAN DETAIL GROUPED BY PESANAN ID === // wes isa
exports.showPesananDetailSpesifik = async (req, res) => {
  try {
    const details = await PesananDetail.findAll({
      include: [
        {
          model: require("../models/menuModels"), // Menu
          as: "menu",
          attributes: ["menu_id", "menu_nama", "menu_harga"],
        },
        {
          model: require("../models/Pesanan"), // Pesanan
          as: "pesanan",
          attributes: ["pesanan_id", "pesanan_nama", "pesanan_status"], // ambil pesanan_status
        },
      ],
      order: [["pesanan_id", "ASC"]],
    });

    // Kelompokkan hasil berdasarkan pesanan_id
    const grouped = details.reduce((acc, item) => {
      const pid = item.pesanan_id;
      const nama = item.pesanan?.pesanan_nama || "Tidak diketahui";
      const status = item.pesanan?.pesanan_status || "pending"; // ambil dari pesanan_status

      if (!acc[pid]) {
        acc[pid] = {
          pesanan_id: pid,
          pesanan_nama: nama,
          pesanan_status: status,
          data: [],
        };
      }

      acc[pid].data.push(item);
      return acc;
    }, {});

    return res.status(200).json(Object.values(grouped));
  } catch (error) {
    console.error("Error fetching pesanan detail:", error);
    return res.status(500).json({ error: error.message });
  }
};

// === UPDATE STATUS PESANAN DETAIL ===
exports.updateStatusPesanan = async (req, res) => {
  const { id } = req.params;
  try {
    // Cari pesanan berdasarkan primary key
    const findPesanan = await Pesanan.findByPk(id);
    if (!findPesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    // Update status sesuai logika baru
    // Model terbaru pakai `pesanan_status` (pending, diproses, terkirim)
    if (findPesanan.pesanan_status === "pending") {
      findPesanan.pesanan_status = "diproses";
    } else if (findPesanan.pesanan_status === "diproses") {
      findPesanan.pesanan_status = "terkirim";
    } else {
      findPesanan.pesanan_status = "pending"; // fallback / reset
    }

    // Simpan perubahan ke database
    await findPesanan.save();

    return res.status(200).json({
      success: true,
      message: "Status pesanan berhasil diperbarui",
      result: findPesanan,
    });
  } catch (error) {
    console.error("Error updating pesanan status:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui status pesanan",
      error: error.message,
    });
  }
};

// === Password vs Token // wes isa
exports.cekPasswordPemesanan = async (req, res) => {
  const { password, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pegawai_id = decoded.pegawai_id;

    const user = await Pegawai.findOne({ where: { pegawai_id } });
    if (!user) {
      return res.status(404).json({ message: "Pegawai tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.pegawai_password);
    if (!isMatch) {
      return res.status(200).json({
        message: "Password salah",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Password benar, akses diizinkan",
      data: {
        pegawai_id: user.pegawai_id,
        pegawai_nama: user.pegawai_nama,
      },
      status: true,
    });
  } catch (error) {
    console.error("Error verifying token/password:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memverifikasi password atau token tidak valid",
      error: error.message,
    });
  }
};

// =================================== TAMBAHAN (DARI VERSI LAMA) ==============================
// === GET PESANAN BY ID ===
exports.getPesananById = async (req, res) => {
  try {
    const { pesanan_id } = req.params;

    const pesanan = await Pesanan.findByPk(pesanan_id, {
      include: [
        {
          model: PesananDetail,
          as: "pesananDetails",
        },
      ],
    });

    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: pesanan,
    });
  } catch (error) {
    console.error("Error fetching pesanan:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pesanan",
      error: error.message,
    });
  }
};

// === UPDATE PESANAN STATUS ===
exports.updatePesananStatus = async (req, res) => {
  try {
    const { pesanan_id } = req.params;
    const { pesanan_status } = req.body;

    const validStatuses = ["pending", "diproses", "terkirim"];
    if (!validStatuses.includes(pesanan_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: pending, diproses, or terkirim",
      });
    }

    const pesanan = await Pesanan.findByPk(pesanan_id);

    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan not found",
      });
    }

    await pesanan.update({ pesanan_status });

    return res.status(200).json({
      success: true,
      message: "Pesanan status updated successfully",
      data: pesanan,
    });
  } catch (error) {
    console.error("Error updating pesanan status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update pesanan status",
      error: error.message,
    });
  }
};

// === DAPATKAN MENU YANG ADA DI DETAIL MENU BERDASARKAN ID ===
exports.getPesananDetailById = async (req, res) => {
  let { id } = req.params; // id dari pesanan id !!!
  try {
    // ambil semnua pesanan id = ... gtampilkan hanya menu yang dipesan (pakai relasi)
    let getMenuById = await PesananDetail.findAll({
      where: {
        pesanan_id: id,
      },
      include: [
        {
          model: Menu,
          as: "menu",
        },
      ],
    });

    return res.status(200).json(getMenuById);
  } catch (error) {
    console.error("Error fetching pesanan:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pesanan",
      error: error.message,
    });
  }
};

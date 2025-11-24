const { Op } = require("sequelize");
const HeaderPenjualan = require("../models/headerPenjualanModel");
const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const BahanBaku = require("../models/bahanBakuModel");
const Pembelian = require("../models/pembelianModel");
const Pesanan = require("../models/Pesanan");
const PesananDetail = require("../models/PesananDetail");
const {
  filterLaporanSchema,
} = require("../validations/laporanKeuanganValidation");

// Get Laporan Penjualan
const getLaporanPenjualan = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, menu_id } = req.query;

    // Validate input
    const { error } = filterLaporanSchema.validate({
      jenis_laporan: "penjualan",
      tanggal_awal: tanggal_awal || null,
      tanggal_akhir: tanggal_akhir || null,
      menu_id: menu_id ? parseInt(menu_id) : null,
    });

    if (error) {
      return res.status(400).json({
        message: "Validasi gagal",
        error: error.details[0].message,
      });
    }

    let whereClause = {};
    let whereHeader = {};

    // Filter by date range
    if (tanggal_awal || tanggal_akhir) {
      whereHeader.header_penjualan_tanggal = {};
      if (tanggal_awal) {
        whereHeader.header_penjualan_tanggal[Op.gte] = new Date(tanggal_awal);
      }
      if (tanggal_akhir) {
        const endDate = new Date(tanggal_akhir);
        endDate.setHours(23, 59, 59, 999);
        whereHeader.header_penjualan_tanggal[Op.lte] = endDate;
      }
    }

    // Filter by menu_id
    if (menu_id) {
      whereClause.menu_id = parseInt(menu_id);
    }

    const penjualan = await Penjualan.findAll({
      where: whereClause,
      include: [
        {
          model: HeaderPenjualan,
          as: "header",
          where: Object.keys(whereHeader).length > 0 ? whereHeader : undefined,
          required: true,
        },
        {
          model: Menu,
          as: "menu",
          required: true,
        },
      ],
      order: [
        [
          { model: HeaderPenjualan, as: "header" },
          "header_penjualan_tanggal",
          "ASC",
        ],
      ],
    });

    // Transform data for frontend
    const transformedData = penjualan.map((item) => {
      const subtotal = (item.menu?.menu_harga || 0) * item.penjualan_jumlah;
      const biayaTambahan = item.header?.header_penjualan_biaya_tambahan || 0;
      const persentaseUangMuka = item.header?.header_penjualan_uang_muka || 0;

      return {
        penjualan_id: item.penjualan_id,
        header_penjualan_id: item.header_penjualan_id,
        tanggal: item.header?.header_penjualan_tanggal,
        jenis: item.header?.header_penjualan_jenis,
        menu_id: item.menu_id,
        menu_nama: item.menu?.menu_nama,
        menu_harga: item.menu?.menu_harga,
        penjualan_jumlah: item.penjualan_jumlah,
        subtotal: subtotal,
        biaya_tambahan: biayaTambahan,
        persentase_uang_muka: persentaseUangMuka,
      };
    });

    return res.status(200).json({
      message: "Berhasil mengambil laporan penjualan",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil laporan penjualan",
      error: err.message,
    });
  }
};

// Get Laporan Pembelian
const getLaporanPembelian = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, bahan_baku_id } = req.query;

    // Validate input
    const { error } = filterLaporanSchema.validate({
      jenis_laporan: "pembelian",
      tanggal_awal: tanggal_awal || null,
      tanggal_akhir: tanggal_akhir || null,
      bahan_baku_id: bahan_baku_id ? parseInt(bahan_baku_id) : null,
    });

    if (error) {
      return res.status(400).json({
        message: "Validasi gagal",
        error: error.details[0].message,
      });
    }

    let whereClause = {};

    // Filter by date range
    if (tanggal_awal || tanggal_akhir) {
      whereClause.createdAt = {};
      if (tanggal_awal) {
        whereClause.createdAt[Op.gte] = new Date(tanggal_awal);
      }
      if (tanggal_akhir) {
        const endDate = new Date(tanggal_akhir);
        endDate.setHours(23, 59, 59, 999);
        whereClause.createdAt[Op.lte] = endDate;
      }
    }

    // Filter by bahan_baku_id
    if (bahan_baku_id) {
      whereClause.bahan_baku_id = parseInt(bahan_baku_id);
    }

    const pembelian = await Pembelian.findAll({
      where: whereClause,
      include: [
        {
          model: BahanBaku,
          as: "bahan_baku",
          required: true,
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Transform data for frontend
    const transformedData = pembelian.map((item) => ({
      pembelian_id: item.pembelian_id,
      tanggal: item.createdAt,
      bahan_baku_id: item.bahan_baku_id,
      bahan_baku_nama: item.bahan_baku?.bahan_baku_nama,
      pembelian_jumlah: item.pembelian_jumlah,
      pembelian_satuan: item.pembelian_satuan,
      pembelian_harga_satuan: item.pembelian_harga_satuan,
      subtotal: item.pembelian_jumlah * item.pembelian_harga_satuan,
    }));

    return res.status(200).json({
      message: "Berhasil mengambil laporan pembelian",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil laporan pembelian",
      error: err.message,
    });
  }
};

// Get Laporan Pesanan
const getLaporanPesanan = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, menu_id } = req.query;

    // Validate input
    const { error } = filterLaporanSchema.validate({
      jenis_laporan: "pesanan",
      tanggal_awal: tanggal_awal || null,
      tanggal_akhir: tanggal_akhir || null,
      menu_id: menu_id ? parseInt(menu_id) : null,
    });

    if (error) {
      return res.status(400).json({
        message: "Validasi gagal",
        error: error.details[0].message,
      });
    }

    let wherePesanan = {};
    let whereDetail = {};

    // Filter by date range
    if (tanggal_awal || tanggal_akhir) {
      wherePesanan.pesanan_tanggal = {};
      if (tanggal_awal) {
        wherePesanan.pesanan_tanggal[Op.gte] = new Date(tanggal_awal);
      }
      if (tanggal_akhir) {
        const endDate = new Date(tanggal_akhir);
        endDate.setHours(23, 59, 59, 999);
        wherePesanan.pesanan_tanggal[Op.lte] = endDate;
      }
    }

    // Filter by menu_id
    if (menu_id) {
      whereDetail.menu_id = parseInt(menu_id);
    }

    const pesanan = await Pesanan.findAll({
      where: Object.keys(wherePesanan).length > 0 ? wherePesanan : undefined,
      include: [
        {
          model: PesananDetail,
          as: "details",
          where: Object.keys(whereDetail).length > 0 ? whereDetail : undefined,
          required: true,
          include: [
            {
              model: Menu,
              as: "menu",
              required: true,
            },
          ],
        },
      ],
      order: [["pesanan_tanggal", "ASC"]],
    });

    // Transform data for frontend
    const transformedData = [];
    pesanan.forEach((pes) => {
      pes.details.forEach((detail) => {
        transformedData.push({
          pesanan_id: pes.pesanan_id,
          pesanan_nama: pes.pesanan_nama,
          pesanan_email: pes.pesanan_email,
          pesanan_lokasi: pes.pesanan_lokasi,
          pesanan_status: pes.pesanan_status,
          tanggal: pes.pesanan_tanggal,
          tanggal_pengiriman: pes.pesanan_tanggal_pengiriman,
          menu_id: detail.menu_id,
          menu_nama: detail.menu?.menu_nama,
          menu_harga: detail.menu?.menu_harga,
          pesanan_detail_jumlah: detail.pesanan_detail_jumlah,
          subtotal:
            (detail.menu?.menu_harga || 0) * detail.pesanan_detail_jumlah,
        });
      });
    });

    return res.status(200).json({
      message: "Berhasil mengambil laporan pesanan",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil laporan pesanan",
      error: err.message,
    });
  }
};

// Get All Laporan
const getAllLaporan = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, menu_id, bahan_baku_id } = req.query;

    // Validate input
    const { error } = filterLaporanSchema.validate({
      jenis_laporan: "all",
      tanggal_awal: tanggal_awal || null,
      tanggal_akhir: tanggal_akhir || null,
      menu_id: menu_id ? parseInt(menu_id) : null,
      bahan_baku_id: bahan_baku_id ? parseInt(bahan_baku_id) : null,
    });

    if (error) {
      return res.status(400).json({
        message: "Validasi gagal",
        error: error.details[0].message,
      });
    }

    // Get all three reports
    const [penjualanRes, pembelianRes, pesananRes] = await Promise.all([
      getLaporanPenjualanData(tanggal_awal, tanggal_akhir, menu_id),
      getLaporanPembelianData(tanggal_awal, tanggal_akhir, bahan_baku_id),
      getLaporanPesananData(tanggal_awal, tanggal_akhir, menu_id),
    ]);

    return res.status(200).json({
      message: "Berhasil mengambil semua laporan",
      data: {
        penjualan: penjualanRes,
        pembelian: pembelianRes,
        pesanan: pesananRes,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil laporan",
      error: err.message,
    });
  }
};

// Helper functions
const getLaporanPenjualanData = async (
  tanggal_awal,
  tanggal_akhir,
  menu_id
) => {
  let whereClause = {};
  let whereHeader = {};

  if (tanggal_awal || tanggal_akhir) {
    whereHeader.header_penjualan_tanggal = {};
    if (tanggal_awal) {
      whereHeader.header_penjualan_tanggal[Op.gte] = new Date(tanggal_awal);
    }
    if (tanggal_akhir) {
      const endDate = new Date(tanggal_akhir);
      endDate.setHours(23, 59, 59, 999);
      whereHeader.header_penjualan_tanggal[Op.lte] = endDate;
    }
  }

  if (menu_id) {
    whereClause.menu_id = parseInt(menu_id);
  }

  const penjualan = await Penjualan.findAll({
    where: whereClause,
    include: [
      {
        model: HeaderPenjualan,
        as: "header",
        where: Object.keys(whereHeader).length > 0 ? whereHeader : undefined,
        required: true,
      },
      {
        model: Menu,
        as: "menu",
        required: true,
      },
    ],
    order: [
      [
        { model: HeaderPenjualan, as: "header" },
        "header_penjualan_tanggal",
        "ASC",
      ],
    ],
  });

  return penjualan.map((item) => {
    const subtotal = (item.menu?.menu_harga || 0) * item.penjualan_jumlah;
    const biayaTambahan = item.header?.header_penjualan_biaya_tambahan || 0;
    const persentaseUangMuka = item.header?.header_penjualan_uang_muka || 0;

    return {
      penjualan_id: item.penjualan_id,
      header_penjualan_id: item.header_penjualan_id,
      tanggal: item.header?.header_penjualan_tanggal,
      jenis: item.header?.header_penjualan_jenis,
      menu_id: item.menu_id,
      menu_nama: item.menu?.menu_nama,
      menu_harga: item.menu?.menu_harga,
      penjualan_jumlah: item.penjualan_jumlah,
      subtotal: subtotal,
      biaya_tambahan: biayaTambahan,
      persentase_uang_muka: persentaseUangMuka,
    };
  });
};

const getLaporanPembelianData = async (
  tanggal_awal,
  tanggal_akhir,
  bahan_baku_id
) => {
  let whereClause = {};

  if (tanggal_awal || tanggal_akhir) {
    whereClause.createdAt = {};
    if (tanggal_awal) {
      whereClause.createdAt[Op.gte] = new Date(tanggal_awal);
    }
    if (tanggal_akhir) {
      const endDate = new Date(tanggal_akhir);
      endDate.setHours(23, 59, 59, 999);
      whereClause.createdAt[Op.lte] = endDate;
    }
  }

  if (bahan_baku_id) {
    whereClause.bahan_baku_id = parseInt(bahan_baku_id);
  }

  const pembelian = await Pembelian.findAll({
    where: whereClause,
    include: [
      {
        model: BahanBaku,
        as: "bahan_baku",
        required: true,
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return pembelian.map((item) => ({
    pembelian_id: item.pembelian_id,
    tanggal: item.createdAt,
    bahan_baku_id: item.bahan_baku_id,
    bahan_baku_nama: item.bahan_baku?.bahan_baku_nama,
    pembelian_jumlah: item.pembelian_jumlah,
    pembelian_satuan: item.pembelian_satuan,
    pembelian_harga_satuan: item.pembelian_harga_satuan,
    subtotal: item.pembelian_jumlah * item.pembelian_harga_satuan,
  }));
};

const getLaporanPesananData = async (tanggal_awal, tanggal_akhir, menu_id) => {
  let wherePesanan = {};
  let whereDetail = {};

  if (tanggal_awal || tanggal_akhir) {
    wherePesanan.pesanan_tanggal = {};
    if (tanggal_awal) {
      wherePesanan.pesanan_tanggal[Op.gte] = new Date(tanggal_awal);
    }
    if (tanggal_akhir) {
      const endDate = new Date(tanggal_akhir);
      endDate.setHours(23, 59, 59, 999);
      wherePesanan.pesanan_tanggal[Op.lte] = endDate;
    }
  }

  if (menu_id) {
    whereDetail.menu_id = parseInt(menu_id);
  }

  const pesanan = await Pesanan.findAll({
    where: Object.keys(wherePesanan).length > 0 ? wherePesanan : undefined,
    include: [
      {
        model: PesananDetail,
        as: "details",
        where: Object.keys(whereDetail).length > 0 ? whereDetail : undefined,
        required: true,
        include: [
          {
            model: Menu,
            as: "menu",
            required: true,
          },
        ],
      },
    ],
    order: [["pesanan_tanggal", "ASC"]],
  });

  const transformedData = [];
  pesanan.forEach((pes) => {
    pes.details.forEach((detail) => {
      transformedData.push({
        pesanan_id: pes.pesanan_id,
        pesanan_nama: pes.pesanan_nama,
        pesanan_status: pes.pesanan_status,
        tanggal: pes.pesanan_tanggal,
        menu_id: detail.menu_id,
        menu_nama: detail.menu?.menu_nama,
        menu_harga: detail.menu?.menu_harga,
        pesanan_detail_jumlah: detail.pesanan_detail_jumlah,
        subtotal: (detail.menu?.menu_harga || 0) * detail.pesanan_detail_jumlah,
      });
    });
  });

  return transformedData;
};

module.exports = {
  getLaporanPenjualan,
  getLaporanPembelian,
  getLaporanPesanan,
  getAllLaporan,
};

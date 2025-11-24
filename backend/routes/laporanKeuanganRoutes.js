const express = require("express");
const router = express.Router();
const laporanKeuanganController = require("../controllers/laporanKeuanganController");
const { isAuthenticate } = require("../middleware/middleware");

// Get Laporan Penjualan
router.get(
  "/penjualan",
  isAuthenticate,
  laporanKeuanganController.getLaporanPenjualan
);

// Get Laporan Pembelian
router.get(
  "/pembelian",
  isAuthenticate,
  laporanKeuanganController.getLaporanPembelian
);

// Get Laporan Pesanan
router.get(
  "/pesanan",
  isAuthenticate,
  laporanKeuanganController.getLaporanPesanan
);

// Get All Laporan
router.get("/all", isAuthenticate, laporanKeuanganController.getAllLaporan);

module.exports = router;

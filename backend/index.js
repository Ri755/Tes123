const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/sequelize");
const bahanBakuRoutes = require("./routes/bahanBakuRoutes");
const login = require("./routes/loginRoutes");
const menuManagement = require("./routes/menuManagement");
const detailMenuRoutes = require("./routes/detailMenuRoutes");
const pesananDetailRoutes = require("./routes/pesananDetailRoutes");
const detailPenjualanRoutes = require("./routes/detailPenjualanRoutes");
const mainPenjualanRoutes = require("./routes/mainPenjualanRoutes");
const laporanKeuanganRoutes = require("./routes/laporanKeuanganRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // ini biar bisa terima body !!!

// ===================================================================

// login
app.use("/api/login", login);

// menu management
app.use("/api/menu_management", menuManagement);

// menu detail
app.use("/api/menu_management/detail", detailMenuRoutes);

// bahan baku
app.use("/api/bahan_Baku", bahanBakuRoutes);

// pesanan detail
app.use("/api/pesanan_detail/detail", pesananDetailRoutes);

// detail penjualan
app.use("/api/detail_penjualan", detailPenjualanRoutes);

//history
app.use("/api/history/", historyRoutes);
// ====================================================================

// main penjualan
app.use("/api/main_penjualan", mainPenjualanRoutes);

// laporan keuangan
app.use("/api/laporan_keuangan", laporanKeuanganRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Server is running on port ${PORT}`);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

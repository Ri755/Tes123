// routes/pesananDetailRoutes.js
const express = require("express");
const router = express.Router();
const pesananDetailController = require("../controllers/pesananDetailController");

router.post("/detail", pesananDetailController.createPesananDetail);
router.post("/header", pesananDetailController.createPesanan);

router.get("/showspesifik", pesananDetailController.showPesananDetailSpesifik); // udh bisa
router.post("/update/:id", pesananDetailController.updateStatusPesanan); // udh bisa
router.post("/passcek", pesananDetailController.cekPasswordPemesanan); // udh bisa

// TAMBAHAN
router.get("/showdetail/:id", pesananDetailController.getPesananDetailById); // udh bisa

module.exports = router;

const express = require("express");
const router = express.Router();
const { getHistoryByEmail } = require("../controllers/historyController");
const { validateHistorySearch } = require("../validations/historyValidation");

router.get("/search", validateHistorySearch, getHistoryByEmail);

module.exports = router;

const Pegawai = require("../models/pegawai");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// === POST login ===
exports.doLogin = async (req, res) => {
  try {
    // Ambil input dari body
    const { pegawai_id, password } = req.body;
    console.log("Mulai pengecekan pegawai_id:", pegawai_id);

    // Cek apakah pegawai dengan ID tsb ada di database
    const isUserAda = await Pegawai.findOne({
      where: { pegawai_id },
    });

    // Jika user tidak ditemukan
    if (!isUserAda) {
      return res.status(404).send({
        message: "Pegawai tidak ditemukan",
      });
    }

    // Cek password
    const valid = await bcrypt.compare(password, isUserAda.pegawai_password);

    // Jika password tidak cocok
    if (!valid) {
      return res.status(401).send({
        message: "Password salah",
      });
    }

    // === Jika ID dan password cocok ===
    const payload = {
      pegawai_id: isUserAda.pegawai_id,
      pegawai_nama: isUserAda.pegawai_nama,
    };

    const jwtPass = process.env.JWT_SECRET;
    const jwtExp = process.env.JWT_EXPIRES;

    // Buat token JWT
    const token = jwt.sign(payload, jwtPass, { expiresIn: jwtExp });

    // Kirim respon sukses beserta token
    return res.status(200).send({
      message: "Berhasil Login",
      token,
    });
  } catch (error) {
    console.error("Error login:", error);
    return res.status(500).json({ error: error.message });
  }
};

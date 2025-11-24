const Pegawai = require('../models/pegawai');
const jwt = require('jsonwebtoken');
require('dotenv').config();


let templateMiddleware = async(req,res,next) =>{ // template
  try{
    next();
  }
  catch(err){
    return res.status(500).send({
      error: err.message
    });
  }
}

// === UNTUK CEK TOKEN LOGIN ===
let isAuthenticate = async (req, res, next) => {
  try {
    const token = req.headers['x-auth-token'];
    if (!token) {
      return res.status(400).send({ message: 'Authentication Required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.hasil = decoded; 
    const findPegawai = await Pegawai.findOne({
      where: { pegawai_id: decoded.pegawai_id },
    });
    if (!findPegawai) {
      return res.status(404).send({
        message: 'Pegawai tidak ditemukan atau sudah dihapus.',
      });
    }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'Token sudah kadaluarsa' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'Token tidak valid' });
    }
    return res.status(500).send({ error: err.message });
  }
};

module.exports = { isAuthenticate };

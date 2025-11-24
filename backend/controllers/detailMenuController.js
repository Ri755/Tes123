const DetailMenu = require("../models/detailMenu");

exports.createDetailMenu = async (req, res) => {
  try {
    const {
      detail_menu_nama_bahan,
      detail_menu_jumlah,
      detail_menu_satuan,
      detail_menu_harga,
      menu_id,
    } = req.body;

    const detailMenu = await DetailMenu.create({
      detail_menu_nama_bahan,
      detail_menu_jumlah,
      detail_menu_satuan,
      detail_menu_harga,
      menu_id,
    });

    return res.status(201).json({
      message: "Detail menu berhasil ditambahkan.",
      data: detailMenu,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllDetailMenu = async (req, res) => {
  try {
    const detailMenus = await DetailMenu.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Detail menu berhasil diambil.",
      data: detailMenus,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDetailMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    const detailMenus = await DetailMenu.findAll({
      where: { menu_id: id },
    });

    if (!detailMenus.length) {
      return res.status(404).json({ message: "Detail pada menu ini kosong" });
    }

    return res.status(200).json({
      message: "Detail menu berhasil diambil.",
      data: detailMenus,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateDetailMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      detail_menu_nama_bahan,
      detail_menu_jumlah,
      detail_menu_satuan,
      detail_menu_harga,
    } = req.body;

    const detailMenu = await DetailMenu.findByPk(id);

    if (!detailMenu) {
      return res.status(404).json({ message: "Detail menu tidak ditemukan!" });
    }

    await detailMenu.update({
      detail_menu_nama_bahan,
      detail_menu_jumlah,
      detail_menu_satuan,
      detail_menu_harga,
    });

    return res.status(200).json({
      message: "Detail menu berhasil diperbarui.",
      data: detailMenu,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDetailMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDetailMenu = await DetailMenu.destroy({
      where: { detail_menu_id: id },
    });

    if (deletedDetailMenu === 0) {
      return res.status(404).json({ message: "Detail menu tidak ditemukan!" });
    }

    return res.status(200).json({ message: "Detail menu berhasil dihapus." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

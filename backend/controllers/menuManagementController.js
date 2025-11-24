const MenuManagement = require("../models/menuModels");
const {
  addBahanBakuSchema,
  updateBahanBakuSchema,
  message,
} = require("../validations/menuManagementValidation");

// === UNTUK PEGAWAI (PAKAI TOKEN) ===
exports.addMenu = async(req,res) => {
    try {
        // Ambil Semua Data Body
        let {menu_nama,menu_harga,menu_gambar} = req.body;
        if(!menu_nama || !menu_harga || !menu_gambar){
            return res.status(200).send({
                messages: 'Salah Satu Data Kosong !!!'
            });
        }
        // Lakukan Insert
        let insertMakanan = await MenuManagement.create({
            menu_nama,menu_harga,menu_gambar
        })

        // Return
        return res.status(200).send({
            messages: 'Berhasil Menambahkan Menu',
        });
    } catch (error) {
        return res.status(500).send({
            messages: 'Internal Server Error',
            error: error.messages
        });
    }
}
exports.getMenu = async (req,res) => {
    try {
        
        let getAllMenu = await MenuManagement.findAll();
        return res.status(200).json(getAllMenu);

    } catch (error) {
        return res.status(500).send({
            messages: 'Internal Server Error',
            error: error.messages
        });
    }
}
exports.ubahStatus = async (req,res) => {
    let { id } = req.params;
    try {
        let findMenu = await MenuManagement.findByPk(id);
        if(findMenu.menu_status_aktif == 1){
            findMenu.menu_status_aktif = 0
        }
        else{
            findMenu.menu_status_aktif = 1
        }
        await findMenu.save();
        return res.status(201).send({
            message: 'Berhasil Mengupdate',
            hasil: findMenu
        })
    } catch (error) {
        return res.status(500).send({
            messages: 'Internal Server Error',
            error: error.message
        });
    }
}

// === TEMPLATE ===
exports.template = async (req,res) => {
    try {
        let getAllMenu = await MenuManagement.findAll();
        return res.status(200).json(getAllMenu);

    } catch (error) {
        return res.status(500).send({
            messages: 'Internal Server Error',
            error: error.message
        });
    }
}
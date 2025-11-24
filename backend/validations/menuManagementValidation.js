const Joi = require("joi");
const menuSchema = Joi.object({
    menu_nama: Joi.string().required().messages({
        'string.empty': 'Harap Isi Nama Menu',
        'any.required': 'Nama Menu Dibutuhkan'
    }),
    menu_harga: Joi.number().required().min(1).messages({
        'any.required': 'Password Dibutuhkan',
        'number.min': 'Harga Tidak Boleh 0'
    }),
    menu_gambar: Joi.string().required().messages({
        'string.empty': 'Harap Isi Gambar Menu',
        'any.required': 'Gambar Menu Dibutuhkan'
    }),
});
module.exports = menuSchema;

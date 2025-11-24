// models/DetailMenu.js
const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const DetailMenu = sequelize.define(
  "detail_menu",
  {
    detail_menu_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    detail_menu_nama_bahan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail_menu_jumlah: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    detail_menu_satuan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail_menu_harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "menu",
        key: "menu_id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "detail_menu",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = DetailMenu;

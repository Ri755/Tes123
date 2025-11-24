const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Menu = sequelize.define(
  "menu",
  {
    menu_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    menu_nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    menu_harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    menu_gambar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    menu_status_aktif: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
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
    tableName: "menu",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Menu;

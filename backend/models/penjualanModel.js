const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize");
const Menu = require("./menuModels");
const HeaderPenjualan = require("./headerPenjualanModel");

const Penjualan = sequelize.define(
  "penjualan",
  {
    penjualan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    header_penjualan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "header_penjualan",
        key: "header_penjualan_id",
      },
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "menu",
        key: "menu_id",
      },
    },
    penjualan_jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      defaultValue: null,
    },
  },
  {
    tableName: "penjualan",
    timestamps: true,
    paranoid: true,
  }
);

HeaderPenjualan.hasMany(Penjualan, {
  foreignKey: "header_penjualan_id",
  as: "penjualans",
});

Penjualan.belongsTo(HeaderPenjualan, {
  foreignKey: "header_penjualan_id",
  as: "header",
});

Menu.hasMany(Penjualan, {
  foreignKey: "menu_id",
  as: "penjualans",
});

Penjualan.belongsTo(Menu, {
  foreignKey: "menu_id",
  as: "menu",
});

module.exports = Penjualan;

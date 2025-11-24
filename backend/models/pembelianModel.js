const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const BahanBaku = require("./bahanBakuModel");

const Pembelian = sequelize.define(
  "pembelian",
  {
    pembelian_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bahan_baku_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bahan_baku",
        key: "bahan_baku_id",
      },
    },
    pembelian_jumlah: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pembelian_satuan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pembelian_harga_satuan: {
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
      allowNull: true,
    },
  },
  {
    tableName: "pembelian",
    timestamps: true,
    paranoid: true,
  }
);

BahanBaku.hasMany(Pembelian, {
  foreignKey: "bahan_baku_id",
  as: "pembelians",
});

Pembelian.belongsTo(BahanBaku, {
  foreignKey: "bahan_baku_id",
  as: "bahan_baku",
});

module.exports = Pembelian;

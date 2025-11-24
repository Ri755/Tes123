const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

async function testDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.error("Connection error:", error);
  }
}

testDB();

module.exports = { sequelize };

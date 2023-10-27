const Sequelize = require("sequelize");
const dotenv = require('dotenv');
path = require('path');

dotenv.config({ path: path.join(__dirname, '../../config.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql"
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./userModel.js')(sequelize, Sequelize);
db.userData = require('./contactModel.js')(sequelize, Sequelize);

module.exports = db;
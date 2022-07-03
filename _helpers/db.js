const config = require('config.json');
const mysql = require('mysql');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.doctor = require('../doctors/doctor.model')(sequelize);
    db.patient = require('../patients/patient.model')(sequelize);
    db.admin = require('../admin/admin.model')(sequelize);
    // db.products = require('../models/productModel')(sequelize)
    // db.reviews = require('../models/reviewModel')(sequelize)
    // sync all models with database
    await sequelize.sync();
}
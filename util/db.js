const Sequelize = require('sequelize');

const sequelize = new Sequelize('sequelized', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


module.exports = sequelize;
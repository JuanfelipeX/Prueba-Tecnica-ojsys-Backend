const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('prueba_jsys', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
});

const Fruta = sequelize.define('Fruta', {
    tipo: {
        type: DataTypes.STRING,
    },
    cantidad: {
        type: DataTypes.INTEGER,
    },
    precio: {
        type: DataTypes.DOUBLE,
    },
});

Fruta.sync()
    .then(() => {
        console.log('Modelo de Fruta sincronizado correctamente');
    })
    .catch((error) => {
        console.error('Error al sincronizar el modelo de Fruta:', error);
    });

module.exports = Fruta;

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('prueba_jsys', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
});

const Pedido = sequelize.define('Pedido', {
    lista_frutas: {
        type: DataTypes.STRING,
    },
    valor_total: {
        type: DataTypes.INTEGER,
    },
});

Pedido.sync()
    .then(() => {
        console.log('Modelo de Pedido sincronizado correctamente');
    })
    .catch((error) => {
        console.error('Error al sincronizar el modelo de Pedido:', error);
    });

module.exports = Pedido;

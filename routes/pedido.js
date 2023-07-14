const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Pedido = require('../models/pedido.js');
const { generateToken, verifyToken, comparePassword } = require('../routes/auth.js');


// Obtener la lista completa de pedido
router.get('/', (req, res) => {
    Pedido.findAll()
    .then((pedido) => {
      res.json(pedido);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de pedido' });
    });
});

// Crear un nuevo pedido
router.post('/', (req, res) => {
  const { lista_frutas, valor_total } = req.body;

  Pedido.create({ lista_frutas, valor_total })
    .then((pedido) => {
      res.json(pedido);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al crear un nuevo pedido' });
    });
});


// Obtener los detalles de una pedio específico
router.get('/:id', (req, res) => {
  const pedidoId = req.params.id;

  Pedido.findByPk(pedidoId)
    .then((pedido) => {
      if (pedido) {
        res.json(pedido);
      } else {
        res.status(404).json({ error: 'Pedido no encontrado' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los detalles de pedido' });
    });
});

// Actualizar los detalles de un pedio específico
router.put('/:id', (req, res) => {
  const pedidoId = req.params.id;
  const { lista_frutas, valor_total } = req.body;

  Pedido.findByPk(pedidoId)
    .then((pedido) => {
      if (pedido) {
        pedido.lista_frutas = lista_frutas;
        pedido.valor_total = valor_total;
        return pedido.save();
      } else {
        res.status(404).json({ error: 'Pedido no encontrada' });
      }
    })
    .then((updatedFruta) => {
      res.json(updatedFruta);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar los detalles de la pedio' });
    });
});

// Eliminar un pedio específico
router.delete('/:id', (req, res) => {
  const pedidoId = req.params.id;

  Pedido.findByPk(pedidoId)
    .then((pedido) => {
      if (pedido) {
        return pedido.destroy();
      } else {
        res.status(404).json({ error: 'Pedido no encontrado' });
      }
    })
    .then(() => {
      res.json({ message: 'Pedido eliminada correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar el pedido' });
    });
});

// Resto de los endpoints y lógica de la API

module.exports = router;

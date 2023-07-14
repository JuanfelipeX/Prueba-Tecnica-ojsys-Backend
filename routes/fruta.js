const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Fruta = require('../models/fruta.js');
const { generateToken, verifyToken, comparePassword } = require('../routes/auth.js');


// Obtener la lista completa de frutas
router.get('/', (req, res) => {
    Fruta.findAll()
    .then((fruta) => {
      res.json(fruta);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de frutas' });
    });
});

// Crear un nuevo frutas
router.post('/', (req, res) => {
  const { tipo, cantidad, precio } = req.body;

  Fruta.create({ tipo, cantidad, precio })
    .then((fruta) => {
      res.json(fruta);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al crear una nueva fruta' });
    });
});


// Obtener los detalles de una fruta específico
router.get('/:id', (req, res) => {
  const frutaId = req.params.id;

  Fruta.findByPk(frutaId)
    .then((fruta) => {
      if (fruta) {
        res.json(fruta);
      } else {
        res.status(404).json({ error: 'Fruta no encontrado' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los detalles de fruta' });
    });
});

// Actualizar los detalles de un usuario específico
router.put('/:id', (req, res) => {
  const frutaId = req.params.id;
  const { tipo, cantidad, precio } = req.body;

  Fruta.findByPk(frutaId)
    .then((fruta) => {
      if (fruta) {
        fruta.tipo = tipo;
        fruta.cantidad = cantidad;
        fruta.precio = precio;
        return fruta.save();
      } else {
        res.status(404).json({ error: 'Fruta no encontrada' });
      }
    })
    .then((updatedFruta) => {
      res.json(updatedFruta);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar los detalles de la Fruta' });
    });
});

// Eliminar un usuario específico
router.delete('/:id', (req, res) => {
  const frutaId = req.params.id;

  Fruta.findByPk(frutaId)
    .then((fruta) => {
      if (fruta) {
        return fruta.destroy();
      } else {
        res.status(404).json({ error: 'Fruta no encontrado' });
      }
    })
    .then(() => {
      res.json({ message: 'Fruta eliminada correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar el Fruta' });
    });
});

// Resto de los endpoints y lógica de la API

module.exports = router;

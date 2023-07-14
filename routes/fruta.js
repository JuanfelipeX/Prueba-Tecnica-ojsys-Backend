const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Fruta = require('../models/fruta.js');
const { generateToken, verifyToken, comparePassword } = require('../routes/auth.js');

// Obtener la lista completa de frutas paginada
router.get('/', (req, res) => {
  const { size, page } = req.body;
  const pageSize = parseInt(size, 10) || 10; // Tamaño de la página (10 por defecto)
  const currentPage = parseInt(page, 10) || 1; // Página actual (1 por defecto)

  const offset = (currentPage - 1) * pageSize;

  Fruta.findAndCountAll({
    limit: pageSize,
    offset: offset,
  })
    .then((result) => {
      const frutas = result.rows;
      const totalCount = result.count;
      const totalPages = Math.ceil(totalCount / pageSize);

      res.json({
        frutas,
        totalCount,
        totalPages,
        currentPage,
        pageSize,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de frutas' });
    });
});


// Crear una nueva fruta
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

// Obtener los detalles de una fruta específica
router.get('/:id', (req, res) => {
  const frutaId = req.params.id;

  Fruta.findByPk(frutaId)
    .then((fruta) => {
      if (fruta) {
        res.json(fruta);
      } else {
        res.status(404).json({ error: 'Fruta no encontrada' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los detalles de la fruta' });
    });
});

// Actualizar los detalles de una fruta específica
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
      res.status(500).json({ error: 'Error al actualizar los detalles de la fruta' });
    });
});

// Eliminar una fruta específica
router.delete('/:id', (req, res) => {
  const frutaId = req.params.id;

  Fruta.findByPk(frutaId)
    .then((fruta) => {
      if (fruta) {
        return fruta.destroy();
      } else {
        res.status(404).json({ error: 'Fruta no encontrada' });
      }
    })
    .then(() => {
      res.json({ message: 'Fruta eliminada correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar la fruta' });
    });
});

// Resto de los endpoints y lógica de la API

module.exports = router;

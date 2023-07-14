const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedido.js');
const Fruta = require('../models/fruta.js');

// Obtener la lista completa de pedidos
router.get('/', (req, res) => {
  Pedido.findAll()
    .then((pedidos) => {
      res.json(pedidos);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de pedidos' });
    });
});

// Crear un nuevo pedido
router.post('/', (req, res) => {
  const pedidoData = req.body;

  // Verificar que se hayan proporcionado datos válidos
  if (!Array.isArray(pedidoData) || pedidoData.length === 0) {
    res.status(400).json({ error: 'Datos de pedido inválidos' });
    return;
  }

  // Crear un array de objetos Pedido a partir de los datos proporcionados
  const pedidos = pedidoData.map((item) => {
    const { tipo, cantidad } = item;
    return { tipo, cantidad };
  });

  let totalPedido = 0;

  // Realizar las operaciones para cada pedido en paralelo
  Promise.all(
    pedidos.map((pedido) => {
      const { tipo, cantidad } = pedido;

      // Buscar la fruta correspondiente en la tabla "Fruta"
      return Fruta.findOne({ where: { tipo } })
        .then((fruta) => {
          if (fruta) {
            // Verificar si hay suficiente cantidad de la fruta disponible
            if (fruta.cantidad >= cantidad) {
              let valorFruta = fruta.precio * cantidad;

              // Aplicar descuentos según las reglas
              if (pedidos.length > 5) {
                valorFruta *= 0.9; // Descuento del 10% por más de 5 frutas diferentes
              }

              if (cantidad > 10) {
                valorFruta *= 0.95; // Descuento del 5% por más de 10 unidades de la misma fruta
              }

              totalPedido += valorFruta; // Sumar al total del pedido

              return { tipo, cantidad, valor: valorFruta };
            } else {
              throw new Error(`Cantidad insuficiente de ${tipo}`);
            }
          } else {
            throw new Error(`Fruta ${tipo} no encontrada`);
          }
        });
    })
  )
    .then((pedidosValores) => {
      // Guardar los pedidos en la tabla "Pedido"
      return Pedido.bulkCreate(pedidosValores);
    })
    .then((createdPedidos) => {
      res.status(201).json({ totalPedido, pedidos: createdPedidos });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Obtener los detalles de un pedido específico
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
      res.status(500).json({ error: 'Error al obtener los detalles del pedido' });
    });
});

// Actualizar los detalles de un pedido específico
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
        res.status(404).json({ error: 'Pedido no encontrado' });
      }
    })
    .then((updatedPedido) => {
      res.json(updatedPedido);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar los detalles del pedido' });
    });
});

// Eliminar un pedido específico
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
      res.json({ message: 'Pedido eliminado correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar el pedido' });
    });
});

// Resto de los endpoints y lógica de la API

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const userRouter = require('./routes/user.js');
const frutaRouter = require('./routes/fruta.js');
const pedioRouter = require('./routes/pedido.js');

app.use('/user', userRouter);
app.use('/fruta', frutaRouter);

userRouter.get('/', (req, res) => {
  // Lógica para obtener la lista de usuarios
});

userRouter.post('/login', (req, res) => {
  // Lógica de autenticación y generación de token JWT
  // ...
});

frutaRouter.get('/', (req, res) => {
  // Lógica para obtener la lista de fruta
});

pedioRouter.get('/', (req, res) => {
  // Lógica para obtener la lista de pedido
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'prueba_jsys',
  password: '1234',
  port: 5432, // puerto por defecto de PostgreSQL
});

// Prueba de conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error al conectar a la base de datos:', err);
  }
  console.log('Conexión exitosa a la base de datos');
  release(); // liberar el cliente de la conexión
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

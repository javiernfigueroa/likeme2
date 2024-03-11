const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    allowExitOnIdle: true
  });

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_DATABASE:", process.env.DB_DATABASE);


router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los posts');
  }
});

router.post('/', async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  

  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *',
      [titulo, img, descripcion]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar un nuevo post');
  }
});

module.exports = router;

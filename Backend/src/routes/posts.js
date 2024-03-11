const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: 'postgres',
    password: 'Waterpol01#',
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

router.put('/like/:id', async (req, res) => {
  const postId = req.params.id;

  try {
      const result = await pool.query(
          'UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *',
          [postId]
      );

      res.json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar los likes');
  }
});

router.delete('/:id', async (req, res) => {
  const postId = req.params.id;

  try {
      const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [postId]);

      if (result.rows.length === 0) {
          res.status(404).send('Post no encontrado');
      } else {
          res.json(result.rows[0]);
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el post');
  }
});


module.exports = router;

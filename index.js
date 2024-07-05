import express from "express";
import pool from "./config/db.js";
import 'dotenv/config';

const app = express();
const port = process.env.MYSQL_ADDON_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/products", async (req, res) => {
  const sql = `SELECT products.id, products.name, products.brand, products.price, products.stock, products.notes, categories.name AS category FROM products JOIN categories ON products.category_id = categories.id`;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.send(500).send(error);
  }
});

app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const sql = `SELECT products.id, products.name, products.price, products.notes, products.stock, categories.name AS category FROM products JOIN categories ON products.category_id = categories.id WHERE products.id = ?`;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [id]);
    connection.release();
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.post("/api/products", async (req, res) => {
  const product = req.body;

  const sql = `INSERT INTO products SET ?`;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [product]);
    connection.release();
    res.send(`
          <h1>Product created with the ID: ${rows.insertId}</h1>
      `);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.put("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const product = req.body;

  const sql = `UPDATE products SET ? WHERE id = ?`;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [product, id]);
    connection.release();
    console.log(rows);
    res.send(`
          <h1>Product updated with the ID: ${id}</h1>
      `);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM products WHERE id = ?`;

   try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query(sql, [id]);
      connection.release();
      console.log(rows)
       res.send(`
          <h1>Deleted product with the ID: ${id}</h1>
      `);
  } catch (error) {
      res.send(500).send('Internal server error')
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

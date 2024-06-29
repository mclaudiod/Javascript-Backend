import express from "express";
import pool from "./config/db.js";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/products", async (req, res) => {
  const sql = `SELECT products.id, products.name, products.brand, products.price, products.stock, products.notes, categories.name AS category FROM products JOIN categories ON products.category_id = categories.id`;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.send(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import { createPool } from "mysql2/promise";

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "javascript_backend",
  waitForConnections: true,
  connectionLimit: 5,
});

pool
  .getConnection()
  .then((connection) => {
    pool.releaseConnection(connection);
    console.log("Database connected.");
  })
  .catch((err) => {
    console.error("There has been an error while connecting to the database:", err);
  });

export default pool;

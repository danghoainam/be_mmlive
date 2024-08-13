const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const setupSwagger = require("./swagger");
const cors = require("cors");

const app = express();

// CORS middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Swagger
setupSwagger(app);

// Swagger docs for GET /users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of tokens
 *     description: Retrieve a list of tokens from the database.
 *     responses:
 *       200:
 *         description: A list of tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   token:
 *                     type: string
 *                     example: "abcd1234"
 */

// Swagger docs for POST /users
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Update a user's token
 *     description: Update the token for a specific user in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               token:
 *                 type: string
 *                 example: "abcd1234"
 *     responses:
 *       200:
 *         description: The updated user token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 token:
 *                   type: string
 *                   example: "abcd1234"
 *       400:
 *         description: Bad request - ID and token are required
 *       404:
 *         description: User not found
 */

// Endpoint for GET /users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM token";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error", err);
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results.rows); // PostgreSQL trả về `rows`
  });
});

// Endpoint for POST /users
app.post("/users", (req, res) => {
  const { id, token } = req.body;
  if (!id || !token) {
    return res.status(400).json({ error: "ID and token are required" });
  }
  const sql = "UPDATE token SET token = $1 WHERE id = $2";
  db.query(sql, [token, id], (err, results) => {
    if (err) {
      console.error("Database query error", err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (results.rowCount === 0) {
      // PostgreSQL sử dụng `rowCount` thay vì `affectedRows`
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id, token });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

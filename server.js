const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db"); // Ensure this is set up for MySQL
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API for managing user tokens",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./server.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
 *                     example: "abcd12342"
 *                   key:
 *                     type: string
 *                     example: "abcd12342"
 */

// Swagger docs for POST /users
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Update a user's token
 *     description: Update the token and key for a specific user in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abcd1234"
 *               key:
 *                 type: string
 *                 example: "key1234"
 *     responses:
 *       200:
 *         description: The updated user token and key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "abcd1234"
 *                 key:
 *                   type: string
 *                   example: "key1234"
 *       400:
 *         description: Bad request - token and key are required
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
    res.json(results); // MySQL returns results directly
  });
});

// Endpoint for POST /users
app.post("/users", (req, res) => {
  const { token, key } = req.body;
  if (!token || !key) {
    return res.status(400).json({ error: "Token and key are required" });
  }

  const sql = "UPDATE token SET token = ? WHERE `key` = ?";
  db.query(sql, [token, key], (err, results) => {
    if (err) {
      console.error("Database query error", err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "User not found or key does not match" });
    }

    res.json({ token, key });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

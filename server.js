const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const setupSwagger = require("./swagger"); // Import cấu hình Swagger
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*", // Chấp nhận tất cả các nguồn gốc. Bạn có thể thay đổi thành các domain cụ thể.
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setupSwagger(app); // Bật Swagger

// Ví dụ: Get all users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
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
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *                   age:
 *                     type: integer
 *                     example: 30
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Adds a new user to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: John Doe
 *               id:
 *                 type: integer
 *                 example: 0
 *
 *     responses:
 *       200:
 *         description: The newly created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 age:
 *                   type: integer
 *                   example: 30
 *       400:
 *         description: Bad request
 */
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM token";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
app.post("/users", (req, res) => {
  const { id, token } = req.body;
  if (!id || !token) {
    return res.status(400).json({ error: "ID and token are required" });
  }
  const sql = "UPDATE token SET token = ? WHERE id = ?";
  db.query(sql, [token, id], (err, results) => {
    if (err) throw err;

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id, token });
  });
});
// Các endpoint khác...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

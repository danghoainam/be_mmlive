const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  port: "3306",
  user: "sql12723200",
  password: "Vx1G5fZPhe",
  database: "sql12723200",
});

connection.connect((err) => {
  debugger;
  if (err) throw err;
  console.log("Connected to MySQL");
});

module.exports = connection;

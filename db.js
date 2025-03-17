const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "mysql-ac34ba8-danghoainam1202-f2e4.h.aivencloud.com", // IPv6 address
  port: 16661, // Default MySQL port
  user: "avnadmin", // Replace with your MySQL username
  password: "AVNS_HNPa91p6whqL9UyAjfc", // Replace with your MySQL password
  database: "defaultdb", // Replace with your MySQL database name
});

connection.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = connection;

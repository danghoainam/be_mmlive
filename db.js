const { Client } = require("pg");

const client = new Client({
  host: "john.db.elephantsql.com",
  port: 5432, // Port mặc định của PostgreSQL là 5432
  user: "rcmibzdl",
  password: "A_DSyx_zzcT4BYORHUAtj70Z6mMZPCRv",
  database: "rcmibzdl",
});

client.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

module.exports = client;

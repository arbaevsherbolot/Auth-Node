require("dotenv").config();

const database = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.SQL_HOST,
    port: process.env.SQL_DB_PORT,
    user: process.env.SQL_DB_USER,
    password: process.env.SQL_DB_USER_PASSWORD,
    database: process.env.SQL_DB,
  },
});

database.raw("SELECT VERSION()").then(() => {
  console.log("Connected to database successfully...");
});

module.exports = database;

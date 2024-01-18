// Get variables from .env file for database connection
const { HOST, PORT, USER, PASSWORD, NAME } = process.env;

// Create a connection pool to the database
const mysql = require("mysql2/promise");

const client = mysql.createPool({
  host: HOST,
  port: PORT,
  user: USER,
  password: PASSWORD,
  database: NAME,
});

// Try to get a connection to the database
client
  .getConnection()
  .then((connection) => {
    console.info(`Using database ${NAME}`);

    connection.release();
  })
  .catch((error) => {
    console.warn(
      "Warning:",
      "Failed to establish a database connection.",
      "Please check your database credentials in the .env file if you need a database access."
    );
    console.error("Error message:", error.message);
  });

// Store database name into client for further uses
client.databaseName = NAME;

// Ready to export
module.exports = client;

const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Neelu@2004",
    database: "civixa",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
    } else {
        console.log("Civixa MySQL database connected successfully!");
        connection.release();
    }
});

module.exports = db;
const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = async () => {
    // Permet la connexion à la base de données
    let database = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        queueLimit: 0,
    });

    return database;
}

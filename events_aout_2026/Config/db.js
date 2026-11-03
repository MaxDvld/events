import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config()

// Pool : réouvre automatiquement une connexion si MySQL l'a coupée
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

export default connection;
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Variables d'enviroment
require('dotenv').config();

// Utiliser le port du fichier du config, par défaut utiliser le port 3001
const port = process.env.PORT || 3001;

// l'url
const hostname = "172.20.10.3";
const monRouteur = express.Router();

// Utilisation de body-parser
app.use (bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Permet de parser les requêtes
app.use(express.json());

// Permet la connexion à la base de données
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    queueLimit: 0,
});

// Nous permet de définir les origines et le type de requêtes
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Type", "application/json");
    next();
})

// Démarrer le serveur
http.createServer(app).listen(port, hostname, function() {
    console.log(`Le serveur est start sur http://${hostname}:${port}/`);
})

// Nous demandons à l'application d'utiliser notre router et de préfixer par /api
app.use('/api', monRouteur);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require("./endpoints")(monRouteur, pool, jwt, bcrypt);
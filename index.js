const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const registerRoute=require('./routes/client/register')
const loginRoute=require('./routes/client/login')
const clientViewRoute=require('./routes/client/view')
const clientEditInformationRoute=require('./routes/client/edit-informations')
const clientEditPasswordRoute=require('./routes/client/edit-password')
const productsRoute=require('./routes/product/fetchAll')
const productsPromotionRoute=require('./routes/product/promotion')
const productViewRoute=require('./routes/product/view')
const productNewRoute=require('./routes/product/news')

// Variables d'enviroment
require('dotenv').config();

// Utiliser le port du fichier du config, par défaut utiliser le port 3001
const port = process.env.PORT || 8080;

// l'url
const host = "localhost";
const router = express.Router();

// Utilisation de body-parser
app.use (bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Permet de parser les requêtes
app.use(express.json());

// Nous permet de définir les origines et le type de requêtes
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Type", "application/json");
    next();
})

// Démarrer le serveur
http.createServer(app).listen(port, host, function() {
    console.log(`Le serveur est lancé sur http://${host}:${port}/`);
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// require("./endpoints")(monRouteur, pool, jwt, bcrypt);

// Routes

// Client
app.use("/api/register", registerRoute)
app.use("/api/login", loginRoute)
app.use("/api/client", clientViewRoute)
app.use("/api/client/edit/information", clientEditInformationRoute)
app.use("/api/client/edit/password", clientEditPasswordRoute)

// Produits
app.use("/api/products", productsRoute)
app.use("/api/products/promotion", productsPromotionRoute)
app.use("/api/product", productViewRoute)
app.use("/api/products/news", productNewRoute)

// Commandes



// Client : auth, register, voir fiche client et edit, modifier mdp
// Produit : liste, un seul, liste promo / nouveauté et gestion promo
// Commande : passer comamnde, paiement effectué, liste commandes passée, recupéré commande effectué
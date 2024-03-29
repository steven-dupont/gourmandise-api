const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const registerRoute=require('./routes/client/register')
const loginRoute=require('./routes/client/login')
const clientMeRoute=require('./routes/client/me')
const clientEditInformationRoute=require('./routes/client/edit-informations')
const clientEditPasswordRoute=require('./routes/client/edit-password')
const clientResetPasswordRoute=require('./routes/client/reset-password')
const productsRoute=require('./routes/product/findAll')
const productsPromotionRoute=require('./routes/product/promotion')
const productViewRoute=require('./routes/product/view')
const productNewRoute=require('./routes/product/new')
const ordersRoute=require('./routes/order/findAll')
const ordersLastRoute=require('./routes/order/findLast')
const ordersNewRoute=require('./routes/order/new')

// Variables d'enviroment
require('dotenv').config();

// Utiliser le port du fichier du config, par défaut utiliser le port 8080
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

// Démarre le serveur
http.createServer(app).listen(port, host, function() {
    console.log(`Le serveur est lancé sur http://${host}:${port}/`);
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// require("./endpoints")(monRouteur, pool, jwt, bcrypt);

// Routes

// Client
app.use("/api/register", registerRoute)
app.use("/api/login", loginRoute)
app.use("/api/me", clientMeRoute)
app.use("/api/me/information/edit", clientEditInformationRoute)
app.use("/api/me/password/edit", clientEditPasswordRoute)
app.use("/api/reset-password", clientResetPasswordRoute)

// Produits
app.use("/api/products", productsRoute)
app.use("/api/products/promotion", productsPromotionRoute)
app.use("/api/product", productViewRoute)
app.use("/api/products/new", productNewRoute)

// Commandes
app.use("/api/orders", ordersRoute)
app.use("/api/orders/last", ordersLastRoute)
app.use("/api/orders/new", ordersNewRoute)

// Client : auth, register, voir fiche client et edit, modifier mdp
// Produit : liste, un seul, liste promo / nouveauté et gestion promo
// Commande : passer commande, paiement effectué, liste commandes passée, recupérer commande effectué
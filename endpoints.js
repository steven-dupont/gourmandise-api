bcrypt = require('bcrypt');
swaggerUi = require('swagger-ui-express');
swaggerSpec = require('./swagger');

module.exports = function (app, pool, jwt, bcrypt) {
    // On définit les loader

    // Permet d'enregistrer un nouveau client

    /**
     * @swagger
     * /register:
     *  post:
     *   description: Permet d'enregistrer un nouveau client
     *   parameters:
     *   - name: nom
     *   - name: adresse
     *   - name: cp
     *   - name: ville
     *   - name: telephone
     *   - name: email
     *   - name: motdepasse
     *   responses:
     *      201:
     *          description: Création d'un nouveau client
     *      500:
     *          description: Erreur lors de l'enregistrement du client
     */
    app.post("/register", async (req, res) => {
        const { nom, adresse, cp, ville, telephone, email, motdepasse } = req.body;
        const hashedPassword = await bcrypt.hash(motdepasse, 10);
        const values = [nom, adresse, cp, ville, telephone, email, hashedPassword];

       try{
           await pool.execute("INSERT INTO client (nom, adresse, cp, ville, telephone, email, motdepasse) VALUES (?, ?, ?, ?, ?, ?, ?)", values);
           res.sendStatus(201);
       }
       catch (err){
           console.log(err);
           res.json({
               success: false,
               message: "Une erreur est survenue lors de l'enregistrement de l'utilisateur."
           });
       }
    });

    // Permet de réinitialiser le mot de passe d'un client
    /**
     * @swagger
     * /client/reset-password:
     *  post:
     *      description: Permet de réinitialiser le mot de passe d'un client
     *  parameters:
     *      - name: email
     *  responses:
     *     200:
     *          description: Le mot de passe du compte a été réinitialisé
     *     500:
     *          description: Erreur lors de la réinitialisation du mot de passe
     */
    app.post("/client/reset-password", async (req, res) => {
        const { email } = req.body;

        // Générer un mot de passe aléatoire
        const generatePassword = Math.random().toString(36).slice(-10);

        const hashedPassword = await bcrypt.hash(generatePassword, 10);
        const values = [hashedPassword, email];

        try{
            await pool.execute("UPDATE client SET motdepasse = ? WHERE email = ?", values);
            res.status(200).json({ status: "success", message: "Le mot de passe du compte " + email + " a été réinitialisé. Le nouveau mot de passe est : " + generatePassword});
        }
        catch (err){
            console.log(err);
            res.json({
                success: false,
                message: "Une erreur est survenue lors de la réinitialisation du mot de passe."
            });
        }
    });

    // Permet de connecter un client
    /**
     * @swagger
     * /login:
     *  post:
     *      description: Permet de connecter un client
     *  parameters:
     *      - name: email
     *      - name: motdepasse
     * responses:
     *      200:
     *          description: Connexion réussie
     *      500:
     *          description: Erreur lors de la connexion
     */
    app.post("/login", async (req, res) => {
        const { email, motdepasse } = req.body;

        try{
            const [utilisateur] = await pool.execute("SELECT * FROM client WHERE email = ?", [email]);

            if (utilisateur.length === 0) {
                // Utilisateur introuvable
                res.status(500).json({ status: "error", message: "Les informations de connexion sont incorrect." });
            } else {
                const isPasswordCorrect = await bcrypt.compare(motdepasse, utilisateur[0].motdepasse);

                console.log(isPasswordCorrect);

                if (isPasswordCorrect) {
                    const token = jwt.sign({ id: utilisateur[0].codec }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    res.status(200).json({ status: "success", token: token });
                } else {
                    // Mot de passe incorrect
                    res.status(500).json({ status: "error", message: "Les informations de connexion sont incorrect." });
                }
            }
        }
        catch (err){
            console.log(err);
            res.json({
                success: false,
                message: "Une erreur est survenue."
            });
        }
    });

    // On récupère tous les produits
    /**
     * @swagger
     * /product:
     *  get:
     *      description: On récupère tous les produits
     *  responses:
     *     200:
     *          description: Récupération des produits
     *     500:
     *          description: Erreur lors de la récupération des produits
     */
    app.get('/products', async (req, res) => {
        try{
            const [products] = await pool.execute("SELECT * FROM produit");
            res.status(200).json(products);
        }
        catch(err){
            res.status(500).json({ message: err.message });
        }
    });

    // On récupère les infos d'un client en fonction de son codec (code client)
    /**
     *  @swagger
     *  /client/{id}:
     *    get:
     *      description: On récupère les infos d'un client en fonction de son codec (code client)
     *    parameters:
     *      - name: id
     *    responses:
     *      200:
     *          description: Récupération des infos d'un client
     *      500:
     *          description: Erreur lors de la récupération des infos d'un client
     */
    app.get("/client/:id", async (req, res) => {
        try{
            const [client] = await pool.execute("SELECT * FROM client WHERE codec = ?", [req.params.id]);
            res.status(200).json(client);
        }
        catch(err){
            res.status(500).json({ message: err.message });
        }
    });

    // On récupère les commandes passées d'un client en fonction de son codec (code client)
    /**
     * @swagger
     * /client/commandes/{id}:
     *  get:
     *     description: On récupère les commandes passées d'un client en fonction de son codec (code client)
     *  parameters:
     *     - name: id
     * responses:
     *      200:
     *          description: Récupération des commandes passées d'un client
     *      500:
     *          description: Erreur lors de la récupération des commandes passées d'un client
     */
    app.get("/client/commandes/:id", async (req, res) => {
        try{
            const [commandes] = await pool.execute("SELECT * FROM commande WHERE codec = ?", [req.params.id]);
            res.status(200).json(commandes);
        }
        catch(err){
            res.status(500).json({ message: err.message });
        }
    });
}

// Minimum 13 routes
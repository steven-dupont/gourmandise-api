const express=require('express');
const router= express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../../config/database');
const auth = require("../../middleware/auth");


router.get("/", auth, async (req, res) => {
    const bdd = await database();

    try {
        const [client] = await bdd.execute("SELECT * FROM client WHERE codec = ?", [req.user.id]);

        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Une erreur est survenue lors de la récupération des informations du client."
        });
    }
});

module.exports=router;
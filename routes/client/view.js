const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../../config/database');

router.get("/:id", async (req, res) => {
    const bdd = await database()

    try{
        const [client] = await bdd.execute("SELECT * FROM client WHERE codec = ?", [req.params.id]);

        if(client.length === 0){
            // Utilisateur introuvable
            res.status(500).json({ status: "error", message: "Le client '" + req.params.id + "' n'existe pas." });
        }
        else{
            res.status(200).json(client);
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

module.exports=router;
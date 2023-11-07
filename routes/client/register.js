const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');

router.post("/", async (req, res) => {
    const { nom, adresse, cp, ville, telephone, email, motdepasse } = req.body;
    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    const values = [nom, adresse, cp, ville, telephone, email, hashedPassword];

    const bdd = await database();

    try{
        await bdd.execute("INSERT INTO client (nom, adresse, cp, ville, telephone, email, motdepasse) VALUES (?, ?, ?, ?, ?, ?, ?)", values);
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

module.exports=router;
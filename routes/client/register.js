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
        if(nom.length === 0 || adresse.length === 0 || cp.length === 0 || ville.length === 0 || telephone.length === 0 || email.length === 0 || motdepasse.length === 0){
            res.status(500).json({ status: "error", message: "Merci de remplir tous les champs !" });
        } else {
            await bdd.execute("INSERT INTO client (nom, adresse, cp, ville, telephone, email, motdepasse) VALUES (?, ?, ?, ?, ?, ?, ?)", values);
            res.status(201).json({ status: "success", message: 'Votre compte a bien été créé.' });
        }
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
const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');

router.post("/:id", async (req, res) => {
    const { email, adresse, cp, ville, telephone } = req.body;
    const values = [email, adresse, cp, ville, telephone];

    const bdd = await database();

    try{
        const [client] = await bdd.execute("SELECT codec FROM client WHERE codec = " + req.params.id);

        if(client.length === 0){
            res.status(500).json({ status: "error", message: "Ce compte n'existe pas !" });
        }
        else{
            if(email.length === 0 || adresse.length === 0 || cp.length === 0 || ville.length === 0 || telephone.length === 0){
                res.status(500).json({ status: "error", message: "Les champs ne peuvent pas être vide !" });
            }
            else{
                await bdd.execute("UPDATE client SET email = ?, adresse = ?, cp = ?, ville = ?, telephone = ? WHERE codec = " + req.params.id, values);
                res.status(200).json({ status: "success", message: "Les informations du compte ont bien été modifiés !" });
            }
        }
    }
    catch (err){
        console.log(err);
        res.json({
            success: false,
            message: "Une erreur est survenue lors des modification du compte de l'utilisateur."
        });
    }
});

module.exports=router;
const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');

router.post("/:id", async (req, res) => {
    const { motdepasse, confirmerMdp } = req.body;
    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    const values = [hashedPassword];

    const bdd = await database();

    try{
        const [client] = await bdd.execute("SELECT codec FROM client WHERE codec = " + req.params.id);

        if(client.length === 0){
            res.status(500).json({ status: "error", message: "Ce compte n'existe pas !" });
        }
        else{
            if(motdepasse.length === 0 || confirmerMdp.length === 0){
                res.status(500).json({ status: "error", message: "Les champs ne peuvent pas être vide !" });
            }
            else{
                if(motdepasse !== confirmerMdp){
                    res.status(500).json({ status: "error", message: "Les mots de passe ne correspondent pas !" });
                }
                else{
                    await bdd.execute("UPDATE client SET motdepasse = ? WHERE codec = " + req.params.id, values);
                    res.status(200).json({ status: "success", message: "Le mot de passe du compte a bien été modifié !" });
                }
            }
        }
    }
    catch (err){
        console.log(err);
        res.json({
            success: false,
            message: "Une erreur est survenue lors de la modification du mot de passe de l'utilisateur."
        });
    }
});

module.exports=router;
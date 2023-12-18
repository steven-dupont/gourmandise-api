const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');
const auth = require('../../middleware/auth');

router.post("/", auth, async (req, res) => {
    const { motdepasse, confirmerMdp } = req.body;
    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    const values = [hashedPassword];

    const bdd = await database();

    try{
        if(motdepasse.length === 0 || confirmerMdp.length === 0){
            res.status(500).json({ status: "error", message: "EMPTY_FILEDS" });
        }
        else{
            if(motdepasse !== confirmerMdp){
                res.status(500).json({ status: "error", message: "INVALID_IDENTIFIERS" });
            }
            else{
                await bdd.execute("UPDATE client SET motdepasse = ? WHERE codec = " + [req.user.id], values);
                res.status(200).json({ status: "success", message: "UPDATED_PASSWORD" });
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
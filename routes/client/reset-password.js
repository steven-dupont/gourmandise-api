const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');

router.post("/", async (req, res) => {
    const { email } = req.body;
    const generatePassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(generatePassword, 10);

    const bdd = await database();

    try{
        await bdd.execute("UPDATE client SET motdepasse = ? WHERE email = ?", [hashedPassword, email]);
        res.status(200).json({ status: "success", message: "GENERATED_PASSWORD", email: email, code: generatePassword });
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
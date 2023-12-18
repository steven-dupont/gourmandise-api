const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');
const auth = require('../../middleware/auth');

router.post("/", auth, async (req, res) => {
    const { email, adresse, cp, ville, telephone } = req.body;
    const values = [email, adresse, cp, ville, telephone];

    const bdd = await database();

    try{
        if(email.length === 0 || adresse.length === 0 || cp.length === 0 || ville.length === 0 || telephone.length === 0){
            res.status(500).json({ status: "error", message: "EMPTY_FILEDS" });
        }
        else{
            if(!email.includes("@")){
                res.status(500).json({ status: "error", message: "EMAIL_NOT_VALID" });
            }
            else{
                if(email.length <= 255 || adresse.length <= 50 || cp.length <= 5 || ville.length > 25 || telephone.length > 25){
                    res.status(500).json({ status: "error", message: "FIELDS_TOO_LONG" });
                }
                else{
                    const result = await bdd.query("SELECT email FROM client WHERE email = ?", [email]);

                    if(result.length > 0 && result[0].email !== req.user.email){
                        res.status(500).json({ status: "error", message: "EMAIL_ALREADY_USED" });
                    }
                    else{
                        await bdd.execute("UPDATE client SET email = ?, adresse = ?, cp = ?, ville = ?, telephone = ? WHERE codec = " + [req.user.id], values);
                        res.status(200).json({ status: "success", message: "INFORMATION_ACCOUNT_UPDATED" });
                    }
                }
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
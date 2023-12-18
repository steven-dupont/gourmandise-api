const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');

router.get("/:id", async (req, res) => {
    const bdd = await database()

    try{
        const [produit] = await bdd.execute("SELECT * FROM produit WHERE reference = ?", [req.params.id]);

        if(produit.length === 0){
            // Produit introuvable
            res.status(500).json({ status: "error", message: "PRODUCT_NOT_FOUND" });
        }
        else{
            res.status(200).json(produit);
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
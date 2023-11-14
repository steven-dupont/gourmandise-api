const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');

router.get("/", async (req, res) => {
    const bdd = await database()

    try{
        const [products] = await bdd.execute("SELECT * FROM produit");

        if(products.length === 0){
            // Aucun produit
            res.status(500).json({ status: "error", message: "Aucun produit n'a été trouvé" });
        }
        else{
            res.status(200).json(products);
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
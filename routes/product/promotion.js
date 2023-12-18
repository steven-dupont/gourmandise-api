const express=require('express');
const router=express.Router();
const database = require('../../config/database');

router.get("/", async (req, res) => {
    const bdd = await database()

    try{
        const [productsPromotion] = await bdd.execute("SELECT * FROM produit WHERE promotion = 1");

        if(productsPromotion.length === 0){
            // Aucun produit
            res.status(500).json({ status: "error", message: "PROMOTIONAL_PRODUCT_NOT_FOUND" });
        }
        else{
            res.status(200).json(productsPromotion);
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
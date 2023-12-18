const express=require('express');
const router=express.Router();
const database = require('../../config/database');

router.get("/", async (req, res) => {
    const bdd = await database()

    try{
        const [newProducts] = await bdd.execute("SELECT * FROM produit ORDER BY reference DESC LIMIT 11");

        if(newProducts.length === 0){
            // Aucun produit
            res.status(500).json({ status: "error", message: "PRODUCT_NOT_FOUND" });
        }
        else{
            res.status(200).json(newProducts);
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
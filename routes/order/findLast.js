const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');
const auth = require('../../middleware/auth');

router.get("/", auth, async (req, res) => {
    const bdd = await database()

    try{
        const [orders] = await bdd.execute("SELECT commande.numero AS numero_commande, ligne_commande.numero_ligne, produit.designation FROM commande, ligne_commande, produit WHERE codec = ? AND commande.numero = ligne_commande.numero AND ligne_commande.reference = produit.reference ORDER BY commande.numero DESC LIMIT 1", [req.user.id]);

        if(orders.length === 0){
            res.status(500).json({ status: "error", message: "ORDER_NOT_FOUND" });
        }
        else{
            res.status(200).json(orders);
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
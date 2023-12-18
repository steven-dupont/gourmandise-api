const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');
const auth = require('../../middleware/auth');

router.post("/", auth, async (req, res) => {
    const { produit, quantite} = req.body;

    const bdd = await database();

    try{
        const [product] = await bdd.execute("SELECT reference FROM produit WHERE reference = ?", [produit]);

        if(product.length !== 0){
            const [client] = await bdd.execute("SELECT codec FROM client WHERE codec = ?", [req.user.id]);

            const [prix] = await bdd.execute("SELECT prix_unitaire_HT, promotion, promotion_nombre FROM produit WHERE reference = ?", [produit]);

            if(prix[0].promotion === true){
                const [prixPromotion] = [prix[0].prix_unitaire_HT - (prix[0].prix_unitaire_HT * prix[0].promotion_nombre / 100)];
            } else {
                const [prixPromotion] = [prix[0].prix_unitaire_HT];
            }

            if(client.length !== 0){
                await bdd.execute("INSERT INTO commande (codec, prix_ht) VALUES (?, ?)", [req.user.id, [prixPromotion]]);

                const [commande] = await bdd.execute("SELECT numero FROM commande WHERE codec = ? ORDER BY numero DESC LIMIT 1", [req.user.id]);

                await bdd.execute("INSERT INTO ligne_commande (numero, numero_ligne, reference, quantite_demandee) VALUES (?, ?, ?, ?)", [commande[0].numero, 1, produit, quantite]);

                res.status(200).json({ status: "success", message: "ORDER_CREATED" });
            } else {
                res.status(500).json({ status: "error", message: "USER_NOT_FOUND" });
            }
        } else {
            res.status(500).json({ status: "error", message: "PRODUCT_NOT_FOUND" });
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
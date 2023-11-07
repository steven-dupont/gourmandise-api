const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const database = require('../../config/database');

router.post("/", async (req, res) => {
    const { email, motdepasse } = req.body;

    const database = await database()

    try{
        const [utilisateur] = await pool.execute("SELECT * FROM client WHERE email = ?", [email]);

        if (utilisateur.length === 0) {
            // Utilisateur introuvable
            res.status(500).json({ status: "error", message: "Les informations de connexion sont incorrect." });
        } else {
            const isPasswordCorrect = await bcrypt.compare(motdepasse, utilisateur[0].motdepasse);

            console.log(isPasswordCorrect);

            if (isPasswordCorrect) {
                const token = jwt.sign({ id: utilisateur[0].codec }, process.env.JWT_SECRET, { expiresIn: "1h" });
                res.status(200).json({ status: "success", token: token });
            } else {
                // Mot de passe incorrect
                res.status(500).json({ status: "error", message: "Les informations de connexion sont incorrect." });
            }
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
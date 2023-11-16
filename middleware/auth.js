const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = (req, res, next) => {
    const cookies = req.headers.cookie;

    if (!cookies) {
        return res.status(401).json({ status: "error", message: 'Accès refusé.' });
    }

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.jwtToken;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ status: "error", message: 'Le token JWT est invalide ! Veuillez vous reconnecter.' });
        }
    } else {
        res.status(401).json({ status: "error", message: 'Accès refusé.' });
    }
};
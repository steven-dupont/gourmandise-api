const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = (req, res, next) => {
    const cookies = req.headers.cookie;

    if (!cookies) {
        return res.status(401).json({ status: "error", message: 'ACCESS_DENIED' });
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
            res.status(401).json({ status: "error", message: 'NOT_CONNECTED' });
        }
    } else {
        res.status(401).json({ status: "error", message: 'ACCESS_DENIED' });
    }
};
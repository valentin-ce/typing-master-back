const jwt = require('jsonwebtoken');

/**
 * Verify Token
 * @param {object} req 
 * @param {object} res 
 * @param {object} next
 * @returns {object|void} response object 
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.user = user;
            next();
        });
    } else {
        return res.sendStatus(401)
    }
}

module.exports = {
    verifyToken,
}
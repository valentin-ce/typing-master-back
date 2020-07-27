const jwt = require('jsonwebtoken');
const db = require('../database')
/**
 * Verify Token
 * @param {object} req 
 * @param {object} res 
 * @param {object} next
 * @returns {object|void} response object 
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['Authentification'];
    if (!token) {
        return res.status(400).send({ 'message': 'Token is not provided' });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const findAccount = 'SELECT * FROM users WHERE userid = $1';
    db.query(findAccount, [decoded.userid], (error, results) => {
    if (!results.rows[0]) {
        return res.status(400).send({ 'message': 'The token you provided is invalid' });
    }
    if (error) {
        return res.status(400).send(error);
    }
        req.account = { userid: decoded.userid };
        next();
    });
}

module.exports = {
    verifyToken,
}
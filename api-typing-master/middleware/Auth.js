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
    /*
    const token = req.headers['Authorization'];
    */
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(token)
        jwt.verify(token, process.env.TOKENSECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
    /*
    if (!token) {
        return res.status(400).send({ 'message': 'Token is not provided' });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded)
    const findAccount = 'SELECT * FROM users WHERE userid = $1';
    db.query(findAccount, [decoded.userid], (error, results) => {
    if (!results.rows[0]) {
        return res.status(400).send({ 'message': 'The token you provided is invalid' });
    }
    if (error) {
        return res.status(400).send(error);
    }
        req.users = { userid: decoded.userid };
        next();
    });
    */
}

module.exports = {
    verifyToken,
}
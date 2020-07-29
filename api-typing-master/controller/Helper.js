const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');

/**
 * use to hash password
 * @param {string} password 
 * @return {string} hashed password
 */
const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
};

/**
 * use to compare password
 * @param {string} hashPassword
 * @param {string} password
 * @return {boolean} true or false
 */
const comparePassword = (hashPassword, password) => {
    return bcrypt.compareSync(password, hashPassword);
}

/**
 * verify if email is valid
 * @param {string} email
 * @return {boolean} true or false
 */
const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

/**
 * verify if email already exists
 * @param {string} email 
 * @return {boolean} true or false
 */
const emailExist = (email) => {
    db.query('SELECT email FROM users WHERE email = $1', [email], (err, res) => {
        if (err) {
            throw err
        }
        console.log(res.rows)
        return res.rows;
    })
}

/**
 * generate token
 * @param {string} id
 * @return {string} token
 */
const generateToken = (id) => {
    const token = jwt.sign({
        userid : id
    },
    process.env.SECRET, {expiresIn: '24h'}
    );
    return token;
}

module.exports = {
    generateToken,
    isValidEmail,
    emailExist,
    comparePassword,
    hashPassword,
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * verify if email is valid
 * @param {string} email
 * @return {boolean} true or false
 */
const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
}

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
*/
const validatePassword = (password) => {
    if (password.length <= 5 || password === '') {
        return false;
    } return true;
};

/**
 * use to hash password
 * @param {string} password 
 * @return {string} hashed password
 */
const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

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
 * isEmpty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const isEmpty = (input) => {
    if (input === undefined || input === '') {
        return true;
    }
    if (input.replace(/\s/g, '').length) {
        return false;
    } return true;
};

/**
 * generate token
 * @param {string} id
 * @return {string} token
 */
const generateToken = (id, username) => {
    const token = jwt.sign({
        userid : id
    },
    process.env.SECRET, {expiresIn: '24h'}
    );
    return token;
}

module.exports = {
    isValidEmail,
    validatePassword,
    hashPassword,
    comparePassword,
    isEmpty,
    generateToken,
};

const db = require('../db/database.js')
const { isEmpty, isValidEmail, validatePassword, hashPassword, generateToken, comparePassword } = require('../helper/validation.js')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();


/**
 * Use to create user
 * @param {object} req 
 * @return {object} token 
 */
const signupUser = async (req, res) => {
    const { email, username, password } = req.body;
    const creationDate = new Date();

    if (isEmpty(email) || isEmpty(username) || isEmpty(password)) {
        return res.status(400).send({ error: 'Formulaire incomplet' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).send({ error: 'Adresse email invalide' });
    }
    if (!validatePassword(password)) {
        return res.status(400).send({ error: 'Le mot de passe doit contenir 5 characters' });
    }

    const hashedPassword = hashPassword(password);

    const signupUserQuery = `INSERT INTO
        users( userid, username, email, emailverified, creationdate, password )
        VALUES( $1, $2, $3, $4, $5, $6 )
        RETURNING *`;

    const values = [
        uuidv4(),
        username,
        email,
        'false',
        creationDate,
        hashedPassword
    ];

    db.query(signupUserQuery, values, (error, results) => {
        if (error) {
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({ error: 'adresse email déjà utilisée' })
            }

            console.log(error)
            return res.status(400).send(error);
        }
        const token = generateToken(results.rows[0].userid)
        return res.status(201).send({ token })
    })
}

/**
 * Use to signin user
 * @param {object} req 
 * @returns {string} token 
 */
const signinUser = async (req, res) => {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password)) {
        return res.status(400).send({ error: 'Veuillez saisir votre adresse email ainsi que votre mot de passe'})
    }
    if (!isValidEmail(email) || !validatePassword(password)) {
        return res.status(400).send({ error: 'Veuillez saisir une adresse email valide'})
    }

    const signinUserQuery = 'SELECT * FROM users WHERE email = $1'
    db.query(signinUserQuery, [email], (error, results) => {
        if (results === undefined) {
            return res.status(400).send({ error: 'Aucun utilisateur enregister avec cette adresse email'})
        }
        if (error) {
            return res.status(400).send(error)
        }
        if (!comparePassword(results.rows[0].password, password)) {
            return res.status(400).send({ error: 'Mot de passe incorect'})
        }
        const token = generateToken(results.rows[0].userid);
        return res.status(200).send({ token })
    })
}

module.exports = {
    signupUser,
    signinUser,
}
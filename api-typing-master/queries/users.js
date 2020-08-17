const db = require('../database.js');
const Helper = require('../controller/Helper')
const { uuid } = require('uuidv4');
const jwt = require('jsonwebtoken');
const { idleCount } = require('../database.js');
require('dotenv').config();

/**
 * use to request account by decoded token
 * @param {headers} token 
 * @returns {object} user 
 */
const getUser = (request, response) => {
 const { userid } = request.user;
 console.log(userid)
  db.query('SELECT * FROM users WHERE userid = $1', [ userid ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

/**
 * Use to create account returning token
 * @param {body} request
 * @return {string} token
 */
const createUser = (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.username) {
        return res.status(400).send({error: 'Formulaire incomplet'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
        return res.status(400).send({error: 'Adresse email invalide'});
    }
    if (!req.body.password) {
        return res.status(400).send({error: 'Veuillez saisir votre mot de passe'});
    }
    const checkEmail = 'SELECT * FROM users WHERE email = $1';
    db.query(checkEmail, [req.body.email], (error, results) => {
      if (results.rows[0] != undefined) {
        return res.status(400).send({ error: 'Adresse e-mail déjà utilisée' })
      }
      if (error) {
        console.log(error)
        return res.status(400).send(error);
      }
      const hashPassword = Helper.hashPassword(req.body.password);
      const dateTime = new Date();
      const createQuery = `INSERT INTO
        users(userid, username, email, emailverified, creationdate, password)
        VALUES($1, $2, $3, $4, $5, $6)
        returning *`;
      const values = [
        uuid(),
        req.body.username,
        req.body.email,
        'false',
        dateTime.toISOString().slice(0,10),
        hashPassword
      ];
      db.query(createQuery, values, (error, results) => {
        if (error) {
          return res.status(400).send(error);
        }
        const token = Helper.generateToken(results.rows[0].userid)
        return res.status(201).send({ token })
      })
    });
}

/**
 * Login account returning token 
 * @param {body} email
 * @param {body} password 
 * @returns {String} token 
 */
const loginUser = (req, res) => {
    if (!req.body.password && !req.body.email) {
       return res.status(400).send({error :'Veuillez saisir votre adresse email ainsi que votre mot de passe'});   
    }
    if (!req.body.password) {
      return res.status(400).send({error :'Veuillez saisir votre mot de passe'});
    }
    if (!req.body.email) {
      return res.status(400).send({error :'Veuillez saisir une adresse électronique'})
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ error: 'Adresse email invalide' });
    }
    const getUser = 'SELECT * FROM users WHERE email = $1';
    db.query(getUser, [req.body.email], (error, results) => {
      if (!results.rows[0]) {
        return res.status(400).send({ error: 'Pas d\'utilisateur enregistrer pour cette adresse email' })
      }
      if (error) {
        return res.status(400).send(error);
      }
      if (!Helper.comparePassword(results.rows[0].password, req.body.password)) {
        return res.status(400).send({ error: 'Mot de passe incorrect' });
      }
      const token = Helper.generateToken(results.rows[0].userid);
      return res.status(200).send({ token });
    });
  }

/**
 * Use to delete user by id 
 * @param {params} userid
 * @returns {string} response 
 */
const deleteUser = (request, response) => {
  const { userid } = request.user;

  db.query('DELETE FROM users WHERE userid = $1', [userid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`account deleted with ID: ${userid}`)
  })
}

module.exports = {
    getUser,
    createUser,
    loginUser,
    deleteUser,
}
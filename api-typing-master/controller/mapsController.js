const db = require('../db/database.js')
require('dotenv').config();


/**
 * use to get maps
 * @param {void} req 
 * @return {object} maps 
 */
const getMaps = async (req, res) => {
    db.query('SELECT * FROM maps ORDER BY mapid ASC', (error, results) => {
        if (error) {
            throw error
        }
        return res.status(200).send(results.rows)
    })
}

/**
 * use to add maps
 * @param {void} req 
 * @return {object} maps 
 */
const addMaps = async (req, res) => {
    const { title, coveredLetter, gamemod, difficulty } = req.body;

    const addMapQuery = `INSERT INTO
        maps( title, coveredLetter, gamemod, difficulty)
        VALUES( $1, $2, $3, $4 )
        RETURNING *`;

    const values = [
        title,
        coveredLetter,
        gamemod,
        difficulty,
    ];

    db.query(addMapQuery, values, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(400).send(error);
        }
        return res.status(200).send(results.rows)
    })
}

module.exports = {
    getMaps,
    addMaps
}
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

module.exports = {
    getMaps,
}
var pool = require('../db.connexion');

// get de tous les tiers
const getAllTiers = async (req, res) => {
    const tiers = await pool.query("SELECT * FROM tier;");
    res.json(tiers.rows);
}

module.exports = {
    getAllTiers
}
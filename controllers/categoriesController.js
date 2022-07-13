var pool = require('../db.connexion');

// get de toutes les catégories
const getAllCategories = async (req, res) => {
    const categories = await pool.query("SELECT * FROM categorie;");
    res.json(categories.rows);
}

module.exports = {
    getAllCategories
}
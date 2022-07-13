var pool = require('../db.connexion');

// get de toutes les tags
const getAllTags =  async (req, res) => {
    const tags = await pool.query("SELECT * FROM tag ORDER BY tag_label;");
    res.json(tags.rows);
}

module.exports = {
    getAllTags
}
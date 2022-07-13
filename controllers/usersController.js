var pool = require('../db.connexion');

// return 1 si les information de l'utilisateur sont correctes
const isUser = async (req, res) => {
    const {u_username, u_password} = req.body;
    try {
        const utilisateur = await pool.query(
            "SELECT u_id FROM utilisateur WHERE u_username = $1 AND u_password = $2", 
            [u_username, u_password]
        );
        res.json(utilisateur.rows[0]);
    } catch (err) {
        console.error(err.messages);
    }
}

module.exports = {
    isUser
}
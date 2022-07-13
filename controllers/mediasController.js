var pool = require('../db.connexion');

// ----- MEDIA ----- //

// get de tous les médias
const getAllMedias = async (req, res) => {
    const medias = await pool.query("SELECT media_id, media_titre, media_description, media_img, tag_label, media_etat, categ_label FROM media JOIN tag ON media_tag_id = tag_id JOIN categorie ON media_categ_id = categ_id ORDER BY media_titre;");
    res.json(medias.rows);
}

// get d'un ou plusieurs médias en fonction d'un titre
const getAllMediasWithTitre = async (req, res) => {
    const {media_titre} = req.params;
    try {
        const medias = await pool.query(
            "SELECT media_id, media_titre, media_description, media_img, tag_label, media_etat, categ_label FROM media JOIN tag ON media_tag_id = tag_id JOIN categorie ON media_categ_id = categ_id WHERE media_titre ILIKE $1;", 
            ['%'+media_titre+'%']
        );
        res.json(medias.rows);
    } catch (err) {
        console.error(err.messages);
    }
}

// get d'un média en fonction de son id
// const getMediaById = async (req, res) => {
//     const {media_id} = req.params;
//     try {
//         const media = await pool.query(
//             "SELECT media_id, media_titre, media_description, media_img, tag_label, media_etat, categ_label FROM media JOIN tag ON media_tag_id = tag_id JOIN categorie ON media_categ_id = categ_id WHERE media_id = $1;", 
//             [media_id]
//         );
//         res.json(media.rows[0]);
//     } catch (err) {
//         console.error(err.messages);
//     }
// }

// post pour créer un média + return de son id
const createMedia = async (req, res) => {
    try {
        const {media_titre, media_description, media_img, media_tag_id, media_etat, media_categ_id} = req.body;
        const add_media = await pool.query(
            "INSERT INTO media (media_titre, media_description, media_img, media_tag_id, media_etat, media_categ_id) VALUES ($1, $2, $3, $4, $5) RETURNING media_id;",
            [media_titre, media_description, media_img, media_tag_id, media_etat, media_categ_id]
        );
        res.json(add_media.rows[0]);
    } catch (err) {
        console.error(err.messages);
    }
}

// update de la fiche d'un média
const updateMedia = async (req, res) => {
    try {
        const {media_titre, media_description, media_img, media_tag_id, media_etat, media_categ_id, media_id} = req.body;
        const udt_media = await pool.query(
            "UPDATE media SET media_titre = $1, media_description = $2, media_img = $3, media_tag_id = $4, media_etat = $5, media_categ_id = $6 WHERE media_id = $7 RETURNING media_id;",
            [media_titre, media_description, media_img, media_tag_id, media_etat, media_categ_id, media_id]
        );
        res.json(udt_media.rows[0]);
    } catch (err) {
        console.error(err.messages);
    }
}

// ----- UTILISATEUR_MEDIA_LIST ----- //

    /**
        get des médias d'un utilisateur
        mediasController.get("/mediasFromUtilisateurList/:uml_u_id", async (req, res) => {
            const {uml_u_id} = req.params;
            try {
                const medias = await pool.query(
                    "SELECT media_id, media_titre, media_description, media_img, tag_label, media_etat, tier_label, uml_tier_id, uml_avancement, categ_label FROM media JOIN tag ON media_tag_id = tag_id JOIN categorie ON media_categ_id = categ_id JOIN utilisateur_media_list ON uml_media_id = media_id JOIN tier ON uml_tier_id = tier_id WHERE uml_u_id = $1 ORDER BY tier_id;", 
                    [uml_u_id]
                );

                let rows = medias.rows;
                let result = [];
                for(let i = 0; i < rows.length; i++) {
                    let objectExist = result.find(tier => tier.tier_label == rows[i].tier_label) ? true : false;
                    let occ = {};

                    if(objectExist === false) {
                        occ = { tier_label: rows[i].tier_label, medias_of_tier: [
                                { media_id: rows[i].media_id, media_titre: rows[i].media_titre, media_description: rows[i].media_description, media_img: rows[i].media_img, tag_label: rows[i].tag_label, media_etat: rows[i].media_etat, categ_label: rows[i].categ_label, uml_tier_id: rows[i].uml_tier_id, uml_avancement : rows[i].uml_avancement }
                        ]};
                        result.push(occ);
                    } else {
                        occ = result.find(occ => occ.tier_label == rows[i].tier_label);
                        occ.medias_of_tier.push({ media_id: rows[i].media_id, media_titre: rows[i].media_titre, media_description: rows[i].media_description, media_img: rows[i].media_img, tag_label: rows[i].tag_label, media_etat: rows[i].media_etat, categ_label: rows[i].categ_label, uml_tier_id: rows[i].uml_tier_id, uml_avancement : rows[i].uml_avancement });
                    }
                }
                res.json(result);
            } catch (err) {
                console.error(err.messages);
            }
        });
    */

// get des médias d'un utilisateur pour un tier
const getAllMediaOfUserByTier = async (req, res) => {
    const {uml_u_id, tierLabel} = req.params;
    try {
        const medias = await pool.query(
            "SELECT media_id, media_titre, media_description, media_img, tag_label, media_etat, tier_label, uml_tier_id, uml_avancement, categ_label FROM media JOIN tag ON media_tag_id = tag_id JOIN categorie ON media_categ_id = categ_id JOIN utilisateur_media_list ON uml_media_id = media_id JOIN tier ON uml_tier_id = tier_id WHERE uml_u_id = $1 AND tier_label = $2 ORDER BY media_titre;", 
            [uml_u_id, tierLabel]
        );
        res.json(medias.rows);
    } catch (err) {
        console.error(err.messages);
    }
}

// get du nombre de médias d'un utilisateur pour un tier
const getNbMediaOfUserByTier = async (req, res) => {
    const {uml_u_id} = req.params;
    try {
        let results = [];

        const tiers = await pool.query("SELECT tier_label FROM tier;");

        for(let tier of tiers.rows) {
            const medias = await pool.query(
                "SELECT Count(*) as nb_media FROM media JOIN utilisateur_media_list ON uml_media_id = media_id JOIN tier ON uml_tier_id = tier_id WHERE uml_u_id = $1 AND tier_label = $2;", 
                [uml_u_id, tier.tier_label]
            );
            tier_label = tier.tier_label;
            nb_media = medias.rows[0].nb_media;

            result = {tier_label, nb_media};

            results.push(result);
        }
        res.json(results);
    } catch (err) {
        console.error(err.messages);
    }
}

// get le label du tier d'un media pour la liste d'un uesr
const getMediaOfUserByIdAndTier = async (req, res) => {
    const {uml_u_id, media_id, uml_tier_id} = req.params;
    try {
        const tierLabel = await pool.query(
            "SELECT media_id, media_titre, media_description, media_img, tag_label, media_etat, tier_label, uml_tier_id, uml_avancement, categ_label FROM media JOIN tag ON media_tag_id = tag_id JOIN categorie ON media_categ_id = categ_id JOIN utilisateur_media_list ON uml_media_id = media_id JOIN tier ON uml_tier_id = tier_id WHERE uml_u_id = $1 AND media.media_id = $2 AND uml_tier_id = $3;", 
            [uml_u_id, media_id, uml_tier_id]
        );
        res.json(tierLabel.rows[0]);
    } catch (err) {
        console.error(err.messages);
    }
}

// check si un média fait déjà parti de la liste de l'utilisateur courant en fonction de son id
const isMediaInUserList = async (req, res) => {
    const {uml_u_id, media_id} = req.params;
    try {
        const mediaFromUtilisateurList = await pool.query(
            "SELECT Count(*) FROM media JOIN utilisateur_media_list ON uml_media_id = media_id JOIN tier ON uml_tier_id = tier_id WHERE uml_u_id = $1 AND media_id = $2;",
            [uml_u_id, media_id]
        );
        res.json(mediaFromUtilisateurList.rows[0]);
    } catch (err) {
        console.error(err.messages);
    }
}

// post pour ajouter un média dans la liste d'un utilisateur + return de son id
const addMediaToList = async (req, res) => {
    try {
        const {uml_u_id, uml_media_id, uml_tier_id, uml_avancement} = req.body;
        const add_utilisateur_media_list = await pool.query(
            "INSERT INTO utilisateur_media_list (uml_u_id, uml_media_id, uml_tier_id, uml_avancement) VALUES ($1, $2, $3, $4) RETURNING uml_id;",
            [uml_u_id, uml_media_id, uml_tier_id, uml_avancement]
        );
        res.json(add_utilisateur_media_list.rows[0]);
    } catch (err) {
        console.error(err.messages);
    }
}

// update d'un média de la liste d'un utilisateur
const updateMediaOfList = async (req, res) => {
    try {
        const {uml_u_id, uml_media_id, uml_tier_id, uml_avancement} = req.body;
        const udt_utilisateur_media_list = await pool.query(
            "UPDATE utilisateur_media_list SET uml_tier_id = $3, uml_avancement = $4 WHERE uml_u_id = $1 AND uml_media_id = $2 RETURNING uml_id;",
            [uml_u_id, uml_media_id, uml_tier_id, uml_avancement]
        );
        res.json(udt_utilisateur_media_list.rows[0]);
    } catch (err) {
        console.error(err.messages);
    }
}

// delete d'un média de la liste de l'utilisateur
const deleteMediaOfList = async (req, res) => {
    const {uml_u_id, uml_media_id, uml_tier_id} = req.params;
    try {
        const media = await pool.query(
            "DELETE FROM utilisateur_media_list WHERE uml_u_id = $1 AND uml_media_id = $2 AND uml_tier_id = $3;", 
            [uml_u_id, uml_media_id, uml_tier_id]
        );
        res.json("media supprimé de la liste");
    } catch (err) {
        console.error(err.messages);
    }
}

// ----- MEDIA & UTILISATEUR_MEDIA_LIST ----- //

// post pour ajouter un média dans la liste d'un utilisateur + return de son id
const createMediaAndAddToList = async (req, res) => {
    try {
        const {media_titre, media_description, media_img, media_tag_id, media_etat, media_categ_id, user_id, uml_tier_id, uml_avancement} = req.body;
        const add_media_utilisateur_media_list = await pool.query(
            "SELECT mediaAndUtilisateurListAdd($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [media_titre, media_description, media_img, media_tag_id, media_etat, media_categ_id, user_id, uml_tier_id, uml_avancement]
        );
        res.json(add_media_utilisateur_media_list.rows[0]);
    } catch (err) {
        console.error(err.messages);
    }
}

module.exports = {
    getAllMedias,
    getAllMediasWithTitre,
    // getMediaById,
    createMedia,
    updateMedia,
    getAllMediaOfUserByTier,
    getNbMediaOfUserByTier,
    getMediaOfUserByIdAndTier,
    isMediaInUserList,
    addMediaToList,
    updateMediaOfList,
    deleteMediaOfList,
    createMediaAndAddToList
}
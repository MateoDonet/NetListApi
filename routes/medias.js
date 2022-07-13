const express = require('express');
const router = express.Router();
const mediasController = require('../controllers/mediasController');

router.route('/')
    .get((req, res) => {res.send("it work")});

// ----- MEDIA ----- //

router.route('/medias')
    .get(mediasController.getAllMedias);

router.route('/medias/titre/:media_titre')
    .get(mediasController.getAllMediasWithTitre);

router.route('/media')
    .post(mediasController.createMedia)
    .put(mediasController.updateMedia);

// router.route('/media/id/:media_id')
//     .get(mediasController.getMediaById);

// ----- UTILISATEUR_MEDIA_LIST ----- //

router.route('/mediasFromUtilisateurListByTier/:uml_u_id/:tierLabel')
    .get(mediasController.getAllMediaOfUserByTier);

router.route('/nbMediasFromUtilisateurListByTier/:uml_u_id')
    .get(mediasController.getNbMediaOfUserByTier);

router.route('/mediaFromUtilisateurListByIdAndTier/:uml_u_id/:media_id/:uml_tier_id')
    .get(mediasController.getMediaOfUserByIdAndTier);

router.route('/checkMediaIsIntoUtilisateurList/:uml_u_id/:media_id')
    .get(mediasController.isMediaInUserList);

router.route('/mediaIntoUtilisateurList')
    .post(mediasController.addMediaToList);

router.route('/updateMediaFromUtilisateurList')
    .put(mediasController.updateMediaOfList);

router.route('/mediaFromUtilisateurList/:uml_u_id/:uml_media_id/:uml_tier_id')
    .delete(mediasController.deleteMediaOfList);

router.route('/mediaIntoMediaAndUtilisateurList')
    .post(mediasController.createMediaAndAddToList);

module.exports = router;
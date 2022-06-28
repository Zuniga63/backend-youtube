const router = require('express').Router();
const formData = require('../middlewares/formData');
const { userAuth } = require('../middlewares/userAuth.middleware');
const {
  paginatedResults,
} = require('../middlewares/paginatedResults.middleware');
const videoController = require('../controllers/video.controller');
const Video = require('../models/video.model');

router.route('/').get(paginatedResults(Video), videoController.list);
router.route('/results').get(videoController.search);
router.route('/:videoId').get(videoController.show);

router.route('/').post(userAuth, formData, videoController.create);

router.route('/:videoId').put(userAuth, videoController.update);
router.route('/:videoId/view').post(videoController.views);
router.route('/:videoId').delete(userAuth, videoController.destroy);

module.exports = router;

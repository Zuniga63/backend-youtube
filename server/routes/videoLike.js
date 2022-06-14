const router = require('express').Router();
const videoLikeController = require('../controllers/videoLike.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');

router.route('/:videoId/new-like').post(userAuth, videoLikeController.create);
router
  .route('/:videoId/remove-like')
  .delete(userAuth, videoLikeController.destroy);

module.exports = router;

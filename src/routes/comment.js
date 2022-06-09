const router = require('express').Router();
const commentControllers = require('../controllers/comment.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');

router
  .route('/videos/:videoId/comments')
  .post(userAuth, commentControllers.create);
router
  .route('/videos/:videoId/comments/:commentId')
  .delete(userAuth, commentControllers.destroy);

module.exports = router;

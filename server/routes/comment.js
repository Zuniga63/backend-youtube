const router = require('express').Router();
const commentControllers = require('../controllers/comment.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');

//-----------------------------------------------------------------------------------
// METHODS GET
//-----------------------------------------------------------------------------------

router.route('/videos/:videoId/comments').get(commentControllers.videoComments);
router.route('/user/comments').get(userAuth, commentControllers.userComments);

//-----------------------------------------------------------------------------------
// METHODS POST
//-----------------------------------------------------------------------------------
router
  .route('/videos/:videoId/comments')
  .post(userAuth, commentControllers.create);

//-----------------------------------------------------------------------------------
// METHODS UPDATE
//-----------------------------------------------------------------------------------
router
  .route('/videos/:videoId/comments/:commentId')
  .put(userAuth, commentControllers.update);

//-----------------------------------------------------------------------------------
// METHODS DELETE
//-----------------------------------------------------------------------------------
router
  .route('/videos/:videoId/comments/:commentId')
  .delete(userAuth, commentControllers.destroy);

module.exports = router;

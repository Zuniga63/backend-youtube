const router = require('express').Router();
const formData = require('../middlewares/formData');
const { userAuth } = require('../middlewares/userAuth.middleware');
const userControllers = require('../controllers/user.controller');

// router.route('/').get(userControllers.list); pendiente si es necesario crear una de todos los usuarios
router.route('/profile').get(userAuth, userControllers.show);

router.route('/profile/edit').put(userAuth, userControllers.update);
router
  .route('/update-avatar')
  .put(formData, userAuth, userControllers.updateAvatar);
router.route('/remove-avatar').delete(userAuth, userControllers.removeAvatar);
router.route('/changepassword').put(userAuth, userControllers.changepassword);
router.route('/deleteuser').delete(userAuth, userControllers.destroy);
router
  .route('/recover-password')
  .put(userAuth, userControllers.recoverpassword);
router.route('/getemail').post(userControllers.getemail);

module.exports = router;

const router = require('express').Router();
const { userAuth } = require('../middlewares/userAuth.middleware');
const userControllers = require('../controllers/user.controller');

// router.route('/').get(userControllers.list); pendiente si es necesario crear una de todos los usuarios
router.route('/profile').get(userAuth, userControllers.show);

router.route('/edituser').put(userAuth, userControllers.update);
router.route('/changepassword').put(userAuth, userControllers.changepassword);
router.route('/deleteuser').delete(userAuth, userControllers.destroy);
router
  .route('/recover-password')
  .put(userAuth, userControllers.recoverpassword);
router.route('/getemail').post(userControllers.getemail);

module.exports = router;

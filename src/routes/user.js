const router = require('express').Router();
const { userAuth } = require('../middlewares/userAuth.middleware');
const userControllers = require('../controllers/user.controller');

// router.route('/').get(userControllers.list); pendiente si es necesario crear una de todos los usuarios
router.route('/profile').get(userAuth, userControllers.show);

router.route('/signup').post(userControllers.signup);
router.route('/signin').post(userControllers.signin);

router.route('/edituser').put(userAuth, userControllers.update);
router.route('/deleteuser').delete(userAuth, userControllers.destroy);

module.exports = router;

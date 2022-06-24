const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.route('/local/signup').post(authController.signup);
router.route('/local/login').post(authController.signin);

module.exports = router;

const router = require('express').Router();
const labelController = require('../controllers/label.controller');

router.route('/').get(labelController.list);
router.route('/').post(labelController.create);
router.route('/:slug').get(labelController.show);
router.route('/:slug').put(labelController.update);
router.route('/:slug').delete(labelController.destroy);

module.exports = router;

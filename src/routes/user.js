const router = require("express").Router();
const userControllers = require("../controllers/user.controller");

router.route("/").get(userControllers.list);
router.route("/:userId").get(userControllers.show);

router.route("/signup").post(userControllers.signup);
router.route("/signin").post(userControllers.signin);

router.route("/:userId").put(userControllers.update);
router.route("/:userId").delete(userControllers.destroy);

module.exports = router;

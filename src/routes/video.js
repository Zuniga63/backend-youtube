const router = require("express").Router();
const {userAuth} = require ("../middlewares/userAuth.middleware")
const videoController = require("../controllers/video.controller");

router.route("/").get(videoController.list);
router.route("/:videoId").get(videoController.show);

router.route("/" ).post(userAuth, videoController.create);

router.route("/:videoId").put(userAuth, videoController.update);
router.route("/:videoId").delete(userAuth, videoController.destroy);

module.exports = router;

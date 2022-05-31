const router = require("express").Router();
const commentControllers = require("../controllers/comment.controller");

router.route("/").get(commentControllers.list);
router.route("/:commentId").get(commentControllers.show);
router.route("/:userId").post(commentControllers.create);
router.route("/:commentId").put(commentControllers.update);
router.route("/:commentId").delete(commentControllers.destroy);

module.exports = router;

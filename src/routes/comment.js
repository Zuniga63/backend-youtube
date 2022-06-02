const router = require("express").Router();
const commentControllers = require("../controllers/comment.controller");

router.route("/").post(commentControllers.create);
router.route("/:commentId").delete(commentControllers.destroy);

module.exports = router;

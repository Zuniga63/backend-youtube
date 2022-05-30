const router = require("express").Router();
const comentControllers = require("../controllers/coment.controller");

router.route("/").get(comentControllers.list);
router.route("/:comentId").get(comentControllers.show);
router.route("/:userId").post(comentControllers.create);
router.route("/:comentId").put(comentControllers.update);
router.route("/:comentId").delete(comentControllers.destroy);

module.exports = router;

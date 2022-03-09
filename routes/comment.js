const router = require("express").Router();
const controller = require("../controllers/CommentController/comment.controller");
const verifyToken = require("../helper/verify.token");

router.route("/").post(verifyToken, controller.createComment);

router
  .route("/:id")
  .get(verifyToken, controller.getComments)
  .put(verifyToken, controller.updateComment)
  .delete(verifyToken, controller.deleteComment);

module.exports = router;

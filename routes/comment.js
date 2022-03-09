const router = require("express").Router();
const controller = require("../controllers/CommentController/comment.controller");
const verifyToken = require("../helper/verify.token");

router
  .route("/")
  .post(verifyToken, controller.createComment)
  .get(verifyToken, controller.getComments);
router
  .route("/:id")
  .put(verifyToken, controller.updateComment)
  .delete(verifyToken, controller.deleteComment);

module.exports = router;

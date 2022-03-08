const router = require("express").Route();
const controller = require("../controllers/CommentController/comment.controller");

router.post("/", controller.createComment);
router
  .route("/:id")
  .put(controller.updateComment)
  .delete(controller.deleteComment);

module.exports = router;

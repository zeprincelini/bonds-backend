const router = require("express").Router();
const controller = require("../controllers/PostController/post.controller");
const verifyToken = require("../helper/verify.token");

router.post("/", verifyToken, controller.createPost);

router.put("/:id", verifyToken, controller.updatePost);

router.delete("/:id", verifyToken, controller.deletePost);

router.put("/:id/like", verifyToken, controller.likePost);

router.get("/user/posts/:id", verifyToken, controller.getUserPosts);

router.get("/friends/posts/:id", verifyToken, controller.getFriendPosts);

router.get("/:id", verifyToken, controller.getPostbyId);

module.exports = router;

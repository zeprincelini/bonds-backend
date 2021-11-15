const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const controller = require("../controllers/PostController/post.controller");

router.post("/", controller.createPost);

router.put("/:id", controller.updatePost);

router.delete("/:id", controller.deletePost);

router.put("/:id/like", controller.likePost);

router.get("/user/posts/:id", controller.getUserPosts);

router.get("/friends/posts/:id", controller.getFriendPosts);

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { _id, updatedAt, ...rest } = post._doc;
    res.status("200").json({ status: "success", data: rest });
  } catch (err) {
    return res.status("403").json(err);
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find();
//     const { _id, userId, updatedAt, ...rest } = posts._doc;
//     res.status("200").json({ status: "success", data: rest });
//   } catch (err) {
//     return res.status("403").json(err);
//   }
// });

module.exports = router;

const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const controller = require("../controllers/PostController/post.controller");

router.post("/", controller.createPost);

router.put("/:id", controller.updatePost);

router.delete("/:id", controller.deletePost);

router.put("/:id/like", async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (post.userId === req.body.userId) {
    return res.status("401").json({ error: "you can't like your own post" });
  }
  if (post) {
    if (!post.likes.includes(req.body.userId)) {
      try {
        await post.updateOne({ $push: { likes: req.body.userId } });
        return res
          .status("200")
          .json({ status: "success", message: "Post liked successfully" });
      } catch (err) {
        res.status("401").json({ err });
      }
    } else {
      try {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        return res
          .status("200")
          .json({ status: "success", message: "Post disliked successfully" });
      } catch (err) {
        res.status("401").json({ err });
      }
    }
  }
  return res.status("401").json({ error: "post does not exist" });
});

router.get("/user/posts/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const userPosts = await Post.find({ userId: user._id });
    return res.status("200").json({ status: "success", data: userPosts });
  } catch (err) {
    return res.status("401").json(err);
  }
});

router.get("/friends/posts/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friendsPosts = await Promise.all(
      user.following.map((id) => {
        return Post.find({ userId: id });
      })
    );
    return res.status("200").json({ status: "success", data: friendsPosts });
  } catch (err) {
    return res.status("401").json(err);
  }
});

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

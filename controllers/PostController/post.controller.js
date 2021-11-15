const Post = require("../../models/post");
const User = require("../../models/user");

const createPost = async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (user) {
    try {
      const newPost = new Post(req.body);
      const post = await newPost.save();
      res.status("200").json({
        status: "success",
        message: "Post created Successfully",
        data: post,
      });
    } catch (err) {
      return res.status("403").json(err);
    }
  } else {
    return res.status("403").json({
      error: "error creating post for this account",
    });
  }
};

const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    try {
      await post.updateOne({ $set: req.body });
      return res
        .status("200")
        .json({ status: "success", message: "Post updated successfully" });
    } catch (err) {
      return res.status("403").json(err);
    }
  }
  return res.status("401").json({ error: "post not found" });
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    try {
      await post.deleteOne();
      return res
        .status("200")
        .json({ status: "success", message: "Post deleted successfully" });
    } catch (err) {
      return res.status("403").json(err);
    }
  }
  return res.status("401").json({ error: "post not found" });
};

module.exports = { createPost, updatePost, deletePost };

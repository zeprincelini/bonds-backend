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

const likePost = async (req, res) => {
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
};

const getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const userPosts = await Post.find({ userId: user._id });
    return res.status("200").json({ status: "success", data: userPosts });
  } catch (err) {
    return res.status("401").json(err);
  }
};

const getFriendPosts = async (req, res) => {
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
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getUserPosts,
  getFriendPosts,
};

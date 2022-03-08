const Post = require("../../models/post");
const User = require("../../models/user");

const createPost = async (req, res) => {
  const user = await User.findById(req.body.user);
  if (user) {
    try {
      const newPost = new Post({
        user: req.body.user,
        description: req.body.description,
        img: req.file.path ? req.file.path : null,
      });
      const post = await newPost.save();
      res.status("200").json({
        status: "success",
        message: "Post created Successfully",
        data: post,
      });
    } catch (err) {
      console.log(err);
      return res.status("403").json({
        error: "failed to create post",
      });
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
  if (!post) {
    return res.status(401).json({ error: "post does not exist" });
  }
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
    const userPosts = await Post.find({ user: user._id });
    return res.status("200").json({ status: "success", data: userPosts });
  } catch (err) {
    return res.status("401").json(err.message);
  }
};

const getFriendPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const usersPosts = await Post.find({ user: req.params.id }).populate(
      "user"
    );
    const friendsPosts = await Promise.all(
      user.following.map((id) => {
        return Post.find({ user: id }).populate("user");
      })
    );
    return res.status("200").json({
      status: "success",
      data: usersPosts.concat(friendsPosts.flat()),
    });
  } catch (err) {
    return res.status("401").json(err);
  }
};

const getPostbyId = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    const { updatedAt, ...rest } = post._doc;
    res.status("200").json({ status: "success", data: rest });
  } catch (err) {
    return res.status("403").json(err);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getUserPosts,
  getFriendPosts,
  getPostbyId,
};

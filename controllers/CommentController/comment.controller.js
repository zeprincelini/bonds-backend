const Comment = require("../../models/comment");
const User = require("../../models/user");
const Post = require("../../models/post");

const createComment = async (req, res) => {
  const { userId, postId, comment } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({ error: "post not found" });
    }
    if (comment !== null || comment !== "") {
      const newComment = new Comment({
        user: userId,
        post: postId,
        message: comment,
      });
      const data = await newComment.save();
      return res.status(200).json({
        status: "success",
        message: "comment posted successfully",
        data,
      });
    }
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

const updateComment = async (req, res) => {
  const { postId } = req.body;
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (comment.post === postId) {
      await comment.updateOne({ $set: req.body });
      return res
        .status(200)
        .json({ status: "success", message: "comment updated successfully" });
    }
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    await comment.deleteOne();
    return res
      .status(200)
      .json({ status: "success", message: "comment deleted successfully" });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};

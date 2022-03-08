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

module.exports = {
  createComment,
};

const mongoose = require("mongoose");
const User = require("./user");
const Post = require("./post");

const commentSchema = new mongoose.Schema(
  {
    user: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    post: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: Post,
    },
    message: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);

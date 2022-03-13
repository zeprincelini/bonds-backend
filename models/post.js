const mongoose = require("mongoose");
const User = require("./user");
const Comment = require("./comment");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Comment,
      },
    ],
    description: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

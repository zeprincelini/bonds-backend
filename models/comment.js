const mongoose = require("mongoose");
const User = require("./user");

const commentSchema = new mongoose.Schema(
  {
    user: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    // post: {
    //   required: true,
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: Post,
    // },
    post: {
      required: true,
      type: String,
    },
    message: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);

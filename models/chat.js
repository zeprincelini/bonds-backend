const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    // receiver: {
    //   type: String,
    //   required: true,
    // },
    message: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);

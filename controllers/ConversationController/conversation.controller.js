const Conversation = require("../../models/conversation");

const createConversation = async (req, res) => {
  const members = [req.body.senderId, req.body.receiverId];
  const newConversation = new Conversation({ members });
  try {
    await newConversation.save();
    return res.status(200).json({
      status: "success",
      message: "conversation created successfully",
    });
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
};

const getConversation = async (req, res) => {
  const userId = req.query.id;
  if (userId) {
    try {
      const conversation = await Conversation.find({
        members: { $in: [userId] },
      });
      return res.status(200).json({ status: "success", data: conversation });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(403).json({ error: "missing user id" });
  }
};

module.exports = {
  createConversation,
  getConversation,
};

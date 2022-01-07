const Chat = require("../../models/chat");

const createChat = async (req, res) => {
  const newChat = new Chat(req.body);
  try {
    const savedChat = await newChat.save();
    return res.status(200).json({
      status: "success",
      data: savedChat,
      message: "chat posted succesfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getChats = async (req, res) => {
  const id = req.paarams.id;
  try {
    const chats = await Chat.find({
      conversationId: id,
    });
    return res.status(200).json({ status: "success", data: chats });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createChat,
  getChats,
};

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((socket) => {
    return socket.socketId !== socketId;
  });
};

const getUser = (userId) => {
  const receiver = users.find((user) => user.userId === userId);
  return receiver;
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("allUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", {
      senderId,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("user left the chat");
    removeUser(socket.id);
    io.emit("allUsers", users);
  });
});

module.exports = io;

const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const io = require("./socket/socket");

const db = require("./db/db");
db();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const chatRoute = require("./routes/chats");
const commentRoute = require("./routes/comment");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
app.use(helmet());
// app.set("Access-Control-Allow-Origin", process.env.ORIGIN);
// app.set("Access-Control-Allow-Credentials", true);
// app.set("Access-Control-Allow-Methods", "GET, POST");
// app.set("Access-Control-Allow-Headers", "Content-Type, *");
// app.set("trust proxy", 1);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/conversation", conversationRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/comment", commentRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

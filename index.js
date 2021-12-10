const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const db = require("./db/db");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
db();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

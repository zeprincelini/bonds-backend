const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const router = express.Router();
const auth = require("../controllers/AuthController/auth.controller");

router.post("/register", auth.RegisterController);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status("400").json({
          error: "email/password incorrect",
        });
      }
      const token = jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.SECRET
      );
      res.status("200").json({
        status: "success",
        message: "Login successful",
        data: {
          username: user.username,
          isAdmin: user.isAdmin,
          accessToken: token,
        },
      });
    } else {
      res.status("404").json({ error: "user does not exist" });
    }
  } catch (err) {
    res.status("500").json(err);
  }
});

module.exports = router;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

const register = async (req, res) => {
  const { username, email, password, profilePicture, coverPhoto } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    if (!hash) {
      res.status("401").json({ error: "something went wrong" });
    }
    const newUser = new User({
      username,
      email,
      password: hash,
      profilePicture,
      coverPhoto,
    });
    const user = await newUser.save();
    if (!user) {
      res.status("401").json({ error: "Registration failed" });
    }
    res.status("200").json({
      status: "success",
      data: user,
      message: "Registration successful",
    });
  } catch (err) {
    res.status("500").json(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status("400").json({
          error: "email/password incorrect",
        });
      }
      const token = jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.SECRET
      );
      res
        .cookie("token", token, {
          expires: new Date(Date.now() + 86400 * 1000),
          secure: false,
          httpOnly: false,
        })
        .cookie("id", JSON.stringify(user._id), {
          expires: new Date(Date.now() + 172800 * 1000),
          secure: false,
          httpOnly: false,
        });
      return res.status("200").json({
        status: "success",
        message: "Login successful",
        data: {
          username: user.username,
          id: user._id,
          isAdmin: user.isAdmin,
          email: user.email,
          accessToken: token,
        },
      });
    } else {
      return res.status("404").json({ error: "user does not exist" });
    }
  } catch (err) {
    return res.status("500").json(err);
  }
};

module.exports = { register, login };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mailgunClient = require("../../helper/email/mailgun");
const User = require("../../models/user");
const resetTemplate = require("../../helper/email/resetPassword");

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
          path: "/",
          //domain: process.env.ORIGIN,
          expires: new Date(Date.now() + 172800 * 1000),
          secure: process.env.SECURE,
          httpOnly: true,
          sameSite: "none",
        })
        .cookie("id", JSON.stringify(user._id), {
          path: "/",
          //domain: process.env.ORIGIN,
          expires: new Date(Date.now() + 172800 * 1000),
          secure: process.env.SECURE,
          httpOnly: true,
          sameSite: "none",
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
    return res.status("500").json(err.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // const header = req.headers.authorization;
    // const token = header.split(" ")[1];
    // const verified = jwt.verify(token, process.env.SECRET);
    // if (!verified) {
    //   return res.status(403).json({ error: "bad token" });
    // }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "email does not exist",
      });
    } else {
      const mail_data = {
        from: process.env.MAIL_ADDRESS,
        to: email,
        subject: "Reset Password",
        html: resetTemplate(process.env.URL, user._id),
      };
      try {
        await mailgunClient.messages.create(
          process.env.MAILGUN_DOMAIN,
          mail_data
        );
        return res.status(200).json({
          status: "success",
          message: "email sent",
        });
      } catch (err) {
        return res.status(401).json({ error: err.message });
      }
    }
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id } = req.params;
  if (!(password === confirmPassword)) {
    return res.status(401).json({ error: "passwords must match" });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    if (!hash) {
      return res.status("401").json({ error: "something went wrong" });
    }
    await User.findByIdAndUpdate(id, {
      $set: { password: hash },
      new: true,
    });
    return res.status(200).json({
      status: "success",
      message: "password updated successfully",
    });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };

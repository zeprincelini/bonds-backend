const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const router = express.Router();

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (req.body.userId === id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status("500").json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(id, {
        $set: req.body,
      });
      res.status("200").json({
        status: "success",
        message: "Account updated successfully",
      });
    } catch (err) {
      return res.status("500").json(err);
    }
  } else {
    return res.status("500").json({ error: "invalid account details" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (user) {
    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (checkPassword) {
      try {
        await User.findByIdAndDelete(id);
        return res.status("200").json({
          status: "success",
          message: "Account Deleted Successfully",
        });
      } catch (err) {
        return res.status("403").json(err);
      }
    }
    return res.status("403").json({ error: "password incorrect" });
  } else {
    return res.status("403").json({ error: "invalid details" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, isAdmin, ...rest } = user._doc;
    return res.status("200").json({ status: "success", data: rest });
  } catch (err) {
    return res.status("404").json(err);
  }
});

router.put("/:id/follow", async (req, res) => {
  const id = req.params.id;
  if (req.body.userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(req.body.userId);
      if (!currentUser.following.includes(id)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: id } });
        return res
          .status("200")
          .json({ status: "success", message: "user followed successfully" });
      } else {
        return res.status("403").json("you already follow this user");
      }
    } catch (err) {
      return res.status("401").json("user does not exist");
    }
  } else {
    return res.status("403").json({ error: "cannot follow yourself" });
  }
});

router.put("/:id/unfollow", async (req, res) => {
  const id = req.params.id;
  if (req.body.userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.following.includes(id)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: id } });
        return res
          .status("200")
          .json({ status: "success", message: "user unfollowed successfully" });
      } else {
        return res.status("403").json("you don't follow this user");
      }
    } catch (err) {
      return res.status("401").json("user does not exist");
    }
  } else {
    return res.status("403").json({ error: "cannot unfollow yourself" });
  }
});

module.exports = router;

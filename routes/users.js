const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const router = express.Router();
const controller = require("../controllers/UserController/user.controller");

router.put("/:id", controller.updateAccount);

router.delete("/:id", controller.deleteAccount);

router.get("/:id", controller.getAccountById);

router.put("/:id/follow", controller.followAccount);

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

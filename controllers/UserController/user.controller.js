const bcrypt = require("bcrypt");
const User = require("../../models/user");

const updateAccount = async (req, res) => {
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
    if (req.body.tag) {
      const { tag } = req.body;
      const data = { ...req.body, [tag]: req.file.path };
      req.body = data;
    }
    try {
      await User.findByIdAndUpdate(id, {
        $set: req.body,
      });
      return res.status(200).json({
        status: "success",
        message: "Account updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(500).json({ error: "invalid account details" });
  }
};

const deleteAccount = async (req, res) => {
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
};

const getAccountById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, isAdmin, ...rest } = user._doc;
    return res.status("200").json({ status: "success", data: rest });
  } catch (err) {
    return res.status("404").json(err.message);
  }
};

const followAccount = async (req, res) => {
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
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: id } });
        return res
          .status("200")
          .json({ status: "success", message: "user unfollowed successfully" });
      }
    } catch (err) {
      return res.status("401").json("Error following user");
    }
  } else {
    return res.status("403").json({ error: "cannot follow yourself" });
  }
};

const getFriends = async (req, res) => {
  const id = req.params.id;
  let filter = {};
  if (req.query.search) {
    filter.username = req.query.search;
  }
  try {
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.following.map((id) => {
        return User.findById(id);
      })
    );
    let friendData = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendData.push({ _id, username, profilePicture });
    });
    // if (filter.username) {
    //   friendData = friendData.filter((user) => {
    //     return user.username === filter.username;
    //   });
    // }
    res.status(200).json({ status: "success", data: friendData });
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  try {
    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const totalCount = await User.count();
    return res.status(200).json({ data: users, total_count: totalCount });
  } catch (err) {
    return res.status(401).json(err.message);
  }
};

module.exports = {
  updateAccount,
  deleteAccount,
  getAccountById,
  followAccount,
  getAllUsers,
  getFriends,
};

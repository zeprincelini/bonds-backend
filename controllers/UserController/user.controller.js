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
    return res.status("404").json(err);
  }
};

module.exports = { updateAccount, deleteAccount, getAccountById };

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

module.exports = { updateAccount };

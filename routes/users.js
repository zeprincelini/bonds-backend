const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const router = express.Router();
const controller = require("../controllers/UserController/user.controller");

router.put("/:id", controller.updateAccount);

router.delete("/:id", controller.deleteAccount);

router.get("/:id", controller.getAccountById);

router.put("/:id/follow", controller.followAccount);

router.put("/:id/unfollow", controller.unfollowAccount);

module.exports = router;

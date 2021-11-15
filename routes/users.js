const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController/user.controller");
const verifyToken = require("../helper/verify.token");

router.put("/:id", verifyToken, controller.updateAccount);

router.delete("/:id", verifyToken, controller.deleteAccount);

router.get("/:id", verifyToken, controller.getAccountById);

router.put("/:id/follow", verifyToken, controller.followAccount);

router.put("/:id/unfollow", verifyToken, controller.unfollowAccount);

module.exports = router;

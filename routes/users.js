const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController/user.controller");
const verifyToken = require("../helper/verify.token");
const uploadFile = require("../helper/multer-cloudinary");

router.get("/accounts", verifyToken, controller.getAllUsers);
router.get("/friends/:id", verifyToken, controller.getFriends);
router.put("/:id", verifyToken, uploadFile, controller.updateAccount);

router.delete("/:id", verifyToken, controller.deleteAccount);

router.get("/:id", verifyToken, controller.getAccountById);

router.put("/:id/follow", verifyToken, controller.followAccount);

module.exports = router;

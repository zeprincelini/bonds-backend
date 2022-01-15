const router = require("express").Router();
const verifyToken = require("../helper/verify.token");
const controller = require("../controllers/ChatController/chat.controller");

router.post("/", verifyToken, controller.createChat);
router.get("/:id", verifyToken, controller.getChats);

module.exports = router;

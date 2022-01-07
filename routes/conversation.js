const router = require("express").Router();
const controller = require("../controllers/ConversationController/conversation.controller");
const verifyToken = require("../helper/verify.token");

router.post("/", verifyToken, controller.createConversation);
router.get("/", verifyToken, controller.getConversation);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/AuthController/auth.controller");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/forgot/password", controller.forgotPassword);

router.patch("/reset/password/:id", controller.resetPassword);

module.exports = router;

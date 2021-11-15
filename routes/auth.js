const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const router = express.Router();
const controller = require("../controllers/AuthController/auth.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;

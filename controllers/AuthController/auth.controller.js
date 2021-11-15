const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

const RegisterController = async (req, res) => {
  const { username, email, password, profilePicture, coverPhoto } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    if (!hash) {
      res.status("401").json({ error: "something went wrong" });
    }
    const newUser = new User({
      username,
      email,
      password: hash,
      profilePicture,
      coverPhoto,
    });
    const user = await newUser.save();
    if (!user) {
      res.status("401").json({ error: "Registration failed" });
    }
    res.status("200").json({
      status: "success",
      data: user,
      message: "Registration successful",
    });
  } catch (err) {
    res.status("500").json(err);
  }
};

module.exports = { RegisterController };

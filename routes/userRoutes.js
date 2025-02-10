const express = require("express");
const router = express.Router();
const User = require("../schema");

router.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        error: "Email address is already registered",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;

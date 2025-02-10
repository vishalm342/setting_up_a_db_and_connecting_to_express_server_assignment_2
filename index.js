require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./schema");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
  });

// POST endpoint to create a new user
app.post("/api/users", async (req, res) => {
  try {
    // Create new user from request body
    const user = new User(req.body);

    // Save user to database
    await user.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

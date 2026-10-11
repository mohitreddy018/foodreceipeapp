const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("./models/Recipe");
const RecipeSubmission = require("./models/RecipeSubmission");
const authRoutes = require("./auth/authRoutes");
const { verifyToken, adminOnly } = require("./authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(error => console.error("MongoDB connection failed:", error));

app.get("/", (req, res) => {
  res.json({ message: "Food Recipe API is running!" });
});

// Public recipe browsing
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recipes." });
  }
});

app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Invalid recipe ID." });
  }
});

// Admin: add a published recipe directly
app.post("/api/recipes", verifyToken, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({
      message: "Recipe added successfully!",
      recipe
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Could not add recipe."
    });
  }
});

// Admin: edit a published recipe
app.put("/api/recipes/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.json({ message: "Recipe updated successfully!", recipe });
  } catch (error) {
    res.status(400).json({ message: "Could not update recipe." });
  }
});

// Admin: delete a published recipe
app.delete("/api/recipes/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    res.json({ message: "Recipe deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Could not delete recipe." });
  }
});

// User: submit a recipe for review
app.post("/api/submissions", verifyToken, async (req, res) => {
  try {
    const {
      name, image, imageSource, category, cuisine, area,
      description, dietaryPreference, ingredients, instructions,
      cookingTime, serving, difficulty
    } = req.body;

    if (
      !name?.trim() ||
      !category ||
      !Array.isArray(ingredients) ||
      !ingredients.length ||
      !Array.isArray(instructions) ||
      !instructions.length
    ) {
      return res.status(400).json({
        message: "Name, category, ingredients and instructions are required."
      });
    }

    const submission = await RecipeSubmission.create({
      name, image, imageSource, category, cuisine, area, description,
      dietaryPreference, ingredients, instructions, cookingTime,
      serving, difficulty, submittedBy: req.user._id
    });

    res.status(201).json({
      message: "Recipe submitted successfully for admin review!",
      submission
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Could not submit recipe." });
  }
});

// Admin: view pending submissions
app.get(
  "/api/submissions",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const submissions = await RecipeSubmission.find({
        status: "pending"
      })
        .populate("submittedBy", "name email")
        .sort({ createdAt: -1 });

      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Could not load submissions." });
    }
  }
);

// Admin: approve a submission and publish it
app.patch(
  "/api/submissions/:id/approve",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const submission = await RecipeSubmission.findOne({
        _id: req.params.id,
        status: "pending"
      });

      if (!submission) {
        return res.status(404).json({
          message: "Pending submission not found."
        });
      }

      const recipeData = submission.toObject();
      delete recipeData._id;
      delete recipeData.__v;
      delete recipeData.submittedBy;
      delete recipeData.status;
      delete recipeData.createdAt;
      delete recipeData.updatedAt;

      const recipe = await Recipe.create(recipeData);
      submission.status = "approved";
      await submission.save();

      res.json({
        message: "Submission approved and published!",
        recipe
      });
    } catch (error) {
      console.error("Approval error:", error);
      res.status(500).json({ message: "Could not approve submission." });
    }
  }
);

// Admin: reject a submission
app.patch(
  "/api/submissions/:id/reject",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const submission = await RecipeSubmission.findOneAndUpdate(
        { _id: req.params.id, status: "pending" },
        { $set: { status: "rejected" } },
        { new: true }
      );

      if (!submission) {
        return res.status(404).json({
          message: "Pending submission not found."
        });
      }

      res.json({ message: "Submission rejected." });
    } catch (error) {
      res.status(400).json({ message: "Could not reject submission." });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
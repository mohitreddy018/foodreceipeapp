const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("./models/Recipe");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(error => console.error("MongoDB connection failed:", error));


// ================================
// HOME
// ================================

app.get("/", (req, res) => {
  res.json({
    message: "Food Recipe API is running!"
  });
});


// ================================
// GET ALL RECIPES
// ================================

app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.collection.find({}).toArray();

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);

    res.status(500).json({
      message: "Error fetching recipes",
      error: error.message
    });
  }
});


// ================================
// GET ONE RECIPE
// ================================

app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found"
      });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recipe",
      error: error.message
    });
  }
});


// ================================
// ADD NEW RECIPE
// ================================

app.post("/api/recipes", async (req, res) => {
  try {
    const {
      name,
      image,
      imageSource,
      category,
      cuisine,
      area,
      description,
      ingredients,
      instructions,
      rating,
      cookingTime,
      serving,
      difficulty
    } = req.body;

    if (!name || !category || !ingredients || !instructions) {
      return res.status(400).json({
        message:
          "Name, category, ingredients and instructions are required."
      });
    }

    const newRecipe = new Recipe({
      name,
      image: image || "",
      imageSource: imageSource || "",
      category,
      cuisine: cuisine || "",
      area: area || "",
      description: description || "",
      ingredients,
      instructions,
      rating: rating || 0,
      cookingTime: cookingTime || 0,
      serving: serving || 1,
      difficulty: difficulty || "Medium"
    });

    const savedRecipe = await newRecipe.save();

    res.status(201).json({
      message: "Recipe added successfully!",
      recipe: savedRecipe
    });

  } catch (error) {
    console.error("Error adding recipe:", error);

    res.status(500).json({
      message: "Error adding recipe",
      error: error.message
    });
  }
});


// ================================
// START SERVER
// ================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
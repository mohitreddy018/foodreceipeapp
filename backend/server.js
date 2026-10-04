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

app.get("/", (req, res) => {
  res.json({ message: "Food Recipe API is running!" });
});

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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
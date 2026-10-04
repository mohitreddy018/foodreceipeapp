const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  imageSource: {
    type: String
  },

  category: {
    type: String,
    required: true
  },

  cuisine: {
    type: String
  },

  area: {
    type: String
  },

  description: {
    type: String
  },

  ingredients: {
    type: [String]
  },

  // Each cooking instruction is stored as a separate step
  instructions: {
    type: [String]
  },

  rating: {
    type: Number
  },

  cookingTime: {
    type: Number
  },

  serving: {
    type: Number
  },

  difficulty: {
    type: String
  }
});

module.exports = mongoose.model("Recipe", recipeSchema);
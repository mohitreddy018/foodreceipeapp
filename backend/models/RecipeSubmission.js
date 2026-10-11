const mongoose = require("mongoose");

const recipeSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    imageSource: { type: String, default: "" },
    category: { type: String, required: true },
    cuisine: { type: String, default: "" },
    area: { type: String, default: "" },
    description: { type: String, default: "" },
    dietaryPreference: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian"],
      default: "Vegetarian"
    },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    rating: { type: Number, default: 0 },
    cookingTime: { type: Number, default: 0 },
    serving: { type: Number, default: 1 },
    difficulty: { type: String, default: "Medium" },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "RecipeSubmission",
  recipeSubmissionSchema
);
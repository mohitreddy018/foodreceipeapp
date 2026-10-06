const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("./models/Recipe");

const nonVegetarianRecipes = [
  "Chicken Chettinad",
  "Andhra Chicken Curry",

  "Butter Chicken",
  "Chicken Tikka Masala",
  "Tandoori Chicken",
  "Chicken Korma",
  "Rogan Josh",

  "Chicken Fried Rice",
  "Chicken Hakka Noodles",
  "Chilli Chicken",
  "Chicken Manchurian",
  "Dragon Chicken",
  "Kung Pao Chicken"
];

async function updateDietaryPreferences() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    // First mark every existing recipe as Vegetarian.
    await Recipe.updateMany(
      {},
      {
        $set: {
          dietaryPreference: "Vegetarian"
        }
      }
    );

    console.log(
      "All recipes temporarily set to Vegetarian."
    );

    // Now mark the known meat/chicken recipes as Non-Vegetarian.
    const result = await Recipe.updateMany(
      {
        name: {
          $in: nonVegetarianRecipes
        }
      },
      {
        $set: {
          dietaryPreference: "Non-Vegetarian"
        }
      }
    );

    console.log(
      `Non-Vegetarian recipes updated: ${result.modifiedCount}`
    );

    const vegetarianCount =
      await Recipe.countDocuments({
        dietaryPreference: "Vegetarian"
      });

    const nonVegetarianCount =
      await Recipe.countDocuments({
        dietaryPreference: "Non-Vegetarian"
      });

    const totalCount =
      await Recipe.countDocuments();

    console.log("");
    console.log("==============================");
    console.log("DIETARY UPDATE COMPLETED");
    console.log("==============================");
    console.log(
      `Total recipes: ${totalCount}`
    );
    console.log(
      `Vegetarian: ${vegetarianCount}`
    );
    console.log(
      `Non-Vegetarian: ${nonVegetarianCount}`
    );
    console.log("==============================");

    if (
      totalCount === 60 &&
      vegetarianCount === 47 &&
      nonVegetarianCount === 13
    ) {
      console.log(
        "✅ Dietary classification is correct!"
      );
    } else {
      console.log(
        "⚠️ Please check the counts above."
      );
    }

  } catch (error) {
    console.error(
      "Error updating dietary preferences:",
      error
    );
  } finally {
    await mongoose.disconnect();

    console.log("MongoDB disconnected.");
  }
}

updateDietaryPreferences();
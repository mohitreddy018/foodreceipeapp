# 🍴 Food Recipe App

A full-stack food recipe web application that helps users discover, search, save, share, rate, and submit cooking recipes.

## 📌 Project Overview

The Food Recipe App provides a simple and user-friendly platform for exploring recipes from different cuisines. Users can search recipes, filter them by category and dietary preference, view detailed cooking instructions, save favourite recipes, rate recipes, share recipes, and submit new recipes.

## ✨ Features

- 🍽️ Browse recipes
- 🔍 Search recipes by name, ingredients, and cuisine
- 🥘 Filter by South Indian, North Indian, and Chinese
- 🥬 Filter by dietary preference
- ❤️ Save favourite recipes
- ⭐ Rate recipes
- 🔗 Share recipes
- 👨‍🍳 Step-by-step cooking instructions
- 📝 Submit new recipes
- 🖼️ Recipe images
- 📱 Responsive user interface
- 💾 MongoDB database

## 🍛 Recipe Categories

The application contains recipes from:

- South Indian cuisine
- North Indian cuisine
- Chinese / Indo-Chinese cuisine

The project includes 60+ recipes with ingredients, cooking instructions, preparation details, cooking time, servings, difficulty, and other information.

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Development Tools
- Visual Studio Code
- Git
- GitHub
- MongoDB Compass

## 🏗️ Project Structure

```text
foodrecipeapp/
│
├── backend/
│   ├── models/
│   │   └── Recipe.js
│   ├── server.js
│   ├── seed.js
│   ├── updateDietary.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── recipeImages.js
│   │   ├── RecipeRating.jsx
│   │   └── SubmitRecipe.jsx
│   ├── public/
│   └── package.json
│
└── .gitignore
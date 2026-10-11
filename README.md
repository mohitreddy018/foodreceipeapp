# 🍽️ Food Recipe App

A full-stack web application that helps users discover, save, share, and submit recipes from South Indian, North Indian, and Chinese cuisines.

## 📌 Project Overview

The Food Recipe App provides a simple platform for browsing recipes, searching by ingredients and cuisine, viewing cooking instructions, and managing favorite dishes. Users can submit new recipes for review, while administrators can manage recipes and approve or reject submissions.

## ✨ Features

### User Module
- User signup, login, and logout
- Browse 60 existing recipes
- Search recipes by name, ingredients, and cuisine
- Filter by category and dietary preference
- View ingredients and step-by-step cooking instructions
- Save favorite recipes
- Rate and share recipes
- Submit recipes for admin review

### Admin Module
- Admin login
- Dashboard with recipe counts
- Add new recipes
- Edit and delete existing recipes
- View pending recipe submissions
- Approve or reject submitted recipes

## 🛠️ Technologies Used

- **Frontend:** React, JavaScript, HTML, CSS
- **Frontend Tool:** Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Version Control:** Git and GitHub

## 📁 Project Structure

```text
foodrecipeapp/
├── backend/
│   ├── auth/
│   ├── models/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── SubmitRecipe.jsx
│   │   ├── RecipeRating.jsx
│   │   └── App.css
│   └── package.json
├── .gitignore
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/mohitreddy018/foodrecipeapp.git
cd foodrecipeapp
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

Replace the example values with your own private configuration. Never upload `.env` to GitHub.

### 3. Start the backend

```bash
node server.js
```

The backend runs at `http://localhost:5000`.

### 4. Start the frontend

Open another terminal at the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🗄️ Database Setup

Configure MongoDB and use the project's seed script if the recipe data needs to be initialized. Run the seed script only after checking its behavior and confirming that it will not overwrite existing data.

## 🔐 Security

- Keep database credentials and JWT secrets private.
- Passwords are hashed before storage.
- Protected backend routes should verify JWT tokens and user roles.
- Public signup should not allow users to assign themselves the admin role.

## 👥 Project Modules

1. **User Module:** Recipe discovery, favorites, ratings, sharing, and recipe submissions.
2. **Admin Module:** Recipe management and submission approval.

## 🚀 Future Enhancements

- Deploy the frontend and backend to cloud hosting.
- Add persistent ratings and user-specific recipe collections.
- Improve recipe recommendations.
- Add recipe images and enhanced mobile responsiveness.

## 👨‍💻 Repository

[Food Recipe App on GitHub](https://github.com/mohitreddy018/foodrecipeapp)
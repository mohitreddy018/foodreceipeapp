import { useEffect, useMemo, useState } from "react";
import "./App.css";
import recipeImages from "./recipeImages";

const API_URL = "http://localhost:5000/api/recipes";

const categoryList = [
  "All",
  "South Indian",
  "North Indian",
  "Chinese",
];

function getRecipeId(recipe) {
  return recipe._id || recipe.id || recipe.name;
}

function getIngredients(recipe) {
  if (Array.isArray(recipe.ingredients)) {
    return recipe.ingredients;
  }

  if (typeof recipe.ingredients === "string") {
    return recipe.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getInstructions(recipe) {
  let instructions = [];

  if (Array.isArray(recipe.instructions)) {
    instructions = recipe.instructions;
  } else if (typeof recipe.instructions === "string") {
    instructions = recipe.instructions
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return instructions
    .map((item) =>
      String(item)
        .trim()
        // Remove "Step 1:", "Step 2 -" etc.
        .replace(/^Step\s*\d+\s*[:.)-]\s*/i, "")
        // Remove existing numbering such as "1.", "2)", "3 -"
        .replace(/^\d+\s*[\].):\-]\s*/, "")
        .trim()
    )
    .filter(Boolean);
}

function RecipeImage({ recipe, className = "" }) {
  const [imageError, setImageError] = useState(false);

  const image = recipeImages[recipe.name];

  return (
    <div className={`recipe-image-wrapper ${className}`}>
      {image && !imageError ? (
        <img
          src={image}
          alt={recipe.name}
          className="recipe-image"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="recipe-image-fallback">
          <span>🍽️</span>
          <p>{recipe.name}</p>
        </div>
      )}
    </div>
  );
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activePage, setActivePage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load recipes from backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          setRecipes([]);
        }
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(
          "Unable to load recipes. Please make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("foodRecipeFavorites");

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(
      "foodRecipeFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Close modal using Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedRecipe(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Prevent background scrolling when recipe modal is open
  useEffect(() => {
    if (selectedRecipe) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedRecipe]);

  const toggleFavorite = (recipe) => {
    const id = getRecipeId(recipe);

    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(id)) {
        return currentFavorites.filter(
          (favoriteId) => favoriteId !== id
        );
      }

      return [...currentFavorites, id];
    });
  };

  const isFavorite = (recipe) => {
    return favorites.includes(getRecipeId(recipe));
  };

  const openRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipe = () => {
    setSelectedRecipe(null);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleNavigation = (page) => {
    setActivePage(page);

    if (page === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    if (page === "recipes") {
      setSelectedCategory("All");

      setTimeout(() => {
        scrollToSection("recipes-section");
      }, 50);

      return;
    }

    if (page === "categories") {
      setSelectedCategory("All");

      setTimeout(() => {
        scrollToSection("categories-section");
      }, 50);

      return;
    }

    if (page === "favorites") {
      setSelectedCategory("All");

      setTimeout(() => {
        scrollToSection("recipes-section");
      }, 50);
    }
  };

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    // Favorites page
    if (activePage === "favorites") {
      result = result.filter((recipe) =>
        favorites.includes(getRecipeId(recipe))
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (recipe) =>
          String(recipe.category || "").toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // Search filter
    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((recipe) => {
        const name = String(recipe.name || "").toLowerCase();
        const category = String(recipe.category || "").toLowerCase();
        const cuisine = String(recipe.cuisine || "").toLowerCase();
        const area = String(recipe.area || "").toLowerCase();
        const description = String(
          recipe.description || ""
        ).toLowerCase();

        const ingredients = getIngredients(recipe)
          .join(" ")
          .toLowerCase();

        return (
          name.includes(search) ||
          category.includes(search) ||
          cuisine.includes(search) ||
          area.includes(search) ||
          description.includes(search) ||
          ingredients.includes(search)
        );
      });
    }

    return result;
  }, [
    recipes,
    searchTerm,
    selectedCategory,
    activePage,
    favorites,
  ]);

  const categoryCounts = useMemo(() => {
    return {
      "South Indian": recipes.filter(
        (recipe) =>
          String(recipe.category || "").toLowerCase() ===
          "south indian"
      ).length,

      "North Indian": recipes.filter(
        (recipe) =>
          String(recipe.category || "").toLowerCase() ===
          "north indian"
      ).length,

      Chinese: recipes.filter(
        (recipe) =>
          String(recipe.category || "").toLowerCase() ===
          "chinese"
      ).length,
    };
  }, [recipes]);

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="navbar-container">
          <button
            className="brand"
            onClick={() => handleNavigation("home")}
          >
            <span className="brand-icon">🍴</span>
            <span>Food Recipe</span>
          </button>

          <nav className="nav-links">
            <button
              className={activePage === "home" ? "active" : ""}
              onClick={() => handleNavigation("home")}
            >
              Home
            </button>

            <button
              className={activePage === "recipes" ? "active" : ""}
              onClick={() => handleNavigation("recipes")}
            >
              Recipes
            </button>

            <button
              className={activePage === "categories" ? "active" : ""}
              onClick={() => handleNavigation("categories")}
            >
              Categories
            </button>

            <button
              className={activePage === "favorites" ? "active" : ""}
              onClick={() => handleNavigation("favorites")}
            >
              Favorites
              {favorites.length > 0 && (
                <span className="favorite-count">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      {activePage === "home" && (
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">
                🍳 Discover • Cook • Enjoy
              </span>

              <h1>
                Delicious recipes,
                <br />
                <span>made simple.</span>
              </h1>

              <p>
                Discover delicious recipes from South India,
                North India and Chinese cuisine. Find your
                favorite dish and learn how to prepare it
                step-by-step.
              </p>

              <button
                className="hero-button"
                onClick={() => handleNavigation("recipes")}
              >
                Explore Recipes →
              </button>
            </div>

            <div className="hero-visual">
              <div className="hero-food-circle">
                <span>🍛</span>
              </div>

              <div className="floating-food floating-one">
                🥗
              </div>

              <div className="floating-food floating-two">
                🍜
              </div>

              <div className="floating-food floating-three">
                🥘
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= SEARCH ================= */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search recipes, ingredients or cuisine..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section
        id="categories-section"
        className="categories-section"
      >
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE</span>
              <h2>Browse by Category</h2>
            </div>
          </div>

          <div className="category-buttons">
            {categoryList.map((category) => {
              const count =
                category === "All"
                  ? recipes.length
                  : categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  className={`category-button ${
                    selectedCategory === category
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setActivePage("recipes");

                    setTimeout(() => {
                      scrollToSection("recipes-section");
                    }, 50);
                  }}
                >
                  <span>
                    {category === "All"
                      ? "🍽️"
                      : category === "South Indian"
                      ? "🥘"
                      : category === "North Indian"
                      ? "🍛"
                      : "🍜"}
                  </span>

                  <span>{category}</span>

                  <small>{count}</small>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= RECIPES ================= */}
      <section
        id="recipes-section"
        className="recipes-section"
      >
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-label">
                {activePage === "favorites"
                  ? "YOUR COLLECTION"
                  : "OUR RECIPES"}
              </span>

              <h2>
                {activePage === "favorites"
                  ? "Favorite Recipes"
                  : selectedCategory === "All"
                  ? "All Recipes"
                  : selectedCategory}
              </h2>
            </div>

            <div className="recipe-total">
              {filteredRecipes.length}{" "}
              {filteredRecipes.length === 1
                ? "recipe"
                : "recipes"}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="status-message">
              <div className="loading-spinner"></div>
              <p>Loading delicious recipes...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="status-message error-message">
              <div className="status-icon">⚠️</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No recipes */}
          {!loading &&
            !error &&
            filteredRecipes.length === 0 && (
              <div className="status-message">
                <div className="status-icon">🍽️</div>

                <h3>No recipes found</h3>

                <p>
                  {activePage === "favorites"
                    ? "You haven't added any recipes to your favorites yet."
                    : "Try another search or category."}
                </p>

                {activePage === "favorites" && (
                  <button
                    className="retry-button"
                    onClick={() =>
                      handleNavigation("recipes")
                    }
                  >
                    Explore Recipes
                  </button>
                )}
              </div>
            )}

          {/* Recipe cards */}
          {!loading &&
            !error &&
            filteredRecipes.length > 0 && (
              <div className="recipe-grid">
                {filteredRecipes.map((recipe) => {
                  const ingredients = getIngredients(recipe);

                  return (
                    <article
                      className="recipe-card"
                      key={getRecipeId(recipe)}
                    >
                      <div className="recipe-card-image">
                        <RecipeImage recipe={recipe} />

                        <button
                          className={`favorite-button ${
                            isFavorite(recipe)
                              ? "favorited"
                              : ""
                          }`}
                          onClick={() =>
                            toggleFavorite(recipe)
                          }
                          aria-label={
                            isFavorite(recipe)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {isFavorite(recipe) ? "♥" : "♡"}
                        </button>

                        {recipe.difficulty && (
                          <span className="difficulty-badge">
                            {recipe.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="recipe-card-content">
                        <div className="recipe-card-top">
                          <span className="recipe-category">
                            {recipe.category}
                          </span>

                          {recipe.rating && (
                            <span className="recipe-rating">
                              ⭐{" "}
                              {Number(recipe.rating).toFixed(
                                1
                              )}
                            </span>
                          )}
                        </div>

                        <h3>{recipe.name}</h3>

                        {recipe.area && (
                          <p className="recipe-area">
                            📍 {recipe.area}
                          </p>
                        )}

                        <p className="recipe-description">
                          {recipe.description ||
                            "A delicious recipe you can prepare at home."}
                        </p>

                        <div className="recipe-meta">
                          {recipe.cookingTime && (
                            <span>
                              ⏱️ {recipe.cookingTime} min
                            </span>
                          )}

                          {recipe.serving && (
                            <span>
                              👥 {recipe.serving}{" "}
                              {Number(recipe.serving) === 1
                                ? "serving"
                                : "servings"}
                            </span>
                          )}

                          {ingredients.length > 0 && (
                            <span>
                              🥕 {ingredients.length} ingredients
                            </span>
                          )}
                        </div>

                        <button
                          className="view-recipe-button"
                          onClick={() =>
                            openRecipe(recipe)
                          }
                        >
                          View Recipe
                          <span>→</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      {/* ================= RECIPE MODAL ================= */}
      {selectedRecipe && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeRecipe();
            }
          }}
        >
          <div className="recipe-modal">
            <button
              className="modal-close"
              onClick={closeRecipe}
              aria-label="Close recipe"
            >
              ✕
            </button>

            <div className="modal-image">
              <RecipeImage recipe={selectedRecipe} />
            </div>

            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <span className="recipe-category">
                    {selectedRecipe.category}
                  </span>

                  <h2>{selectedRecipe.name}</h2>

                  {selectedRecipe.area && (
                    <p className="recipe-area">
                      📍 {selectedRecipe.area}
                    </p>
                  )}
                </div>

                <button
                  className={`modal-favorite ${
                    isFavorite(selectedRecipe)
                      ? "favorited"
                      : ""
                  }`}
                  onClick={() =>
                    toggleFavorite(selectedRecipe)
                  }
                >
                  {isFavorite(selectedRecipe)
                    ? "♥ Saved"
                    : "♡ Save"}
                </button>
              </div>

              <div className="modal-stats">
                {selectedRecipe.rating && (
                  <div>
                    <strong>⭐</strong>
                    <span>
                      {Number(
                        selectedRecipe.rating
                      ).toFixed(1)}
                    </span>
                    <small>Rating</small>
                  </div>
                )}

                {selectedRecipe.cookingTime && (
                  <div>
                    <strong>⏱️</strong>
                    <span>
                      {selectedRecipe.cookingTime}
                    </span>
                    <small>Minutes</small>
                  </div>
                )}

                {selectedRecipe.serving && (
                  <div>
                    <strong>👥</strong>
                    <span>
                      {selectedRecipe.serving}
                    </span>
                    <small>Servings</small>
                  </div>
                )}

                {selectedRecipe.difficulty && (
                  <div>
                    <strong>📊</strong>
                    <span>
                      {selectedRecipe.difficulty}
                    </span>
                    <small>Difficulty</small>
                  </div>
                )}
              </div>

              {selectedRecipe.description && (
                <div className="modal-description">
                  <h3>About this Recipe</h3>
                  <p>{selectedRecipe.description}</p>
                </div>
              )}

              <div className="modal-section">
                <h3>
                  <span>🥕</span>
                  Ingredients
                </h3>

                <div className="ingredients-grid">
                  {getIngredients(selectedRecipe).map(
                    (ingredient, index) => (
                      <div
                        className="ingredient-item"
                        key={`${ingredient}-${index}`}
                      >
                        <span className="ingredient-check">
                          ✓
                        </span>

                        <span>{ingredient}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h3>
                  <span>👨‍🍳</span>
                  Making Process
                </h3>

                <div className="instructions-list">
                  {getInstructions(selectedRecipe).map(
                    (instruction, index) => (
                      <div
                        className="instruction-step"
                        key={`step-${index}`}
                      >
                        <div className="step-number">
                          {index + 1}
                        </div>

                        <div className="step-content">
                          <span className="step-title">
                            Step {index + 1}
                          </span>

                          <p>{instruction}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="modal-done-button"
                  onClick={closeRecipe}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-icon">🍴</span>
              <span>Food Recipe</span>
            </div>

            <p>
              Discover delicious recipes and make every
              meal special.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h4>Explore</h4>

              <button
                onClick={() =>
                  handleNavigation("recipes")
                }
              >
                Recipes
              </button>

              <button
                onClick={() =>
                  handleNavigation("categories")
                }
              >
                Categories
              </button>

              <button
                onClick={() =>
                  handleNavigation("favorites")
                }
              >
                Favorites
              </button>
            </div>

            <div>
              <h4>Categories</h4>

              <button
                onClick={() => {
                  setSelectedCategory("South Indian");
                  setActivePage("recipes");

                  setTimeout(() => {
                    scrollToSection("recipes-section");
                  }, 50);
                }}
              >
                South Indian
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("North Indian");
                  setActivePage("recipes");

                  setTimeout(() => {
                    scrollToSection("recipes-section");
                  }, 50);
                }}
              >
                North Indian
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("Chinese");
                  setActivePage("recipes");

                  setTimeout(() => {
                    scrollToSection("recipes-section");
                  }, 50);
                }}
              >
                Chinese
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Food Recipe App. Made with ❤️ for food
            lovers.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
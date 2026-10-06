import { useEffect, useMemo, useState } from "react";
import "./App.css";
import recipeImages from "./recipeImages";
import RecipeRating from "./RecipeRating";
import SubmitRecipe from "./SubmitRecipe";

const API_URL = "http://10.124.27.38:5173/api/recipes";

const categories = [
  ["All", "🍽️"],
  ["South Indian", "🥘"],
  ["North Indian", "🍛"],
  ["Chinese", "🍜"],
];

const dietaryOptions = [
  ["All", "🍽️"],
  ["Vegetarian", "🥬"],
  ["Non-Vegetarian", "🍗"],
];

const getId = recipe =>
  recipe._id || recipe.id || recipe.name;

const ingredients = recipe =>
  Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === "string"
    ? recipe.ingredients
        .split(",")
        .map(item => item.trim())
        .filter(Boolean)
    : [];

const instructions = recipe => {
  const list = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : typeof recipe.instructions === "string"
    ? recipe.instructions.split(/\n+/)
    : [];

  return list
    .map(item =>
      String(item)
        .trim()
        .replace(/^Step\s*\d+\s*[:.)-]\s*/i, "")
        .replace(/^\d+\s*[\].):\-]\s*/, "")
        .trim()
    )
    .filter(Boolean);
};

function RecipeImage({ recipe, className = "" }) {
  const [error, setError] = useState(false);

  const image =
    recipeImages[recipe.name] || recipe.image || "";

  return (
    <div
      className={`recipe-image-wrapper ${className}`}
    >
      {image && !error ? (
        <img
          src={image}
          alt={recipe.name}
          className="recipe-image"
          onError={() => setError(true)}
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [dietaryPreference, setDietaryPreference] =
    useState("All");

  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubmitRecipe, setShowSubmitRecipe] =
    useState(false);

  /* =====================================================
     LOAD RECIPES
  ===================================================== */

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }

        return res.json();
      })
      .then(data => {
        setRecipes(
          Array.isArray(data) ? data : []
        );
      })
      .catch(err => {
        console.error(err);

        setError(
          "Unable to load recipes. Please make sure the backend server is running."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* =====================================================
     LOAD FAVORITES
  ===================================================== */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "foodRecipeFavorites"
      );

      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "foodRecipeFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  /* =====================================================
     MODAL CONTROLS
  ===================================================== */

  useEffect(() => {
    const close = event => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    document.addEventListener("keydown", close);

    return () => {
      document.removeEventListener("keydown", close);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selected]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const navigate = pageName => {
    setPage(pageName);

    if (pageName === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (
      pageName === "recipes" ||
      pageName === "favorites"
    ) {
      setCategory("All");
      setDietaryPreference("All");

      setTimeout(() => {
        scrollTo("recipes-section");
      }, 50);
    }

    if (pageName === "categories") {
      setCategory("All");
      setDietaryPreference("All");

      setTimeout(() => {
        scrollTo("categories-section");
      }, 50);
    }
  };

  const chooseCategory = selectedCategory => {
    setCategory(selectedCategory);
    setPage("recipes");

    setTimeout(() => {
      scrollTo("recipes-section");
    }, 50);
  };

  const chooseDietaryPreference = preference => {
    setDietaryPreference(preference);
    setPage("recipes");

    setTimeout(() => {
      scrollTo("recipes-section");
    }, 50);
  };

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setCategory("All");
    setDietaryPreference("All");
  };

  /* =====================================================
     FAVORITES
  ===================================================== */

  const toggleFavorite = recipe => {
    const id = getId(recipe);

    setFavorites(oldFavorites =>
      oldFavorites.includes(id)
        ? oldFavorites.filter(item => item !== id)
        : [...oldFavorites, id]
    );
  };

  const isFavorite = recipe =>
    favorites.includes(getId(recipe));

  /* =====================================================
     SHARE
  ===================================================== */

  const shareRecipe = async recipe => {
    const text = `Check out this recipe: ${
      recipe.name
    }\n\n${recipe.description || ""}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.name,
          text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `${recipe.name}\n${
            recipe.description || ""
          }\n${window.location.href}`
        );

        alert("Recipe link copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(
            window.location.href
          );

          alert(
            "Recipe link copied to clipboard!"
          );
        } catch {
          alert("Unable to share this recipe.");
        }
      }
    }
  };

  /* =====================================================
     FILTER RECIPES
  ===================================================== */

  const filtered = useMemo(() => {
    let result = [...recipes];

    /* Favorites */

    if (page === "favorites") {
      result = result.filter(recipe =>
        favorites.includes(getId(recipe))
      );
    }

    /* Category */

    if (category !== "All") {
      result = result.filter(
        recipe =>
          String(recipe.category || "").toLowerCase() ===
          category.toLowerCase()
      );
    }

    /* Dietary preference */

    if (dietaryPreference !== "All") {
      result = result.filter(
        recipe =>
          String(
            recipe.dietaryPreference || ""
          ).toLowerCase() ===
          dietaryPreference.toLowerCase()
      );
    }

    /* Search */

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(recipe => {
        const searchableText = [
          recipe.name,
          recipe.category,
          recipe.cuisine,
          recipe.area,
          recipe.description,
          recipe.dietaryPreference,
          ...ingredients(recipe),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    return result;
  }, [
    recipes,
    search,
    category,
    dietaryPreference,
    page,
    favorites,
  ]);

  /* =====================================================
     CATEGORY COUNTS
  ===================================================== */

  const counts = useMemo(
    () =>
      Object.fromEntries(
        categories.map(([name]) => [
          name,
          name === "All"
            ? recipes.length
            : recipes.filter(
                recipe =>
                  String(recipe.category || "")
                    .toLowerCase() ===
                  name.toLowerCase()
              ).length,
        ])
      ),
    [recipes]
  );

  /* =====================================================
     DIETARY COUNTS
  ===================================================== */

  const dietaryCounts = useMemo(
    () =>
      Object.fromEntries(
        dietaryOptions.map(([option]) => [
          option,
          option === "All"
            ? recipes.length
            : recipes.filter(
                recipe =>
                  String(
                    recipe.dietaryPreference || ""
                  ).toLowerCase() ===
                  option.toLowerCase()
              ).length,
        ])
      ),
    [recipes]
  );

  /* =====================================================
     ACTIVE FILTER STATUS
  ===================================================== */

  const hasActiveFilters =
    category !== "All" ||
    dietaryPreference !== "All";

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="app">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">
        <div className="navbar-container">

          <button
            className="brand"
            onClick={() => navigate("home")}
          >
            <span className="brand-icon">
              🍴
            </span>

            <span>Food Recipe</span>
          </button>

          <nav className="nav-links">

            {[
              ["home", "Home"],
              ["recipes", "Recipes"],
              ["categories", "Categories"],
              ["favorites", "Favorites"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={
                  page === id ? "active" : ""
                }
                onClick={() => navigate(id)}
              >
                {label}

                {id === "favorites" &&
                  favorites.length > 0 && (
                    <span className="favorite-count">
                      {favorites.length}
                    </span>
                  )}
              </button>
            ))}

            <button
              className="submit-nav-button"
              onClick={() =>
                setShowSubmitRecipe(true)
              }
            >
              + Submit Recipe
            </button>

          </nav>

        </div>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      {page === "home" && (
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
                Discover delicious recipes from
                South India, North India and
                Chinese cuisine. Find your favorite
                dish and learn how to prepare it
                step-by-step.
              </p>

              <button
                className="hero-button"
                onClick={() =>
                  navigate("recipes")
                }
              >
                Explore Recipes →
              </button>

            </div>

            <div className="hero-visual">

              <div className="hero-food-circle">
                🍛
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

      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="search-section">

        <div className="search-container">

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              value={search}
              placeholder="Search recipes, ingredients or cuisine..."
              onChange={event =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <section
        id="categories-section"
        className="categories-section"
      >

        <div className="section-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                EXPLORE
              </span>

              <h2>
                Browse by Category
              </h2>
            </div>

          </div>

          <div className="category-buttons">

            {categories.map(
              ([name, icon]) => (
                <button
                  key={name}
                  className={`category-button ${
                    category === name
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    chooseCategory(name)
                  }
                >
                  <span>{icon}</span>

                  <span>{name}</span>

                  <small>
                    {counts[name] || 0}
                  </small>
                </button>
              )
            )}

          </div>

          {/* =============================================
              DIETARY FILTER
          ============================================= */}

          <div className="dietary-filter">

            <div className="dietary-filter-heading">

              <div>
                <span className="section-label">
                  PREFERENCE
                </span>

                <h3>
                  Choose Dietary Preference
                </h3>
              </div>

              <p>
                Find recipes that match your
                food preference.
              </p>

            </div>

            <div className="dietary-options">

              {dietaryOptions.map(
                ([option, icon]) => (
                  <button
                    key={option}
                    className={`dietary-option ${
                      dietaryPreference === option
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      chooseDietaryPreference(
                        option
                      )
                    }
                  >

                    <span className="dietary-option-icon">
                      {icon}
                    </span>

                    <span>
                      {option}
                    </span>

                    <small>
                      {dietaryCounts[option] ||
                        0}
                    </small>

                  </button>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          RECIPES
      ================================================= */}

      <section
        id="recipes-section"
        className="recipes-section"
      >

        <div className="section-container">

          <div className="section-heading">

            <div>

              <span className="section-label">
                {page === "favorites"
                  ? "YOUR COLLECTION"
                  : "OUR RECIPES"}
              </span>

              <h2>
                {page === "favorites"
                  ? "Favorite Recipes"
                  : category === "All"
                  ? "All Recipes"
                  : category}
              </h2>

            </div>

            <div className="recipe-total">
              {filtered.length}{" "}
              {filtered.length === 1
                ? "recipe"
                : "recipes"}
            </div>

          </div>

          {/* =============================================
              ACTIVE FILTERS
          ============================================= */}

          {hasActiveFilters && (
            <div className="active-filters">

              <div className="active-filters-left">

                <span className="active-filters-label">
                  Showing
                </span>

                {category !== "All" && (
                  <span className="active-filter-tag category-tag">
                    {category}
                  </span>
                )}

                {dietaryPreference !== "All" && (
                  <span
                    className={`active-filter-tag ${
                      dietaryPreference ===
                      "Vegetarian"
                        ? "vegetarian-filter-tag"
                        : "non-vegetarian-filter-tag"
                    }`}
                  >
                    {dietaryPreference ===
                    "Vegetarian"
                      ? "🥬 Vegetarian"
                      : "🍗 Non-Vegetarian"}
                  </span>
                )}

              </div>

              <button
                className="clear-filters-button"
                onClick={clearFilters}
              >
                <span>✕</span>
                Clear filters
              </button>

            </div>
          )}

          {/* =============================================
              LOADING
          ============================================= */}

          {loading && (
            <div className="status-message">

              <div className="loading-spinner" />

              <p>
                Loading delicious recipes...
              </p>

            </div>
          )}

          {/* =============================================
              ERROR
          ============================================= */}

          {!loading && error && (
            <div className="status-message error-message">

              <div className="status-icon">
                ⚠️
              </div>

              <h3>
                Something went wrong
              </h3>

              <p>{error}</p>

              <button
                className="retry-button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

            </div>
          )}

          {/* =============================================
              NO RESULTS
          ============================================= */}

          {!loading &&
            !error &&
            !filtered.length && (
              <div className="status-message">

                <div className="status-icon">
                  🍽️
                </div>

                <h3>
                  No recipes found
                </h3>

                <p>
                  {page === "favorites"
                    ? "You haven't added any recipes to your favorites yet."
                    : "Try another search, category or dietary preference."}
                </p>

                {hasActiveFilters && (
                  <button
                    className="retry-button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}

                {page === "favorites" && (
                  <button
                    className="retry-button"
                    onClick={() =>
                      navigate("recipes")
                    }
                  >
                    Explore Recipes
                  </button>
                )}

              </div>
            )}

          {/* =============================================
              RECIPE CARDS
          ============================================= */}

          {!loading &&
            !error &&
            filtered.length > 0 && (
              <div className="recipe-grid">

                {filtered.map(recipe => {

                  const list =
                    ingredients(recipe);

                  return (
                    <article
                      className="recipe-card"
                      key={getId(recipe)}
                    >

                      <div className="recipe-card-image">

                        <RecipeImage
                          recipe={recipe}
                        />

                        <button
                          className={`favorite-button ${
                            isFavorite(recipe)
                              ? "favorited"
                              : ""
                          }`}
                          onClick={() =>
                            toggleFavorite(
                              recipe
                            )
                          }
                          aria-label={
                            isFavorite(recipe)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {isFavorite(recipe)
                            ? "♥"
                            : "♡"}
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
                              {Number(
                                recipe.rating
                              ).toFixed(1)}
                            </span>
                          )}

                        </div>

                        <h3>
                          {recipe.name}
                        </h3>

                        <div className="recipe-tags">

                          {recipe.dietaryPreference && (
                            <span
                              className={`dietary-badge ${
                                recipe.dietaryPreference ===
                                "Vegetarian"
                                  ? "vegetarian"
                                  : "non-vegetarian"
                              }`}
                            >
                              {recipe.dietaryPreference ===
                              "Vegetarian"
                                ? "🥬 Vegetarian"
                                : "🍗 Non-Veg"}
                            </span>
                          )}

                        </div>

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
                              ⏱️{" "}
                              {recipe.cookingTime}{" "}
                              min
                            </span>
                          )}

                          {recipe.serving && (
                            <span>
                              👥{" "}
                              {recipe.serving}{" "}
                              {Number(
                                recipe.serving
                              ) === 1
                                ? "serving"
                                : "servings"}
                            </span>
                          )}

                          {list.length > 0 && (
                            <span>
                              🥕 {list.length}{" "}
                              ingredients
                            </span>
                          )}

                        </div>

                        <button
                          className="view-recipe-button"
                          onClick={() =>
                            setSelected(recipe)
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

      {/* =================================================
          RECIPE MODAL
      ================================================= */}

      {selected && (
        <div
          className="modal-overlay"
          onClick={event =>
            event.target === event.currentTarget &&
            setSelected(null)
          }
        >

          <div className="recipe-modal">

            <button
              className="modal-close"
              onClick={() =>
                setSelected(null)
              }
              aria-label="Close recipe"
            >
              ✕
            </button>

            <div className="modal-image">

              <RecipeImage
                recipe={selected}
              />

            </div>

            <div className="modal-content">

              {/* HEADER */}

              <div className="modal-header">

                <div>

                  <span className="recipe-category">
                    {selected.category}
                  </span>

                  <h2>
                    {selected.name}
                  </h2>

                  {selected.area && (
                    <p className="recipe-area">
                      📍 {selected.area}
                    </p>
                  )}

                  {selected.dietaryPreference && (
                    <span
                      className={`dietary-badge modal-dietary-badge ${
                        selected.dietaryPreference ===
                        "Vegetarian"
                          ? "vegetarian"
                          : "non-vegetarian"
                      }`}
                    >
                      {selected.dietaryPreference ===
                      "Vegetarian"
                        ? "🥬 Vegetarian"
                        : "🍗 Non-Vegetarian"}
                    </span>
                  )}

                </div>

                <div className="modal-actions">

                  {/* SAVE */}

                  <button
                    className={`modal-favorite ${
                      isFavorite(selected)
                        ? "favorited"
                        : ""
                    }`}
                    onClick={() =>
                      toggleFavorite(selected)
                    }
                  >
                    {isFavorite(selected)
                      ? "♥ Saved"
                      : "♡ Save"}
                  </button>

                  {/* SHARE */}

                  <button
                    className="modal-favorite"
                    onClick={() =>
                      shareRecipe(selected)
                    }
                  >
                    ↗ Share
                  </button>

                </div>

              </div>

              {/* STATS */}

              <div className="modal-stats">

                {[
                  [
                    "⭐",
                    selected.rating,
                    "Rating",
                  ],
                  [
                    "⏱️",
                    selected.cookingTime,
                    "Minutes",
                  ],
                  [
                    "👥",
                    selected.serving,
                    "Servings",
                  ],
                  [
                    "📊",
                    selected.difficulty,
                    "Difficulty",
                  ],
                ]
                  .filter(item => item[1])
                  .map(
                    ([
                      icon,
                      value,
                      label,
                    ]) => (
                      <div key={label}>

                        <strong>
                          {icon}
                        </strong>

                        <span>
                          {label ===
                          "Rating"
                            ? Number(
                                value
                              ).toFixed(1)
                            : value}
                        </span>

                        <small>
                          {label}
                        </small>

                      </div>
                    )
                  )}

              </div>

              {/* DESCRIPTION */}

              {selected.description && (
                <div className="modal-description">

                  <h3>
                    About this Recipe
                  </h3>

                  <p>
                    {selected.description}
                  </p>

                </div>
              )}

              {/* INGREDIENTS */}

              <div className="modal-section">

                <h3>
                  <span>🥕</span>
                  Ingredients
                </h3>

                <div className="ingredients-grid">

                  {ingredients(
                    selected
                  ).map((item, index) => (
                    <div
                      className="ingredient-item"
                      key={`${item}-${index}`}
                    >

                      <span className="ingredient-check">
                        ✓
                      </span>

                      <span>
                        {item}
                      </span>

                    </div>
                  ))}

                </div>

              </div>

              {/* MAKING PROCESS */}

              <div className="modal-section">

                <h3>
                  <span>👨‍🍳</span>
                  Making Process
                </h3>

                <div className="instructions-list">

                  {instructions(
                    selected
                  ).map((step, index) => (
                    <div
                      className="instruction-step"
                      key={index}
                    >

                      <div className="step-number">
                        {index + 1}
                      </div>

                      <div className="step-content">

                        <span className="step-title">
                          Step {index + 1}
                        </span>

                        <p>
                          {step}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

              {/* USER RATING */}

              <RecipeRating
                recipeId={getId(selected)}
              />

              {/* DONE */}

              <div className="modal-footer">

                <button
                  className="modal-done-button"
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  Done
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          SUBMIT RECIPE
      ================================================= */}

      {showSubmitRecipe && (
        <SubmitRecipe
          onClose={() =>
            setShowSubmitRecipe(false)
          }
          onRecipeAdded={recipe => {
            setRecipes(oldRecipes => [
              ...oldRecipes,
              recipe,
            ]);
          }}
        />
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="brand">

              <span className="brand-icon">
                🍴
              </span>

              <span>
                Food Recipe
              </span>

            </div>

            <p>
              Discover delicious recipes and
              make every meal special.
            </p>

          </div>

          <div className="footer-links">

            <div>

              <h4>Explore</h4>

              {[
                ["recipes", "Recipes"],
                ["categories", "Categories"],
                ["favorites", "Favorites"],
              ].map(
                ([id, label]) => (
                  <button
                    key={id}
                    onClick={() =>
                      navigate(id)
                    }
                  >
                    {label}
                  </button>
                )
              )}

            </div>

            <div>

              <h4>Categories</h4>

              {categories
                .slice(1)
                .map(([name]) => (
                  <button
                    key={name}
                    onClick={() =>
                      chooseCategory(name)
                    }
                  >
                    {name}
                  </button>
                ))}

            </div>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © 2026 Food Recipe App. Made with
            ❤️ for food lovers.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;
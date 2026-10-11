import { useState } from "react";

const API_URL = "http://localhost:5000/api/submissions";

function SubmitRecipe({ onClose, onRecipeAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "South Indian",
    cuisine: "",
    area: "",
    dietaryPreference: "Vegetarian",
    description: "",
    ingredients: "",
    instructions: "",
    cookingTime: "",
    serving: "",
    difficulty: "Medium",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.ingredients.trim() ||
      !form.instructions.trim()
    ) {
      setMessage("Please fill in the recipe name, ingredients and instructions.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          ...form,
          cookingTime: Number(form.cookingTime) || 0,
          serving: Number(form.serving) || 1,
          ingredients: form.ingredients
            .split("\n")
            .map(item => item.trim())
            .filter(Boolean),
          instructions: form.instructions
            .split("\n")
            .map(item => item.trim())
            .filter(Boolean)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit recipe.");
      }

      setMessage("Recipe submitted for admin review! 🎉");

      // The recipe is pending, so do not add it to the published list.
      if (onRecipeAdded) onRecipeAdded(null);

      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to submit recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-overlay">
      <div className="submit-container">
        <div className="submit-header">
          <div>
            <span className="submit-kicker">SHARE YOUR RECIPE</span>
            <h2>Submit a Recipe</h2>
            <p>Your recipe will be published after admin approval.</p>
          </div>
          <button className="submit-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="submit-section">
            <h3>🍽️ Basic Information</h3>
            <div className="submit-grid">
              <div className="submit-field full">
                <label>Recipe Name <span>*</span></label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Example: Andhra Paneer Curry" required />
              </div>

              <div className="submit-field">
                <label>Category <span>*</span></label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>South Indian</option>
                  <option>North Indian</option>
                  <option>Chinese</option>
                </select>
              </div>

              <div className="submit-field">
                <label>Cuisine</label>
                <input name="cuisine" value={form.cuisine} onChange={handleChange}
                  placeholder="Example: Indian" />
              </div>

              <div className="submit-field">
                <label>Region / Area</label>
                <input name="area" value={form.area} onChange={handleChange}
                  placeholder="Example: Andhra Pradesh" />
              </div>

              <div className="submit-field">
                <label>Dietary Preference</label>
                <select name="dietaryPreference" value={form.dietaryPreference}
                  onChange={handleChange}>
                  <option value="Vegetarian">🥬 Vegetarian</option>
                  <option value="Non-Vegetarian">🍗 Non-Vegetarian</option>
                </select>
              </div>

              <div className="submit-field">
                <label>Difficulty</label>
                <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div className="submit-field">
                <label>Cooking Time (minutes)</label>
                <input type="number" min="1" name="cookingTime"
                  value={form.cookingTime} onChange={handleChange} placeholder="30" />
              </div>

              <div className="submit-field">
                <label>Servings</label>
                <input type="number" min="1" name="serving"
                  value={form.serving} onChange={handleChange} placeholder="4" />
              </div>
            </div>
          </div>

          <div className="submit-section">
            <h3>📝 Description</h3>
            <textarea name="description" value={form.description}
              onChange={handleChange} placeholder="Tell us about this recipe..." rows="4" />
          </div>

          <div className="submit-section">
            <h3>🥕 Ingredients</h3>
            <p className="submit-help">Enter one ingredient per line.</p>
            <textarea name="ingredients" value={form.ingredients}
              onChange={handleChange} required
              placeholder={"2 cups rice\n1 onion\n2 tomatoes\n1 tablespoon oil"} rows="7" />
          </div>

          <div className="submit-section">
            <h3>👨‍🍳 Making Process</h3>
            <p className="submit-help">Enter each cooking step on a separate line.</p>
            <textarea name="instructions" value={form.instructions}
              onChange={handleChange} required
              placeholder={"Prepare the ingredients.\nHeat oil in a pan.\nAdd onions and cook until golden."}
              rows="8" />
          </div>

          <div className="submit-section">
            <h3>🖼️ Recipe Image</h3>
            <input type="url" name="image" value={form.image}
              onChange={handleChange} placeholder="Paste an image URL (optional)" />
            <p className="submit-help">Image URL is optional.</p>
          </div>

          {message && <div className="submit-message" role="status">{message}</div>}

          <div className="submit-actions">
            <button type="button" className="submit-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Submitting..." : "Submit for Review 🍴"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitRecipe;
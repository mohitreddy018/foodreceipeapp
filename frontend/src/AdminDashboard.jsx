import { useCallback, useEffect, useState } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api/recipes";
const SUBMISSIONS = "http://localhost:5000/api/submissions";

const emptyRecipe = {
  name: "",
  category: "South Indian",
  cuisine: "",
  area: "",
  description: "",
  image: "",
  ingredients: "",
  instructions: "",
  cookingTime: 30,
  serving: 2,
  difficulty: "Medium"
};

function AdminDashboard({ onBack }) {
  const [recipes, setRecipes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState(emptyRecipe);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`
  };

  const loadRecipes = useCallback(async () => {
    const response = await fetch(API);
    if (!response.ok) throw new Error("Could not load recipes.");
    setRecipes(await response.json());
  }, []);

  const loadSubmissions = useCallback(async () => {
    const response = await fetch(SUBMISSIONS, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not load submissions.");
    setSubmissions(data);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      await Promise.all([loadRecipes(), loadSubmissions()]);
    } catch (error) {
      setMessage(error.message);
    }
  }, [loadRecipes, loadSubmissions]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const changeField = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const editRecipe = recipe => {
    setEditingId(recipe._id);
    setForm({
      ...emptyRecipe,
      ...recipe,
      ingredients: Array.isArray(recipe.ingredients)
        ? recipe.ingredients.join("\n")
        : recipe.ingredients || "",
      instructions: Array.isArray(recipe.instructions)
        ? recipe.instructions.join("\n")
        : recipe.instructions || ""
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(emptyRecipe);
    setEditingId(null);
  };

  const saveRecipe = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      ...form,
      cookingTime: Number(form.cookingTime) || 0,
      serving: Number(form.serving) || 1,
      ingredients: form.ingredients.split("\n").map(x => x.trim()).filter(Boolean),
      instructions: form.instructions.split("\n").map(x => x.trim()).filter(Boolean)
    };

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers,
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Operation failed.");

      setMessage(data.message || "Recipe saved successfully!");
      resetForm();
      await loadRecipes();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async id => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed.");

      setMessage("Recipe deleted successfully!");
      if (editingId === id) resetForm();
      await loadRecipes();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const reviewSubmission = async (id, action) => {
    const label = action === "approve" ? "approve and publish" : "reject";
    if (!window.confirm(`Are you sure you want to ${label} this submission?`)) return;

    try {
      const response = await fetch(`${SUBMISSIONS}/${id}/${action}`, {
        method: "PATCH",
        headers
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Review failed.");

      setMessage(data.message);
      await refreshData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-label">ADMIN MODULE</p>
          <h1>Recipe Dashboard</h1>
          <p>Manage recipes and review user submissions.</p>
        </div>
        <button className="admin-back" onClick={onBack}>Back to Website</button>
      </header>

      <section className="admin-stats">
        {[
          ["Total Recipes", recipes.length],
          ["South Indian", recipes.filter(r => r.category === "South Indian").length],
          ["North Indian", recipes.filter(r => r.category === "North Indian").length],
          ["Chinese", recipes.filter(r => r.category === "Chinese").length]
        ].map(([label, count]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </section>

      {message && <p className="admin-message" role="status">{message}</p>}

      <section className="admin-panel">
        <h2>Pending Recipe Submissions ({submissions.length})</h2>
        {!submissions.length && <p>No pending submissions.</p>}

        <div className="admin-recipe-list">
          {submissions.map(item => (
            <article className="admin-recipe" key={item._id}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.category} · {item.dietaryPreference || "Not specified"}</span>
                <span>Submitted by: {item.submittedBy?.name || item.submittedBy?.email || "User"}</span>
                <p>{item.description}</p>
                <details>
                  <summary>View ingredients and instructions</summary>
                  <p><strong>Ingredients</strong></p>
                  <ul>
                    {(item.ingredients || []).map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                  <p><strong>Making Process</strong></p>
                  <ol>
                    {(item.instructions || []).map((x, i) => <li key={i}>{x}</li>)}
                  </ol>
                </details>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => reviewSubmission(item._id, "approve")}>
                  Approve
                </button>
                <button type="button" className="admin-delete"
                  onClick={() => reviewSubmission(item._id, "reject")}>
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <h2>{editingId ? "Edit Recipe" : "Add New Recipe"}</h2>

        <form className="admin-form" onSubmit={saveRecipe}>
          <label>
            Recipe Name *
            <input name="name" value={form.name} onChange={changeField} required />
          </label>

          <label>
            Category *
            <select name="category" value={form.category} onChange={changeField}>
              <option>South Indian</option>
              <option>North Indian</option>
              <option>Chinese</option>
            </select>
          </label>

          <label>
            Cuisine
            <input name="cuisine" value={form.cuisine} onChange={changeField} />
          </label>

          <label>
            Region
            <input name="area" value={form.area} onChange={changeField} />
          </label>

          <label className="admin-wide">
            Image URL
            <input type="url" name="image" value={form.image} onChange={changeField} />
          </label>

          <label className="admin-wide">
            Description
            <textarea name="description" value={form.description} onChange={changeField} rows="2" />
          </label>

          <label>
            Cooking Time (minutes)
            <input type="number" min="0" name="cookingTime" value={form.cookingTime} onChange={changeField} />
          </label>

          <label>
            Servings
            <input type="number" min="1" name="serving" value={form.serving} onChange={changeField} />
          </label>

          <label>
            Difficulty
            <select name="difficulty" value={form.difficulty} onChange={changeField}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>

          <label className="admin-wide">
            Ingredients * (one per line)
            <textarea name="ingredients" value={form.ingredients} onChange={changeField} rows="5" required />
          </label>

          <label className="admin-wide">
            Instructions * (one step per line)
            <textarea name="instructions" value={form.instructions} onChange={changeField} rows="6" required />
          </label>

          <div className="admin-actions admin-wide">
            <button disabled={loading} type="submit">
              {loading ? "Saving..." : editingId ? "Update Recipe" : "Add Recipe"}
            </button>
            {editingId && (
              <button type="button" className="admin-cancel" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <h2>Manage Existing Recipes ({recipes.length})</h2>
        <div className="admin-recipe-list">
          {recipes.map(recipe => (
            <article className="admin-recipe" key={recipe._id}>
              <div>
                <strong>{recipe.name}</strong>
                <span>{recipe.category}</span>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => editRecipe(recipe)}>Edit</button>
                <button type="button" className="admin-delete"
                  onClick={() => deleteRecipe(recipe._id)}>Delete</button>
              </div>
            </article>
          ))}
          {!recipes.length && <p>No recipes found.</p>}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
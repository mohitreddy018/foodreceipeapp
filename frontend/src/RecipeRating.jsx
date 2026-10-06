import { useEffect, useState } from "react";

function RecipeRating({ recipeId }) {
  const storageKey = `recipeRating_${recipeId}`;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setRating(Number(saved));
  }, [storageKey]);

  const selectRating = value => {
    setRating(value);
    localStorage.setItem(storageKey, value);
  };

  return (
    <div className="user-rating">
      <div className="user-rating-heading">
        <h3>⭐ Rate this Recipe</h3>
        <p>How much did you like this recipe?</p>
      </div>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            className={
              star <= (hover || rating) ? "star active" : "star"
            }
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => selectRating(star)}
            aria-label={`Rate ${star} out of 5`}
          >
            ★
          </button>
        ))}
      </div>

      {rating > 0 && (
        <p className="rating-message">
          You rated this recipe <strong>{rating}/5</strong> ⭐
        </p>
      )}
    </div>
  );
}

export default RecipeRating;
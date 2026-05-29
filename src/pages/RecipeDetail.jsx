import React from "react";
import { FcCalendar } from "react-icons/fc";

const RecipeDetail = ({ recipe, onClose }) => {
  return (
    <div className="modal" onClick={onClose}>
      <div className="recipe-detail" onClick={(e) => e.stopPropagation()}>
        {/* close button */}
        <button onClick={onClose} className="btn btn-danger position">
          &times;
        </button>

        {/* recipe image */}
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="recipe-detail-image"
          />
        )}

        {/* Header info */}
        <div className="recipe-detail-header">
          <h2>{recipe.title}</h2>
          <div className="recipe-meta">
            <span>⏱️ {recipe.duration}</span>
            <span>🍽️ {recipe.servings} servings</span>
            <span className="recipe-date">
              <FcCalendar /> {new Date(recipe.createdAt).toDateString()}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="recipe-section">
          <p>{recipe.description}</p>
        </div>

        {/* categories */}
        {recipe.Categories && recipe.Categories.length > 0 && (
          <div className="recipe-section">
            <h3>Categories</h3>
            <div className="recipe-categories-display">
              {recipe.Categories.map((cat) => (
                <span key={cat.categoryId} className="category-tag-display">
                  {cat.categoryName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients */}
        <div className="recipe-section">
          <h3>Ingredients</h3>
          <div className="recipe-content">{recipe.ingredients}</div>
        </div>

        {/* Instructions */}
        <div className="recipe-section">
          <h3>Instructions</h3>
          <div
            className="recipe-content"
            dangerouslySetInnerHTML={{ __html: recipe.instructions }}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

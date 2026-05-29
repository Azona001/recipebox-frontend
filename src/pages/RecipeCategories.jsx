import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Loading from "../components/Loading";

const RecipeCategories = ({ recipe, allCategories, onCategoryChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const assignedCategories = recipe.Categories || [];

  // Categories not yet assigned to this recipe
  const availableCategories = allCategories.filter(
    (cat) =>
      !assignedCategories.find(
        (assigned) => assigned.categoryId === cat.categoryId,
      ),
  );

  const handleAddCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/recipes/${recipe.recipeId}/categories`,
        { categoryId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onCategoryChange(); // Refresh recipes in parent
      setShowDropdown(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/recipes/${recipe.recipeId}/categories/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onCategoryChange(); // Refresh recipes in parent
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="recipe-categories">
      {/* Display assigned categories */}
      <div className="assigned-categories">
        {assignedCategories.map((cat) => (
          <span key={cat.categoryId} className="category-tag">
            {cat.categoryName}
            <button
              onClick={() => handleRemoveCategory(cat.categoryId)}
              className="remove-category"
            >
              ×
            </button>
          </span>
        ))}

        {/* Add category button */}
        {availableCategories.length > 0 && (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="add-category-btn"
          >
            + Add
          </button>
        )}
      </div>

      {/* Dropdown to select category */}
      {showDropdown && (
        <div className="category-dropdown">
          {isLoading ? (
            <Loading />
          ) : (
            availableCategories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => handleAddCategory(cat.categoryId)}
                className="category-option"
              >
                {cat.categoryName}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeCategories;

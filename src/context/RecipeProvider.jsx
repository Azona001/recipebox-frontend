import React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [userPlan, setUserPlan] = useState("free");
  const [recentlyUpdated, setRecentlyUpdated] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRecipes([]);

    const token = await getAccessTokenSilently();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/recipes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRecipes(response.data.recipes);
      setUserPlan(response.data.userPlan);
    } catch (error) {
      if (error.response) console.log(error.response.data);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessTokenSilently]);

  const handleRecipeCreated = (newRecipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
  };

  const handleDelete = async (id) => {
    setDeleteError(null);
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes((prev) => prev.filter((recipe) => recipe.recipeId !== id));
    } catch (error) {
      if (error.response) console.log(error.response.data);
      setDeleteError(error.message);
    }
  };

  const handleUpdate = (id, updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((recipe) => (recipe.recipeId === id ? updatedRecipe : recipe)),
    );
    setRecentlyUpdated(id);
    setTimeout(() => setRecentlyUpdated(null), 3000);
  };

  const handleCategoryChange = async () => {
    const token = await getAccessTokenSilently();
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/recipes`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setRecipes(response.data.recipes);
  };

  const value = {
    recipes,
    isLoading,
    error,
    deleteError,
    userPlan,
    recentlyUpdated,
    fetchRecipes,
    handleRecipeCreated,
    handleDelete,
    handleUpdate,
    handleCategoryChange,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);

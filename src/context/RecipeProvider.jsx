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
  const [userPlan, setUserPlan] = useState(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const fetchRecipes = useCallback(
    async (pageNum = 1) => {
      if (!isAuthenticated) return;

      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      setError(null);

      const token = await getAccessTokenSilently();
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/recipes?page=${pageNum}&limit=3`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setRecipes((prev) =>
          pageNum === 1
            ? response.data.recipes
            : [...prev, ...response.data.recipes],
        );
        setUserPlan(response.data.userPlan);
        setHasMore(response.data.hasMore);
        setPage(pageNum);
      } catch (error) {
        if (error.response) console.log(error.response.data);
        setError(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [getAccessTokenSilently, isAuthenticated],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) fetchRecipes(page + 1);
  }, [fetchRecipes, isLoading, hasMore, page]);

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

  const handleCategoryChange = useCallback(async () => {
    await fetchRecipes();
  }, [fetchRecipes]);

  const value = {
    recipes,
    isLoading,
    error,
    deleteError,
    userPlan,
    recentlyUpdated,
    hasMore,
    isFetchingMore,
    fetchRecipes,
    loadMore,
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

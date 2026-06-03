import React from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";

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
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search);
  const isFirstRender = useRef(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const fetchRecipes = useCallback(
    async (
      pageNum = 1,
      searchQuery = debounceSearch,
      favOnly = favoritesOnly,
    ) => {
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
          `${process.env.REACT_APP_API_URL}/api/recipes?page=${pageNum}&limit=3&search=${searchQuery}&favorites=${favOnly}`,
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
    [getAccessTokenSilently, isAuthenticated, debounceSearch, favoritesOnly],
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

  const handleSearch = (query) => {
    setSearch(query);
  };

  const toggleFavFilter = useCallback(() => {
    const newValue = !favoritesOnly;
    setFavoritesOnly(newValue);
    fetchRecipes(1, debounceSearch, newValue);
  }, [favoritesOnly, fetchRecipes, debounceSearch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const trigger = async () => {
      await fetchRecipes(1, debounceSearch);
    };
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch]);

  const value = {
    recipes,
    isLoading,
    error,
    deleteError,
    userPlan,
    recentlyUpdated,
    hasMore,
    isFetchingMore,
    search,
    favoritesOnly,
    fetchRecipes,
    loadMore,
    handleRecipeCreated,
    handleDelete,
    handleUpdate,
    handleCategoryChange,
    handleSearch,
    toggleFavFilter,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);

import React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "dotenv/config";

const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [deleteError, setDeleteError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const handleDelete = async (id) => {
    setDeleteError(null);
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCategories((prev) =>
        prev.filter((category) => category.categoryId !== id),
      );
    } catch (error) {
      if (error.response) console.log(error.response.data);
      setDeleteError(error.message);
    }
  };

  const handleCreate = (createdCategory) => {
    setCategories((prev) => [...prev, createdCategory]);
  };

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCategories([]);

    const token = await getAccessTokenSilently();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = response.data;
      setCategories(data.categories);
    } catch (error) {
      if (error.response) console.log(error.response.data);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessTokenSilently]);

  const value = {
    categories,
    isLoading,
    error,
    handleCreate,
    handleDelete,
    deleteError,
    fetchCategories,
  };
  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;

export const useCategory = () => useContext(CategoryContext);

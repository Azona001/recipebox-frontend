import { useEffect } from "react";
import React from "react";
import AddCategory from "./AddCategory";
import { useCategory } from "../context/CategoryProvider";
import Loading from "../components/Loading";
import { useAuth0 } from "@auth0/auth0-react";

const Category = () => {
  const {
    categories,
    isLoading,
    error,
    handleCreate,
    handleDelete,
    deleteError,
    fetchCategories,
  } = useCategory();

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) fetchCategories();
  }, [fetchCategories, isAuthenticated]);

  return (
    <>
      <section className="section-category">
        <h2>Categories</h2>
        <div className="category-list">
          {isLoading ? (
            <p>
              <Loading />
            </p>
          ) : error ? (
            <p>{error}</p>
          ) : (categories ?? []).length === 0 ? (
            <p>No added categories...</p>
          ) : (
            <>
              {deleteError && <p className="message-error">{deleteError}</p>}
              <ul className="category">
                {categories.map((category) => (
                  <li key={category.categoryId}>
                    <span className="category-items">
                      <span>{category.categoryName}</span>
                      <button
                        className="btn-c"
                        onClick={() => handleDelete(category.categoryId)}
                      >
                        &times;
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="category-add">
          <AddCategory onCreated={handleCreate} />
        </div>
      </section>
    </>
  );
};

export default Category;

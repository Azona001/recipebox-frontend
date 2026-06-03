import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CreateRecipe from "./CreateRecipe";
import EditRecipe from "./EditRecipe";
import Category from "./Category";
import UpgradeToPro from "./UpgradeToPro";
import RecipeCategories from "./RecipeCategories";
import { useCategory } from "../context/CategoryProvider";
import { useRecipe } from "../context/RecipeProvider";
import RecipeDetail from "./RecipeDetail";
import Loading from "../components/Loading";
import { useTheme } from "../context/ThemeProvider";
import { WiDaySunny } from "react-icons/wi";
import { WiMoonWaningCrescent3 } from "react-icons/wi";
import RecipeSkeleton from "../components/RecipeSkeleton";
import Favorite from "../components/Favorite";
import { IoHeartSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineSoupKitchen } from "react-icons/md";

const Dashboard = () => {
  const {
    user,
    logout: auth0Logout,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth0();

  const [visible, setVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const [viewingRecipe, setViewingRecipe] = useState(null);
  const sentinelRef = useRef(null);

  const { categories } = useCategory();

  const {
    recipes,
    isLoading,
    error,
    deleteError,
    userPlan,
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
  } = useRecipe();
  const { theme, toggleTheme } = useTheme();

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  const handleVisible = () => {
    setVisible(true);
  };

  const handleHide = (visible) => {
    if (visible) setVisible(false);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  const handleCloseEdit = () => {
    setEditingRecipe(null);
  };

  const handleViewRecipe = (recipe) => {
    setViewingRecipe(recipe);
  };

  const handleCloseView = () => {
    setViewingRecipe(null);
  };

  useEffect(() => {
    if (isAuthenticated && user) fetchRecipes();
  }, [fetchRecipes, isAuthenticated, user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, loadMore]);

  const userPlanStyling =
    userPlan === "pro" && theme === "light"
      ? { color: "#6a510a" }
      : theme === "dark"
        ? { color: "#FFD700" }
        : { color: "#111827" };

  if (authLoading || !isAuthenticated || !user) return <Loading />;
  return (
    <>
      <header className="header">
        <div className="header-title">
          <h1>RecipeBox</h1>
          <p>Personal Recipe Collection</p>
        </div>
        <div className="right">
          Welcome, <span className="user">{user.name} </span>
          <span> </span>
          <p style={userPlanStyling}>
            {userPlan ? userPlan[0].toUpperCase() + userPlan.slice(1) : "Free"}
          </p>
        </div>
        <nav className="nav">
          <ul className="nav-items">
            <li>
              <button className="btn btn-primary" onClick={handleVisible}>
                New Recipe +
              </button>
            </li>
            <li>
              {" "}
              <button type="button" className="btn btn-small" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>

          <button
            onClick={toggleTheme}
            type="button"
            className={`btn-theme ${theme === "dark" ? "dark" : ""}`}
          >
            {theme === "dark" ? (
              <WiMoonWaningCrescent3 style={{ color: "yellow" }} />
            ) : (
              <WiDaySunny />
            )}
          </button>
        </nav>
      </header>
      <main className="main">
        <section>
          <div className="menu">
            <div className="search">
              <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <button
              className={`btn ${favoritesOnly ? "btn-primary" : "btn-small"}`}
              onClick={toggleFavFilter}
            >
              <IoHeartSharp /> {favoritesOnly ? "All Recipes" : "Favourites"}
            </button>
          </div>

          {isLoading ? (
            <ul className="grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <RecipeSkeleton key={i} />
              ))}
            </ul>
          ) : error ? (
            <span className="message-error">{error}</span>
          ) : (recipes ?? []).length === 0 && !isLoading ? (
            <p>No recipes added yet!</p>
          ) : (
            <>
              {deleteError && <p className="message-error">{deleteError}</p>}

              <ul className="grid">
                {recipes.map((recipe) => (
                  <li className="card" key={recipe.recipeId}>
                    <Favorite recipe={recipe} />
                    <div
                      className="card-details"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      {recipe.imageUrl && (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="recipe-image"
                        />
                      )}
                      <h3 className="title">{recipe.title}</h3>
                      <div className="duration-serving">
                        <span>
                          <FaRegClock /> {recipe.duration}{" "}
                          {recipe.duration > 1 ? "mins" : "min"}
                        </span>
                        <span> • </span>
                        <span>
                          <MdOutlineSoupKitchen /> {recipe.servings}{" "}
                          {recipe.servings > 1 ? "servings" : "serving"}
                        </span>
                      </div>
                      <p>{recipe.description}</p>
                    </div>

                    {categories.length > 0 && (
                      <RecipeCategories
                        recipe={recipe}
                        allCategories={categories}
                        onCategoryChange={handleCategoryChange}
                      />
                    )}

                    <div className="card-btn">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(recipe)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(recipe.recipeId)}
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* sentinel */}
              <div ref={sentinelRef} style={{ height: "1px" }} />

              {isFetchingMore && (
                <ul className="grid">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <RecipeSkeleton key={i} />
                  ))}
                </ul>
              )}
              {!hasMore && recipes.length > 0 && (
                <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  No more recipes
                </p>
              )}
            </>
          )}
        </section>
        {visible && (
          <CreateRecipe
            onRecipeCreated={handleRecipeCreated}
            onHide={handleHide}
            visible={visible}
          />
        )}
        {editingRecipe && (
          <EditRecipe
            recipe={editingRecipe}
            onRecipeUpdated={handleUpdate}
            onClose={handleCloseEdit}
          />
        )}

        {viewingRecipe && (
          <RecipeDetail recipe={viewingRecipe} onClose={handleCloseView} />
        )}

        <Category />
        {userPlan === "free" && <UpgradeToPro />}
      </main>
    </>
  );
};

export default Dashboard;

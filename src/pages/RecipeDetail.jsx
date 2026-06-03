import React, { useState, useEffect } from "react";
import { FcCalendar } from "react-icons/fc";
import { FcPrint } from "react-icons/fc";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";

const RecipeDetail = ({ recipe, onClose }) => {
  const [isShared, setIsShared] = useState(recipe.isShared || false);
  const [shareId, setShareId] = useState(recipe.shareId || null);
  const { getAccessTokenSilently } = useAuth0();

  const handleToggleShare = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/recipes/${recipe.recipeId}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsShared(response.data.isShared);

      if (response.data.isShared) {
        const link = `${window.location.origin}/recipe/${response.data.shareId}`;
        setShareId(response.data.shareId);
        await navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard");
      } else {
        setShareId(null);
        toast.success("Recipe unshared!");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handlePrint = () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark")
      document.documentElement.removeAttribute("data-theme");
    window.print();
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  return (
    <div className="modal" onClick={onClose}>
      <div className="recipe-detail" onClick={(e) => e.stopPropagation()}>
        {/* close button */}
        <div className="buttons">
          <button onClick={onClose} className="btn btn-danger position">
            &times;
          </button>
          <button onClick={handleToggleShare} className="btn btn-primary">
            {isShared ? "Unshare" : "Share"}
          </button>
          {isShared && shareId && (
            <p
              className="share-link"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/recipe/${shareId}`,
                );
                toast.success("Link copied!");
              }}
            >
              🔗 Copy link again
            </p>
          )}
          <button
            onClick={handlePrint}
            className="btn btn-primary position-print"
          >
            Print <FcPrint />
          </button>
        </div>
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

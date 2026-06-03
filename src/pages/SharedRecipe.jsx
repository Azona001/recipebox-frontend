import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";

const SharedRecipe = () => {
  const { shareId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedRecipe = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/recipes/share/${shareId}`,
        );
        setRecipe(response.data.recipe);
      } catch (error) {
        setError("Recipe not found or no longer shared");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedRecipe();
  }, [shareId]);

  if (isLoading) return <Loading />;
  if (error) return <p className="message-error">{error}</p>;

  return (
    <div className="shared-recipe">
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="shared-recipe-image"
        />
      )}
      <div className="shared-recipe-content">
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>
        <p className="shared-recipe-footer">Shared via RecipeBox</p>
      </div>
    </div>
  );
};

export default SharedRecipe;

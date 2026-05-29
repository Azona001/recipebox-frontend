import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React from "react";
import useEditor from "../hooks/Editor";

const EditRecipe = ({ recipe, onRecipeUpdated, onClose, onMessage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: recipe.title,
    description: recipe.description,
    duration: recipe.duration,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
  });
  const [editor, value] = useEditor("instructions", recipe.instructions);

  const { getAccessTokenSilently } = useAuth0();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    onMessage("");

    try {
      const token = await getAccessTokenSilently();

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("servings", formData.servings);
      formDataToSend.append("ingredients", formData.ingredients);
      formDataToSend.append("instructions", value);
      if (image) formDataToSend.append("image", image);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/recipes/${recipe.recipeId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const data = response.data;
      const updatedRecipe = data.updatedRecipe;
      onRecipeUpdated(recipe.recipeId, updatedRecipe);
      onMessage(response.data.msg);
      setTimeout(() => onMessage(""), 3000);
      onClose();
    } catch (error) {
      if (error.response) console.log(error.response.data);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/** modal */}

      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Edit Recipe</h3>
            <button
              type="button"
              className="btn btn-danger position"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <div className="input">
            <label htmlFor="title" aria-label="title">
              Title:
            </label>
            <input
              value={formData.title}
              name="title"
              type="text"
              id="title"
              required
              placeholder="Enter title"
              onChange={handleChange}
            />
          </div>
          <div className="input">
            <label htmlFor="description" aria-label="description">
              Description:
            </label>
            <textarea
              value={formData.description}
              name="description"
              id="description"
              placeholder="Enter description..."
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <div className="input">
              <label htmlFor="duration">Duration:</label>
              <input
                value={formData.duration}
                name="duration"
                id="duration"
                placeholder="in minutes"
                type="number"
                onChange={handleChange}
              />
            </div>
            <div className="input">
              <label htmlFor="servings">Servings:</label>
              <input
                value={formData.servings}
                name="servings"
                id="servings"
                placeholder="1"
                type="number"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input">
            <label htmlFor="ingredients" aria-label="ingredients">
              Ingredients:
            </label>
            <textarea
              value={formData.ingredients}
              name="ingredients"
              id="ingredients"
              placeholder="X cup(s) of Y..."
              onChange={handleChange}
              required
              rows={5}
              cols={40}
            />
          </div>
          <div className="input">
            <label htmlFor="instructions" aria-label="instructions">
              Instructions:
            </label>
            {editor}
            {/* <textarea
              value={formData.instructions}
              name="instructions"
              id="instructions"
              placeholder="Enter instructions..."
              onChange={handleChange}
              required
              rows={10}
              cols={60}
            /> */}
          </div>
          <div className="input">
            <label htmlFor="image">Update Image (optional):</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {recipe.imageUrl && (
              <p style={{ fontSize: "0.85rem", color: "gray" }}>
                Current image will be replaced if you upload a new one
              </p>
            )}
          </div>
          <div className="submit">
            {isLoading ? (
              <button type="submit" className="btn" disabled aria-disabled>
                Loading...
              </button>
            ) : (
              <>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </>
            )}
          </div>

          {error && <p className="message-error">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default EditRecipe;

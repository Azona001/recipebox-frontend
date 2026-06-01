import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import axios from "axios";
import React from "react";
import useEditor from "../hooks/Editor";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const CreateRecipe = ({ onRecipeCreated, onHide, visible }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 0,
    servings: 0,
    ingredients: "",
    instructions: "",
  });

  const [editor, value, reset] = useEditor("instructions");

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

    //let's try and fetch here

    try {
      const token = await getAccessTokenSilently();

      //use Formdata instead of JSON
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("servings", formData.servings);
      formDataToSend.append("ingredients", formData.ingredients);
      formDataToSend.append("instructions", value);
      if (image) formDataToSend.append("image", image);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/recipes`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const newRecipe = response.data.newRecipe;
      onRecipeCreated(newRecipe);

      setFormData({
        title: "",
        description: "",
        duration: 0,
        servings: 0,
        ingredients: "",
        instructions: "",
      });
      reset();
      setImage(null);
      toast.success(response.data.msg);
      onHide(visible);
    } catch (error) {
      if (error.response) console.log(error.response.data);
      toast.error(error.response?.data?.msg || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Create Recipe</h3>
            <button
              onClick={() => onHide(visible)}
              className="btn btn-danger position"
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
            <label htmlFor="image">Recipe Image (optional):</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="submit">
            {isLoading ? (
              <button type="submit" className="btn" disabled aria-disabled>
                <Loading />
              </button>
            ) : (
              <>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRecipe;

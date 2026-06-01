import React from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const AddCategory = ({ onCreated }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
  });
  const { getAccessTokenSilently } = useAuth0();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/categories`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const createdCategory = response.data.createdCategory;
      onCreated(createdCategory);
      setFormData({ category: "" });
      toast.success(response.data.msg);
    } catch (error) {
      if (error.response) console.log(error.response.data);
      toast.error(error.response?.data?.msg || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form className="add-category" onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="categoryName" aria-label="categoryName">
            Add Category:
          </label>
          <input
            value={formData.category}
            type="text"
            name="category"
            id="categoryName"
            required
            onChange={handleChange}
          />
        </div>

        <div className="submit">
          {isLoading ? (
            <button type="submit" className="btn" disabled aria-disabled>
              <Loading />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default AddCategory;

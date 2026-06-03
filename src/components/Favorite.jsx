import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";
import { IoHeartSharp } from "react-icons/io5";

const Favorite = ({ recipe }) => {
  const [isFav, setIsFav] = useState(recipe.isFavorite || false);
  const { getAccessTokenSilently } = useAuth0();

  const toggleFavorite = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/recipes/${recipe.recipeId}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsFav(response.data.isFavorite);
      toast.success(response.data.isFavorite ? "Favorited!" : "Unfavorited!");
    } catch (error) {
      if (error.response) console.error(error.response.data.msg);
      toast.error("Something wrong. Try again later!");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <button
        onClick={toggleFavorite}
        style={{ marginLeft: "auto", backgroundColor: "transparent" }}
        className="btn"
      >
        <svg width="0" height="0">
          <defs>
            <linearGradient
              id="heartGradient"
              x1="0%"
              y1="99.67%"
              x2="8.72%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#F31B43" />
              <stop offset="24%" stopColor="#F3601B" />
              <stop offset="100%" stopColor="#F2F21C" />
            </linearGradient>
          </defs>
        </svg>
        <IoHeartSharp
          size="30px"
          stroke="#ffffff"
          strokeWidth={5}
          style={
            isFav
              ? {
                  fill: "url(#heartGradient)",
                  filter: "drop-shadow(0px 2px 1px rgba(243, 27, 67, 0.3))",
                }
              : {}
          }
        />
      </button>
    </div>
  );
};

export default Favorite;

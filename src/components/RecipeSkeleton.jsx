import React from "react";
import Skeleton from "@mui/material/Skeleton";

const RecipeSkeleton = () => {
  return (
    <li className="card">
      {/* Image */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height={200}
      />

      <div className="card-details">
        {/* Title */}
        <Skeleton variant="text" animation="wave" width="60%" height={30} />

        {/* Duration and servings */}
        <div className="duration-serving">
          <Skeleton variant="text" animation="wave" width="30%" height={20} />
          <Skeleton variant="text" animation="wave" width="30%" height={20} />
        </div>

        {/* Description */}
        <Skeleton variant="text" animation="wave" width="100%" height={20} />
        <Skeleton variant="text" animation="wave" width="80%" height={20} />
      </div>

      {/* Category */}
      <Skeleton variant="text" animation="wave" width="40%" height={20} />

      {/* Buttons */}
      <div className="card-btn">
        <Skeleton variant="rounded" animation="wave" width={60} height={35} />
        <Skeleton variant="rounded" animation="wave" width={35} height={35} />
      </div>
    </li>
  );
};

export default RecipeSkeleton;

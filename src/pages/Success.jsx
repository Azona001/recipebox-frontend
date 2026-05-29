import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="login">
      <h2>🎉 You're now a Pro member!</h2>
      <p>Enjoy unlimited recipes and premium features.</p>
      <button
        className="btn btn-primary"
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Success;

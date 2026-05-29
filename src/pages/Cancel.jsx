import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="login">
      <h2>Payment Cancelled</h2>
      <p>No worries — you can upgrade anytime.</p>
      <button
        className="btn btn-primary"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Cancel;

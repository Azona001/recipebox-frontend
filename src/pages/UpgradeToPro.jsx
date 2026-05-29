import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Loading from "../components/Loading";

const UpgradeToPro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/stripe/create-checkout-session`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      setError("Failed to start checkout");
      setIsLoading(false);
    }
  };

  return (
    <section className="section-upgrade">
      <div className="upgrade">
        <h3>Upgrade to Pro</h3>
        <p>Get unlimited recipes for just $9!</p>
        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="btn btn-upgrade"
        >
          {isLoading ? <Loading /> : "Upgrade Now"}
        </button>
        {error && <p className="message-error">{error}</p>}
      </div>
    </section>
  );
};

export default UpgradeToPro;

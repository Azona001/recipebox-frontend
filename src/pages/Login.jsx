import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../components/Loading";

const Login = () => {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect: login,
  } = useAuth0();
  const navigate = useNavigate();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  if (isLoading) return <Loading />;
  return (
    <>
      <div className="login">
        <h1>RecipeBox</h1>
        <p>Your personal recipe collection</p>
        {error && <p className="message-error">Error: {error.message}</p>}
        <button onClick={login}>Login</button>
        <p>Don't have an account?</p>
        <button onClick={signup} className="signup">
          Signup
        </button>
      </div>
    </>
  );
};

export default Login;

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";
import CategoryProvider from "./context/CategoryProvider";
import { RecipeProvider } from "./context/RecipeProvider";
import ThemeProvider from "./context/ThemeProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-0g8elbms6i2ik7kh.us.auth0.com"
      clientId="UcSRhTYRKnZFFVvNa7J5DMbGyuthigm0"
      authorizationParams={{
        redirect_uri: `${window.location.origin}/dashboard`,
        audience: "https://recipebox-api.com/",
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
    >
      <CategoryProvider>
        <RecipeProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </RecipeProvider>
      </CategoryProvider>
    </Auth0Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

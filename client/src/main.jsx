//this mounts the react app into the HTML page

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

//creats the root react tree and wraps it with 
//react.strictmode for extra checks in development
//browserrouter for client-side routing
//authprovider so the whole app can access the auth state like the user, token and role
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

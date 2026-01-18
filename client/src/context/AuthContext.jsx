// Authentication context: stores logged-in user, token, role and exposes login/logout.
import { createContext, useContext, useEffect, useState } from "react";
// Create the context object (default value: null)
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // { id, name, email, role }
  const [token, setToken] = useState(null);  // JWT
  const [role, setRole] = useState(null);    // "admin" | "user"
  const [loading, setLoading] = useState(true);  // loading: true while we check if there is saved auth in localStorage

  // On first render, try to restore auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("jat_user");
    const savedToken = localStorage.getItem("jat_token");
    const savedRole = localStorage.getItem("jat_role");

    if (savedUser && savedToken && savedRole) {
      //if all exists, then parse and restore them into state
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  //called after a succesful login or register
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setRole(userData.role);
  //persist in localstorage so it keeps the user logged in with refresh
    localStorage.setItem("jat_user", JSON.stringify(userData));
    localStorage.setItem("jat_token", jwtToken);
    localStorage.setItem("jat_role", userData.role);
  };
  //when user logs out
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
  //clear persistent storage
    localStorage.removeItem("jat_user");
    localStorage.removeItem("jat_token");
    localStorage.removeItem("jat_role");
  };
//value exposed to the rest of the app
  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

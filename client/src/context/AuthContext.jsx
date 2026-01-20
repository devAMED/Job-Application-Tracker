import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("jat_user");
    const savedToken = localStorage.getItem("jat_token");
    const savedRole = localStorage.getItem("jat_role");

    if (savedUser && savedToken && savedRole) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setRole(userData.role);

    localStorage.setItem("jat_user", JSON.stringify(userData));
    localStorage.setItem("jat_token", jwtToken);
    localStorage.setItem("jat_role", userData.role);
  };

  const logout = () => {
    localStorage.removeItem("jat_user");
    localStorage.removeItem("jat_token");
    localStorage.removeItem("jat_role");
    setUser(null);
    setToken(null);
    setRole(null);
  };

  const forceLogout = () => {
    localStorage.removeItem("jat_user");
    localStorage.removeItem("jat_token");
    localStorage.removeItem("jat_role");
    setUser(null);
    setToken(null);
    setRole(null);
  };

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    forceLogout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

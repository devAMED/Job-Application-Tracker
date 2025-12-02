import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // { id, name, email, role }
  const [token, setToken] = useState(null);  // JWT
  const [role, setRole] = useState(null);    // "admin" | "user"
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
    setUser(null);
    setToken(null);
    setRole(null);

    localStorage.removeItem("jat_user");
    localStorage.removeItem("jat_token");
    localStorage.removeItem("jat_role");
  };

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

export const useAuth = () => useContext(AuthContext);

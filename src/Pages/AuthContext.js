import React, { createContext, useState, useContext,useEffect } from 'react';

// Create a Context for Authentication
const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for development

  /*
    const checkAuth = () => {
      const token = sessionStorage.getItem("user_token");
      setIsAuthenticated(!!token);
    };
  
    const login = (token) => {
      sessionStorage.setItem("user_token", token);
      checkAuth();
    };

    useEffect(() => {
      checkAuth();
    }, []);
  */

  const checkAuth = () => {};
  const login = () => setIsAuthenticated(true);
   
  // const register = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user_token'); // Remove authentication status from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

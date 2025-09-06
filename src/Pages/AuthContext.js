import React, { createContext, useState, useContext,useEffect } from 'react';

// Create a Context for Authentication
const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const login = () =>{
  //   localStorage.getItem('user_token')
  //   if( localStorage.getItem('user_token')){
  //     setIsAuthenticated(true);
  //   }else{
  //     setIsAuthenticated(false);
  //   }
  //   }


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

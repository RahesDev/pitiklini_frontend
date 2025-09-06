import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  console.log(Component,'=-=-=-Component=-=-=-Component')
  // console.log(...rest ,'=-=-=-...rest =-=-=-...rest ')


console.log(isAuthenticated,'=-=-=-isAuthenticated=-=-=-isAuthenticated')
  return (
    <Routes>
      <Route
        {...rest}
        element={isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default ProtectedRoute;

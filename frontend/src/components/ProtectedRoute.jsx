import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!getAuthToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

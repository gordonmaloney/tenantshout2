// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Wraps protected routes and redirects unauthenticated users to /login
 * @param {{ isLoggedIn: boolean, children: React.ReactNode }} props
 */
export default function ProtectedRoute({ isLoggedIn, children }) {
  const location = useLocation();
  
  // If not logged in, redirect to login page, preserving the current location
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If logged in, render the protected component
  return <>{children}</>;
}

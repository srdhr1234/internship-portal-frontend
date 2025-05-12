// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const studentProfile = localStorage.getItem('studentProfile');

  // Not logged in → redirect to login
  if (!studentProfile) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return children;
}

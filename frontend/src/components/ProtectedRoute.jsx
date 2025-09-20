import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ element }) {
    
  const { currentUser } = useSelector((state) => state.user);
  
  return currentUser ? element : <Navigate to="/sign-in" />;
}
'use client';

import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

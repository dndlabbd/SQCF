// hooks/useAuth.js

import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedPassword = sessionStorage.getItem('password');
    if (storedPassword === process.env.NEXT_PUBLIC_ACCESS_PASSWORD) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password) => {
    if (password === process.env.NEXT_PUBLIC_ACCESS_PASSWORD) {
      sessionStorage.setItem('password', password);
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('password');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;
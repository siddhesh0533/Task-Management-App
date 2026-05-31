import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : decoded;
    } catch { return null; }
  });

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData) localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData || jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

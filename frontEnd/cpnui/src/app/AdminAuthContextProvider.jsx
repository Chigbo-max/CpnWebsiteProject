import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AdminAuthContext } from './AdminAuthContext';
import { toast } from 'sonner';

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('adminInfo');
    return stored ? JSON.parse(stored) : null;
  });
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('adminInfo', JSON.stringify(admin));
    } else {
      localStorage.removeItem('adminInfo');
    }
  }, [admin]);

  const login = (token, adminInfo) => {
    setToken(token);
    setAdmin(adminInfo);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
  };

  // Add a method to update admin info (e.g., after profile picture change)
  const updateAdmin = (adminInfo) => {
    setAdmin(adminInfo);
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    toast.info('You have been logged out.');
    setShouldRedirect(true);
  };

  // Helper to handle API errors and auto-logout on 401/403
  const handleAuthError = (error) => {
    if (!error) return;
    if (
      error.status === 401 ||
      error.status === 403 ||
      error.message === 'Invalid token.' ||
      error.message === 'jwt expired' ||
      error.message === 'jwt malformed'
    ) {
      logout();
    }
  };

  return (
    <AdminAuthContext.Provider value={{ token, admin, login, logout, shouldRedirect, setShouldRedirect, updateAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}; 
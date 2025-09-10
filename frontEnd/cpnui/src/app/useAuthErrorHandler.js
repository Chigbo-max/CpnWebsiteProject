import { useAdminAuth } from './useAdminAuth';
import { toast } from 'sonner';
import { useRef } from 'react';

export const useAuthErrorHandler = () => {
  const { logout } = useAdminAuth();
  const hasLoggedOutRef = useRef(false); // prevent multiple logouts

  const triggerLogout = () => {
    if (hasLoggedOutRef.current) return; // already logged out, skip
    hasLoggedOutRef.current = true;
    console.error('Token expired - logging out automatically');
    logout();
    toast.error('Session expired. Please log in again.');
  };

  const handleAuthError = (response) => {
    if (response.status === 401) {
      triggerLogout();
      return true;
    }
    return false;
  };

  const handleMultipleResponses = (responses) => {
    const unauthorizedResponse = responses.find(res => res.status === 401);
    if (unauthorizedResponse) {
      triggerLogout();
      return true;
    }
    return false;
  };

  return { handleAuthError, handleMultipleResponses };
};

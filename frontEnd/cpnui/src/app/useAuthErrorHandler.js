import { useAdminAuth } from './useAdminAuth';
import { toast } from 'sonner';

export const useAuthErrorHandler = () => {
  const { logout } = useAdminAuth();

  const handleAuthError = (response) => {
    if (response.status === 401) {
      console.error('Token expired - logging out automatically');
      logout();
      toast.error('Session expired. Please log in again.');
      return true; // Indicates authentication error was handled
    }
    return false; // No authentication error
  };

  const handleMultipleResponses = (responses) => {
    // Check if any response is unauthorized (401) - token expired
    const unauthorizedResponse = responses.find(res => res.status === 401);
    
    if (unauthorizedResponse) {
      console.error('Token expired - logging out automatically');
      logout();
      toast.error('Session expired. Please log in again.');
      return true; // Indicates authentication error was handled
    }
    
    return false; // No authentication error
  };

  return { handleAuthError, handleMultipleResponses };
}; 
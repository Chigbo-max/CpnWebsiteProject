import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './router/route.jsx';
import React from 'react';
import ServerDown from './pages/Error/ServerDown';
import NoInternet from './pages/Error/NoInternet';
import ErrorBoundary from './pages/Error/ErrorBoundary';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from './app/AdminAuthContextProvider';

function App() {
  const [hasServerError, setHasServerError] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  React.useEffect(() => {
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await origFetch(...args);
        if (!response.ok && (response.status >= 500 || response.status === 429 || response.status === 401)) {
          setHasServerError(true);
        }
        return response;
      } catch (err) {
        if (!navigator.onLine) {
          setIsOnline(false);
        } else {
          setHasServerError(true);
        }
        throw err;
      }
    };
    return () => {
      window.fetch = origFetch;
    };
  }, []);

  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <Toaster position="top-center" richColors />
        {isOnline ? (
          hasServerError ? (
            <RouterProvider router={router}>
              <ServerDown />
            </RouterProvider>
          ) : (
            <RouterProvider router={router} />
          )
        ) : (
          <NoInternet />
        )}
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
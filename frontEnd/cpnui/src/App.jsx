import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from "./router/route.jsx"
import { Provider } from 'react-redux'
import store from './app/store.jsx'
import React from 'react';
import ServerDown from './pages/Error/ServerDown';
import NoInternet from './pages/Error/NoInternet';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from './app/AdminAuthContext';

function App() {
  // Remove token logic from here; use context instead
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

  // Global fetch error handler
  React.useEffect(() => {
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await origFetch(...args);
        if (!response.ok && response.status >= 500) {
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

  if (!isOnline) return <NoInternet />;
  if (hasServerError) return <ServerDown />;

  return (
    <Provider store={store}>
      <AdminAuthProvider>
        <Toaster position="top-center" richColors />
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </Provider>
  );
}

export default App;

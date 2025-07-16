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
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [hasServerError, setHasServerError] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [isAppLoading, setIsAppLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate async startup (e.g., auth check, config fetch)
    const timer = setTimeout(() => setIsAppLoading(false), 1200); // 1.2s splash
    return () => clearTimeout(timer);
  }, []);

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

  if (isAppLoading) {
    return <LoadingSpinner message="Christian Professionals Network is starting..." />;
  }

  if (!isOnline) return <NoInternet />;
  if (hasServerError) return <ServerDown />;

  return (
    <Provider store={store}>
      <AdminAuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </AdminAuthProvider>
    </Provider>
  );
}

export default App;

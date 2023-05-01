import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from 'AppRoutes';
import AuthProvider from 'auth/contexts/AuthProvider';
import Loader from 'core/components/Loader';
import 'core/config/i18n';
import SettingsProvider from 'core/contexts/SettingsProvider';
import SnackbarProvider from 'core/contexts/SnackbarProvider';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      suspense: true,
    },
  },
});

const App = () => {
  return (
    <React.Suspense fallback={<Loader />}>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <SnackbarProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </SnackbarProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
};

export default App;

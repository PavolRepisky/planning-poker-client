import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Loader from 'core/components/Loader';
import 'core/config/i18n';
import SettingsProvider from 'core/contexts/SettingsProvider';
import SnackbarProvider from 'core/contexts/SnackbarProvider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      suspense: true,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <React.Suspense fallback={<Loader />}>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

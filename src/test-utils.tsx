import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, render } from '@testing-library/react';
import AuthProvider from 'auth/contexts/AuthProvider';
import Loader from 'core/components/Loader';
import QueryWrapper from 'core/components/QueryWrapper';
import 'core/config/i18n';
import SettingsProvider from 'core/contexts/SettingsProvider';
import SnackbarProvider from 'core/contexts/SnackbarProvider';
import React, { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      suspense: true,
    },
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <React.Suspense fallback={<Loader />}>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <QueryWrapper>
              <SnackbarProvider>
                <AuthProvider>{children}</AuthProvider>
              </SnackbarProvider>
            </QueryWrapper>
          </SettingsProvider>
        </QueryClientProvider>
      </React.Suspense>
    </MemoryRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

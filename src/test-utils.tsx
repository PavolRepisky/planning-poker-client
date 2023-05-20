import { RenderOptions, render } from '@testing-library/react';
import 'core/config/i18n';
import React, { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

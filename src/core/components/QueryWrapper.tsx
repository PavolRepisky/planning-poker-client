import { Button } from '@mui/material';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';
import Result from './Result';

type QueryWrapperProps = {
  children: React.ReactNode;
};

const QueryWrapper = ({ children }: QueryWrapperProps) => {
  const { reset } = useQueryErrorResetBoundary();
  const { t } = useTranslation();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <Result
          extra={
            <Button onClick={() => resetErrorBoundary()} variant="contained">
              {t('common.retry')}
            </Button>
          }
          status="error"
          subTitle={t('common.errors.unexpected.subTitle')}
          title={t('common.errors.unexpected.title')}
        />
      )}
    >
      <React.Suspense fallback={<Loader />}>{children}</React.Suspense>
    </ErrorBoundary>
  );
};

export default QueryWrapper;

import { Button } from '@mui/material';
import { ReactComponent as NotFoundSvg } from 'assets/404.svg';
import Result from 'core/components/Result';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Result
      extra={
        <Button
          color="secondary"
          component={RouterLink}
          to={'/'}
          variant="contained"
        >
          {t('common.backHome')}
        </Button>
      }
      image={<NotFoundSvg />}
      maxWidth="sm"
      subTitle={t('common.errors.notFound.subTitle')}
      title={t('common.errors.notFound.title')}
    />
  );
};

export default NotFound;

import { useVerifyEmail } from 'auth/hooks/useVerifyEmail';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { verificationCode } = useParams();
  const { verifyEmail } = useVerifyEmail();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      try {
        await verifyEmail({
          verificationCode: verificationCode ?? '',
        });
        snackbar.success(t('auth.verifyEmail.notifications.success'));
        navigate('/login');
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          navigate('/404');
          return;
        }
        navigate('/');
        snackbar.error(t('common.errors.unexpected.subTitle'));
      }
    }
    fetchData();
  }, [navigate, snackbar, t, verificationCode, verifyEmail]);

  return <></>;
};

export default VerifyEmail;

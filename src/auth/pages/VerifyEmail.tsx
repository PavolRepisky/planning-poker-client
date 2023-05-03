import { useVerifyEmail } from 'auth/hooks/useVerifyEmail';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { verificationCode } = useParams();
  const { isVerifying, verifyEmail } = useVerifyEmail();
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
        navigate('/404');
        snackbar.error(t('common.errors.unexpected.subTitle'));
      }
    }
    fetchData();
  }, []);

  return <></>;
};

export default VerifyEmail;

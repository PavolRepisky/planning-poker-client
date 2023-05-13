import { LoadingButton } from '@mui/lab';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import { useResetPassword } from 'auth/hooks/useResetPassword';
import passwordRegex from 'auth/types/passwordRegex';
import BoxedLayout from 'core/components/BoxedLayout';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import { parseValidationErrors } from 'core/utils/parseValidationErrors';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

const ResetPassword = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { resetToken } = useParams();
  const { resetPassword, isResetting } = useResetPassword();
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        await resetPassword({
          password: '',
          confirmationPassword: '',
          resetToken: resetToken ?? '',
        });
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          navigate('/404');
        }
      }
    }
    fetchData();
  }, [navigate, resetToken, resetPassword]);

  const validationSchema = yup.object({
    password: yup
      .string()
      .required(t('common.validations.required'))
      .matches(passwordRegex, t('common.validations.password.weak')),
    confirmationPassword: yup
      .string()
      .required(t('common.validations.required'))
      .oneOf([yup.ref('password')], t('common.validations.password.match')),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleSubmitPassword = async (formData: FormData) => {
    try {
      await resetPassword({ ...formData, resetToken: resetToken ?? '' });
      snackbar.success(t('auth.resetPassword.notifications.success'));
      navigate('/login');
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const validationErrors = err.response.data
          .errors as ServerValidationError[];
        formik.setErrors(parseValidationErrors(validationErrors));
        return;
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmationPassword: '',
    },
    validationSchema,
    onSubmit: handleSubmitPassword,
  });

  return (
    <BoxedLayout maxWidth="xs">
      <Typography component="h1" variant="h5" sx={{ mt: 6 }}>
        {t('auth.resetPassword.title')}
      </Typography>

      <Box
        component="form"
        marginTop={3}
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <TextField
          required
          fullWidth
          id="password"
          label={t('auth.resetPassword.form.password.label')}
          name="password"
          type="password"
          autoComplete="new-password"
          disabled={isResetting}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          required
          fullWidth
          id="confirmationPassword"
          label={t('auth.resetPassword.form.confirmationPassword.label')}
          name="confirmationPassword"
          type="password"
          disabled={isResetting}
          value={formik.values.confirmationPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.confirmationPassword &&
            Boolean(formik.errors.confirmationPassword)
          }
          helperText={
            formik.touched.confirmationPassword &&
            formik.errors.confirmationPassword
          }
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isResetting}
          loading={isResetting}
          sx={{ mt: 2 }}
        >
          {t('auth.resetPassword.form.submit')}
        </LoadingButton>
      </Box>

      <Button component={RouterLink} to={'/'} variant="outlined" sx={{ mt: 5 }}>
        {t('common.backHome')}
      </Button>
    </BoxedLayout>
  );
};

export default ResetPassword;

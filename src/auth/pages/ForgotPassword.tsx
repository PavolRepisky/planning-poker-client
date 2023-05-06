import { LoadingButton } from '@mui/lab';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForgotPassword } from 'auth/hooks/useForgotPassword';
import BoxedLayout from 'core/components/BoxedLayout';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import { parseValidationErrors } from 'core/utils/parseValidationErrors';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const { forgotPassword, isSending } = useForgotPassword();

  const validationSchema = yup.object({
    email: yup
      .string()
      .trim()
      .required(t('common.validations.required'))
      .email(t('common.validations.email.invalid')),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleForgotPassword = async (formData: FormData) => {
    try {
      const { email } = formData;
      await forgotPassword({ email });
      snackbar.success(t('auth.forgotPassword.notifications.success'));
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
      email: '',
    },
    validationSchema,
    onSubmit: handleForgotPassword,
  });

  return (
    <BoxedLayout maxWidth="xs">
      <Typography component="h1" variant="h5" sx={{ mt: 6 }}>
        {t('auth.forgotPassword.title')}
      </Typography>

      <Typography marginTop={1} textAlign="center">
        {t('auth.forgotPassword.subTitle')}
      </Typography>

      <Box
        component="form"
        marginTop={3}
        noValidate
        onSubmit={formik.handleSubmit}
        sx={{ width: '100%' }}
      >
        <TextField
          required
          fullWidth
          id="email"
          label={t('auth.forgotPassword.form.email.label')}
          name="email"
          type="text"
          autoFocus
          autoComplete="email"
          disabled={isSending}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSending}
          loading={isSending}
          sx={{ mt: 2 }}
        >
          {t('auth.forgotPassword.form.submit')}
        </LoadingButton>
      </Box>

      <Button
        component={RouterLink}
        to={'/login'}
        variant="outlined"
        sx={{ mt: 5 }}
      >
        {t('auth.forgotPassword.backToLogin')}
      </Button>
    </BoxedLayout>
  );
};

export default ForgotPassword;

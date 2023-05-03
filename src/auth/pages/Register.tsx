import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { useRegister } from 'auth/hooks/useRegister';
import passwordRegex from 'auth/types/passwordRegex';
import BoxedLayout from 'core/components/BoxedLayout';
import config from 'core/config/config';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import { parseValidationErrors } from 'core/utils/parseValidationErrors';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link, Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';

const Register = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { isRegistering, register } = useRegister();

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .trim()
      .required(t('common.validations.required'))
      .max(config.maxNameLength, t('common.validations.string.max')),
    lastName: yup
      .string()
      .trim()
      .required(t('common.validations.required'))
      .max(config.maxNameLength, t('common.validations.string.max')),
    email: yup
      .string()
      .trim()
      .required(t('common.validations.required'))
      .email(t('common.validations.email.invalid')),
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

  const handleRegister = async (formData: FormData) => {
    try {
      await register(formData);
      snackbar.success(t('auth.register.notifications.accountCreated'));
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmationPassword: '',
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <BoxedLayout maxWidth="xs">
      <Typography component="h1" variant="h4">
        {t('auth.register.title')}
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
          id="firstName"
          label={t('auth.register.form.firstName.label')}
          name="firstName"
          type="text"
          autoFocus
          autoComplete="given-name"
          disabled={isRegistering}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          required
          fullWidth
          id="lastName"
          label={t('auth.register.form.lastName.label')}
          name="lastName"
          type="text"
          autoComplete="family-name"
          disabled={isRegistering}
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <TextField
          required
          fullWidth
          id="email"
          label={t('auth.register.form.email.label')}
          name="email"
          type="email"
          autoComplete="email"
          disabled={isRegistering}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          required
          fullWidth
          id="password"
          label={t('auth.register.form.password.label')}
          name="password"
          type="password"
          autoComplete="new-password"
          disabled={isRegistering}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          required
          fullWidth
          id="confirmationPassword"
          label={t('auth.register.form.confirmationPassword.label')}
          name="confirmationPassword"
          type="password"
          disabled={isRegistering}
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
          disabled={isRegistering}
          loading={isRegistering}
        >
          {t('auth.register.form.submit')}
        </LoadingButton>

        <Typography
          component="h1"
          variant="body1"
          textAlign="center"
          sx={{ mt: 3 }}
        >
          {t('auth.register.haveAccount')}
          <MuiLink
            component={Link}
            to="/login"
            sx={{ ml: 1, fontWeight: 'bold', textDecoration: 'none' }}
          >
            {t('common.login')}
          </MuiLink>
        </Typography>
      </Box>

      <Button component={RouterLink} to={'/'} variant="outlined" sx={{ mt: 5 }}>
        {t('common.backHome')}
      </Button>
    </BoxedLayout>
  );
};

export default Register;

import { LoadingButton } from '@mui/lab';
import { Box, Link as MuiLink, TextField, Typography } from '@mui/material';
import { useRegister } from 'auth/hooks/useRegister';
import passwordRegex from 'auth/types/passwordRegex';
import BoxedLayout from 'core/components/BoxedLayout';
import { transformToFormikErrorsObj } from 'core/utils/transform';
import { ValidationError } from 'express-validator';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { useSnackbar } from '../../core/contexts/SnackbarProvider';

const Register = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { isRegistering, register } = useRegister();

  const schema = yup.object({
    firstName: yup
      .string()
      .required(t('common.validations.required'))
      .min(3, t('common.validations.minChar', { size: 3 }))
      .max(50, t('common.validations.maxChar', { size: 50 })),
    lastName: yup
      .string()
      .required(t('common.validations.required'))
      .min(3, t('common.validations.minChar', { size: 3 }))
      .max(50, t('common.validations.maxChar', { size: 50 })),
    email: yup
      .string()
      .required(t('common.validations.required'))
      .email(t('common.validations.email')),
    password: yup
      .string()
      .required(t('common.validations.required'))
      .matches(passwordRegex, t('common.validations.password')),
    confirmationPassword: yup
      .string()
      .required(t('common.validations.required'))
      .oneOf([yup.ref('password')], t('common.validations.passwordMatch')),
  });

  type FormData = yup.InferType<typeof schema>;

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmationPassword: '',
    },
    validationSchema: schema,
    onSubmit: (values) => handleRegister(values),
  });

  const handleRegister = async (values: FormData) => {
    try {
      await register(values);
      snackbar.success(t('auth.register.notifications.success'));
      navigate('/login');
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const validationErrors = err.response.data.errors as ValidationError[];
        formik.setErrors(transformToFormikErrorsObj(validationErrors));
        return;
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  return (
    <BoxedLayout>
      <Typography component="h1" variant="h5">
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
          size="small"
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
          size="small"
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
          size="small"
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
          size="small"
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
          size="small"
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isRegistering}
          loading={isRegistering}
        >
          {t('auth.register.submit')}
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
            {t('auth.register.login')}
          </MuiLink>
        </Typography>
      </Box>
    </BoxedLayout>
  );
};

export default Register;

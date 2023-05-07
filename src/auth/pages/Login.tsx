import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import BoxedLayout from 'core/components/BoxedLayout';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import { parseValidationErrors } from 'core/utils/parseValidationErrors';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const Login = () => {
  const { isLoggingIn, login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [loginStatus, setLoginStatus] = useState('');

  const validationSchema = yup.object({
    email: yup
      .string()
      .trim()
      .required(t('common.validations.required'))
      .email(t('common.validations.email.invalid')),
    password: yup.string().required(t('common.validations.required')),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleLogin = async (formData: FormData) => {
    try {
      const { email, password } = formData;
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const validationErrors = err.response.data
          .errors as ServerValidationError[];
        formik.setErrors(parseValidationErrors(validationErrors));
        return;
      }
      if (err.response && err.response.status === 401) {
        setLoginStatus(t('auth.login.invalidCredentials'));
        return;
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        md={7}
        sx={{
          backgroundImage: 'url(./images/login.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '70%',
          backgroundPosition: 'center',
        }}
      />

      <Grid item xs={12} md={5} component={Paper} square>
        <BoxedLayout maxWidth="xs">
          <Typography component="h1" variant="h4">
            {t('auth.login.title')}
          </Typography>

          <FormHelperText error={Boolean(loginStatus)} component="h1">
            <Typography variant="body1">{loginStatus}</Typography>
          </FormHelperText>

          <Box
            component="form"
            marginTop={3}
            noValidate
            onSubmit={formik.handleSubmit}
            maxWidth="xs"
            onChange={() => setLoginStatus('')}
          >
            <TextField
              required
              fullWidth
              id="email"
              label={t('auth.login.form.email.label')}
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              disabled={isLoggingIn}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              required
              fullWidth
              name="password"
              label={t('auth.login.form.password.label')}
              type="password"
              id="password"
              autoComplete="current-password"
              disabled={isLoggingIn}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <LoadingButton
              type="submit"
              fullWidth
              loading={isLoggingIn}
              variant="contained"
            >
              {t('auth.login.form.submit')}
            </LoadingButton>

            <Typography
              component="h1"
              variant="body1"
              textAlign="center"
              sx={{ mt: 5, mb: 2 }}
            >
              {t('auth.login.noAccount')}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ ml: 1, fontWeight: 'bold', textDecoration: 'none' }}
              >
                {t('common.register')}
              </Link>
            </Typography>

            <Typography component="h1" variant="body1" textAlign="center">
              {t('auth.login.forgottenPassword')}
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{ ml: 1, fontWeight: 'bold', textDecoration: 'none' }}
              >
                {t('auth.login.resetPassword')}
              </Link>
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to={'/'}
            variant="outlined"
            sx={{ mt: 5 }}
          >
            {t('common.backHome')}
          </Button>
        </BoxedLayout>
      </Grid>
    </Grid>
  );
};

export default Login;

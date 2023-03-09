import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { transformToFormikErrorsObj } from 'core/utils/transform';
import { ValidationError } from 'express-validator';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import BoxedLayout from '../../core/components/BoxedLayout';
import { useSnackbar } from '../../core/contexts/SnackbarProvider';
import { useAuth } from '../contexts/AuthProvider';

const Login = () => {
  const { isLoggingIn, login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const schema = yup.object({
    email: yup
      .string()
      .required(t('common.validations.required'))
      .email(t('common.validations.email')),
    password: yup.string().required(t('common.validations.required')),
  });

  type FormData = yup.InferType<typeof schema>;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: (values: FormData) => handleLogin(values.email, values.password),
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate('/dashboard');
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
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={false}
        md={7}
        sx={{
          backgroundImage: 'url(./images/startup.svg)',
          backgroundRepeat: 'no-repeat',
          bgcolor: 'background.default',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={12} md={5} component={Paper} square>
        <BoxedLayout>
          <Typography component="h1" variant="h5">
            {t('auth.login.title')}
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
              size="small"
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
              size="small"
            />
            <LoadingButton
              type="submit"
              fullWidth
              loading={isLoggingIn}
              variant="contained"
            >
              {t('auth.login.submit')}
            </LoadingButton>
            <Typography
              component="h1"
              variant="body1"
              textAlign="center"
              sx={{ mt: 3 }}
            >
              {t('auth.login.noAccount')}
              <MuiLink
                component={Link}
                to="/register"
                sx={{ ml: 1, fontWeight: 'bold', textDecoration: 'none' }}
              >
                {t('auth.login.register')}
              </MuiLink>
            </Typography>
          </Box>
        </BoxedLayout>
      </Grid>
    </Grid>
  );
};

export default Login;

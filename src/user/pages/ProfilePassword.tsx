import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import passwordRegex from 'auth/types/passwordRegex';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import { parseValidationErrors } from 'core/utils/parseValidationErrors';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdatePassword } from 'user/hooks/useUpdatePassword';
import * as yup from 'yup';

const ProfilePassword = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { isUpdating, updatePassword } = useUpdatePassword();
  const [passwordChangeStatus, setPasswordChangeStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = yup.object({
    password: yup.string().required(t('common.validations.required')),
    newPassword: yup
      .string()
      .required(t('common.validations.required'))
      .matches(passwordRegex, t('common.validations.password.weak')),
    confirmationPassword: yup
      .string()
      .required(t('common.validations.required'))
      .oneOf([yup.ref('newPassword')], t('common.validations.password.match')),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleUpdatePassword = async (formData: FormData) => {
    try {
      await updatePassword({ ...formData });
      formik.resetForm();
      snackbar.success(t('profile.password.notifications.success'));
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const validationErrors = err.response.data
          .errors as ServerValidationError[];
        formik.setErrors(parseValidationErrors(validationErrors));
        return;
      } else if (err.response && err.response.status === 401) {
        setPasswordChangeStatus(t('auth.login.invalidCredentials'));
        return;
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmationPassword: '',
    },
    validationSchema,
    onSubmit: handleUpdatePassword,
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      onChange={() => setPasswordChangeStatus('')}
      noValidate
    >
      <Card>
        <CardHeader title={t('profile.password.title')} />

        <CardContent sx={{ py: 0 }}>
          <FormHelperText
            error={Boolean(passwordChangeStatus)}
            component="h1"
            sx={{ pt: 0 }}
          >
            <Typography variant="body1" sx={{ pt: 0 }}>
              {passwordChangeStatus}
            </Typography>
          </FormHelperText>
        </CardContent>

        <CardContent>
          <TextField
            required
            fullWidth
            name="password"
            label={t('profile.password.form.password.label')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoFocus
            autoComplete="current-password"
            disabled={isUpdating}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirmation password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            fullWidth
            name="newPassword"
            label={t('profile.password.form.newPassword.label')}
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            autoComplete="new-password"
            disabled={isUpdating}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirmation password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            fullWidth
            name="confirmationPassword"
            label={t('profile.password.form.confirmationPassword.label')}
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmationPassword"
            disabled={isUpdating}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirmation password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>

        <CardActions>
          <LoadingButton type="submit" loading={isUpdating} variant="contained">
            {t('common.update')}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};

export default ProfilePassword;

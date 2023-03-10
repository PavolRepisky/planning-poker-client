import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import passwordRegex from 'auth/types/passwordRegex';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import { transformToFormikErrorsObj } from 'core/utils/transform';
import { ValidationError } from 'express-validator';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useUpdatePassword } from 'user/hooks/useUpdatePassword';
import * as yup from 'yup';

const ProfilePassword = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { authToken } = useAuth();

  const { isUpdating, updatePassword } = useUpdatePassword();

  const schema = yup.object({
    password: yup.string().required(t('common.validations.required')),
    newPassword: yup
      .string()
      .required(t('common.validations.required'))
      .matches(passwordRegex, t('common.validations.password')),
    confirmationPassword: yup
      .string()
      .required(t('common.validations.required'))
      .oneOf([yup.ref('newPassword')], t('common.validations.passwordMatch')),
  });

  type FormData = yup.InferType<typeof schema>;

  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmationPassword: '',
    },
    validationSchema: schema,
    onSubmit: (values) => handleUpdatePassword(values),
  });

  const handleUpdatePassword = async (values: FormData) => {
    try {
      await updatePassword({ ...values, authToken });
      formik.resetForm();
      snackbar.success(t('profile.notifications.passwordChanged'));
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const validationErrors = err.response.data.errors as ValidationError[];
        formik.setErrors(transformToFormikErrorsObj(validationErrors));
        return;
      } else if (err.response && err.response.status === 401) {
        snackbar.error(t('profile.notifications.userUnauthorized'));
        return;
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Card>
        <CardHeader title={t('profile.password.title')} />
        <CardContent>
          <TextField
            required
            fullWidth
            name="password"
            label={t('profile.password.form.current.label')}
            type="password"
            id="password"
            autoFocus
            autoComplete="current-password"
            disabled={isUpdating}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            required
            fullWidth
            name="newPassword"
            label={t('profile.password.form.new.label')}
            type="password"
            id="newPassword"
            disabled={isUpdating}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <TextField
            required
            fullWidth
            name="confirmationPassword"
            label={t('profile.password.form.confirm.label')}
            type="password"
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
            size="small"
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

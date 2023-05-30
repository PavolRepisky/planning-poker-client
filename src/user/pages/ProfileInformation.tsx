import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import config from 'core/config/config';
import ServerValidationError from 'core/types/ServerValidationError';
import { parseValidationErrors } from 'core/utils/parseValidationErrors';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useUpdateName } from 'user/hooks/useUpdateName';
import * as yup from 'yup';
import { useSnackbar } from 'core/contexts/SnackbarProvider';

const ProfileInformation = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { accessToken, userData } = useAuth();
  const { isUpdating, updateName } = useUpdateName(accessToken);

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
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleSubmit = async (formData: FormData) => {
    const { firstName, lastName } = formData;

    try {
      await updateName({ firstName, lastName });
      snackbar.success(t('profile.info.notifications.success'));
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
      firstName: userData ? userData.firstName : '',
      lastName: userData ? userData.lastName : '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Card>
        <CardHeader title={t('profile.info.title')} />

        <CardContent>
          <TextField
            required
            fullWidth
            id="firstName"
            label={t('profile.info.form.firstName.label')}
            name="firstName"
            type="text"
            autoComplete="given-name"
            autoFocus
            disabled={isUpdating}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />

          <TextField
            required
            fullWidth
            id="lastName"
            label={t('profile.info.form.lastName.label')}
            name="lastName"
            type="text"
            autoComplete="family-name"
            disabled={isUpdating}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </CardContent>

        <CardActions>
          <Button onClick={() => formik.resetForm()}>
            {t('common.reset')}
          </Button>

          <LoadingButton loading={isUpdating} type="submit" variant="contained">
            {t('common.update')}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};

export default ProfileInformation;

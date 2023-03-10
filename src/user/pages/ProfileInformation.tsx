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
import { transformToFormikErrorsObj } from 'core/utils/transform';
import { ValidationError } from 'express-validator';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useUpdateName } from 'user/hooks/useUpdateName';
import * as yup from 'yup';
import { useSnackbar } from '../../core/contexts/SnackbarProvider';

const ProfileInformation = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { authToken, userInfo } = useAuth();
  const { isUpdating, updateName } = useUpdateName(authToken);

  const formik = useFormik({
    initialValues: {
      firstName: userInfo ? userInfo.firstName : '',
      lastName: userInfo ? userInfo.lastName : '',
      email: userInfo ? userInfo.email : '',
    },
    validationSchema: yup.object({
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
    }),
    onSubmit: (values) => handleSubmit(values),
  });

  const handleSubmit = async ({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    try {
      await updateName({ firstName, lastName, authToken });
      snackbar.success(t('profile.notifications.informationUpdated'));
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
            size="small"
          />
          <TextField
            required
            fullWidth
            id="lastName"
            label={t('profile.info.form.lastName.label')}
            name="lastName"
            type="text"
            autoComplete="given-name"
            disabled={isUpdating}
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
            label={t('profile.info.form.email.label')}
            name="email"
            type="email"
            autoComplete="email"
            disabled={true}
            value={userInfo?.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            size="small"
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

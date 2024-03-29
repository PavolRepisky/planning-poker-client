import { Box, Button, TextField } from '@mui/material';
import config from 'core/config/config';
import { useFormik } from 'formik';
import { t } from 'i18next';
import * as yup from 'yup';

interface GuestFormProps {
  onSubmit: (formData: { firstName: string; lastName: string }) => void;
}

const GuestForm = ({ onSubmit }: GuestFormProps) => {
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

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
    },
    validationSchema,
    onSubmit,
  });

  return (
    <Box
      component="form"
      marginTop={3}
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="firstName"
        label={t('session.join.guest.form.firstName.label')}
        name="firstName"
        type="text"
        autoFocus
        value={formik.values.firstName}
        onChange={formik.handleChange}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
      />
      <TextField
        required
        fullWidth
        id="lastName"
        label={t('session.join.guest.form.lastName.label')}
        name="lastName"
        type="text"
        autoFocus
        value={formik.values.lastName}
        onChange={formik.handleChange}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        {t('session.join.guest.form.submit')}
      </Button>
    </Box>
  );
};

export default GuestForm;

import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import config from 'core/config/config';
import { transformToFormikErrorsObj } from 'core/utils/transform';
import { ValidationError } from 'express-validator';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

type CreateVotingDialogProps = {
  onCreate: (votingData: {
    name: string;
    description?: string;
  }) => Promise<ValidationError[]>;
  onClose: () => void;
  open: boolean;
  processing: boolean;
};

const CreateVotingDialog = ({
  onCreate,
  onClose,
  open,
  processing,
}: CreateVotingDialogProps) => {
  const { t } = useTranslation();

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('common.validations.required'))
      .max(config.maxNameLength, t('common.validations.string.max')),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleSubmit = async (formData: FormData) => {
    const serverErrors = await onCreate(formData);
    formik.setErrors(transformToFormikErrorsObj(serverErrors));
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="create-voting-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="create-voting-dialog-title">
          {t('session.dialog.createVoting.title')}
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('session.dialog.createVoting.form.name.label')}
            name="name"
            type="text"
            autoFocus
            disabled={processing}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label={t('session.dialog.createVoting.form.description.label')}
            name="description"
            type="text"
            autoFocus
            disabled={processing}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>

          <LoadingButton loading={processing} type="submit" variant="contained">
            {t('session.dialog.createVoting.form.submit')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateVotingDialog;

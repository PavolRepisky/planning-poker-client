import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { t } from 'i18next';
import * as yup from 'yup';

type NewVotingDialogProps = {
  onClose: () => void;
  open: boolean;
  processing: boolean;
};

const NewVotingDialog = ({
  open,
  onClose,
  processing,
}: NewVotingDialogProps) => {
  const validationSchema = yup.object({
    name: yup
      .string()
      .required(t('common.validations.required'))
      .min(3, t('common.validations.minChar', { size: 3 }))
      .max(50, t('common.validations.maxChar', { size: 50 })),
    description: yup.string(),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleSubmit = (values: FormData) => {};

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="matrix-dialog-title"
      maxWidth="lg"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="matrix-dialog-title">
          {t('session.voting.createNewVoting')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('session.voting.form.name.label')}
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
            required
            fullWidth
            id="description"
            label={t('session.voting.form.description.label')}
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
            {t('session.voting.create')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewVotingDialog;

import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import config from 'core/config/config';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import { parseValidationErrors } from 'core/utils/parseValidationErrors';
import { useFormik } from 'formik';
import Matrix from 'matrix/types/MatrixData';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useCreateSession } from 'session/hooks/useCreateSession';
import * as yup from 'yup';

type CreateSessionDialogProps = {
  onClose: () => void;
  open: boolean;
  matrices: Matrix[];
};

const CreateSessionDialog = ({
  onClose,
  open,
  matrices,
}: CreateSessionDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const { createSession, isCreating } = useCreateSession();
  const navigate = useNavigate();

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('common.validations.required'))
      .max(config.maxNameLength, t('common.validations.string.max')),
    matrixId: yup
      .number()
      .typeError(t('common.validations.type'))
      .required(t('common.validations.required'))
      .min(1, t('common.validations.required')),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleSubmit = async (formData: FormData) => {
    try {
      const createdSession = await createSession(formData);
      snackbar.success(t('session.dialog.create.notifications.success'));
      onClose();
      navigate(`/sessions/${createdSession.hashId}`);
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const validationErrors = err.response.data
          .errors as ServerValidationError[];
        formik.setErrors(parseValidationErrors(validationErrors));
        return;
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
      onClose();
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      matrixId: -1,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="create-session-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="create-session-dialog-title">
          {t('session.dialog.create.title')}
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('session.dialog.create.form.name.label')}
            name="name"
            type="text"
            autoFocus
            disabled={isCreating}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            margin="normal"
            required
            id="matrixId"
            disabled={isCreating}
            fullWidth
            select
            label={t('session.dialog.create.form.matrixId.label')}
            name="matrixId"
            value={formik.values.matrixId}
            onChange={formik.handleChange}
            error={formik.touched.matrixId && Boolean(formik.errors.matrixId)}
            helperText={formik.touched.matrixId && formik.errors.matrixId}
          >
            {matrices.map((matrix) => (
              <MenuItem key={matrix.id} value={matrix.id}>
                {matrix.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>

          <LoadingButton loading={isCreating} type="submit" variant="contained">
            {t('session.dialog.create.form.submit')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateSessionDialog;

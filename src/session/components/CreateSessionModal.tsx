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
import { useAuth } from 'auth/contexts/AuthProvider';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import { transformToFormikErrorsObj } from 'core/utils/transform';
import { ValidationError } from 'express-validator';
import { useFormik } from 'formik';
import Matrix from 'matrix/types/MatrixData';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useCreateSession } from 'session/hooks/useCreateSession';
import SessionData from 'session/types/SessionData';
import * as yup from 'yup';

type CreateSessionModalProps = {
  onClose: () => void;
  open: boolean;
  matrices: Matrix[];
};

const CreateSessionModal = ({
  onClose,
  open,
  matrices,
}: CreateSessionModalProps) => {
  const { t } = useTranslation();
  const { authToken } = useAuth();
  const snackbar = useSnackbar();
  const { createSession, isCreating } = useCreateSession();
  const navigate = useNavigate();

  const handleSubmit = async (session: Partial<SessionData>) => {
    try {
      const createdSession = await createSession({
        session,
        authToken,
      });
      snackbar.success(t('session.notifications.sessionCreated'));
      onClose();
      navigate(`/sessions/${createdSession.hashId}`);
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const serverValidationErrors = err.response.data
          .errors as ValidationError[];
        formik.setErrors(transformToFormikErrorsObj(serverValidationErrors));
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
    validationSchema: yup.object({
      name: yup
        .string()
        .required(t('common.validations.required'))
        .min(3, t('common.validations.minChar', { size: 3 }))
        .max(50, t('common.validations.maxChar', { size: 50 })),
      matrixId: yup
        .number()
        .typeError(t('common.validations.integer'))
        .required(t('common.validations.required'))
        .min(1, t('common.validations.required')),
    }),
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
          {t('session.modal.create.title')}
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('session.modal.create.form.name.label')}
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
            label={t('session.modal.create.form.matrixId.label')}
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
            {t('session.modal.create.form.submit')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateSessionModal;

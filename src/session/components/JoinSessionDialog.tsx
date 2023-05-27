import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useJoinSession } from 'session/hooks/useJoinSession';
import * as yup from 'yup';

type JoinSessionDialogProps = {
  onClose: () => void;
  open: boolean;
};

const JoinSessionDialog = ({ onClose, open }: JoinSessionDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { isJoining, joinSession } = useJoinSession();

  const validationSchema = yup.object({
    hashId: yup.string().trim().required(t('common.validations.required')),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleSubmit = async (formData: FormData): Promise<void> => {
    try {
      const data = await joinSession(formData.hashId);
      console.log('ddata=', data)
      navigate(`/sessions/${data.session.hashId}`);
    } catch (err: any) {
      if (err.response?.status === 404) {
        formik.setFieldError('hashId', t('common.validations.session.id'));
        return;
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
      onClose();
    }
  };

  const formik = useFormik({
    initialValues: {
      hashId: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="join-session-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="join-session-dialog-title">
          {t('session.dialog.join.title')}
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="hashId"
            label={t('session.dialog.join.form.hashId.label')}
            name="hashId"
            type="text"
            autoFocus
            disabled={false}
            value={formik.values.hashId}
            onChange={formik.handleChange}
            error={formik.touched.hashId && Boolean(formik.errors.hashId)}
            helperText={formik.touched.hashId && formik.errors.hashId}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>

          <LoadingButton loading={isJoining} type="submit" variant="contained">
            {t('session.dialog.join.form.submit')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JoinSessionDialog;

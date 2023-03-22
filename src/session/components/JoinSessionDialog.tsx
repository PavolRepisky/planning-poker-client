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
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

type JoinSessionDialogProps = {
  onJoin: (hashId: string) => void;
  onClose: () => void;
  open: boolean;
  processing: boolean;
};

const JoinSessionDialog = ({
  onJoin,
  onClose,
  open,
  processing,
}: JoinSessionDialogProps) => {
  const { t } = useTranslation();

  const handleSubmit = ({ hashId }: { hashId: string }) => {
    onJoin(hashId);
  };

  const formik = useFormik({
    initialValues: {
      hashId: '',
    },
    validationSchema: yup.object({
      hashId: yup.string().required(t('common.validations.required')),
    }),
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
          {t('session.join.title')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="hashId"
            label={t('session.join.form.hashId.label')}
            name="hashId"
            type="text"
            autoFocus
            disabled={processing}
            value={formik.values.hashId}
            onChange={formik.handleChange}
            error={formik.touched.hashId && Boolean(formik.errors.hashId)}
            helperText={formik.touched.hashId && formik.errors.hashId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {t('session.join.form.submit')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JoinSessionDialog;

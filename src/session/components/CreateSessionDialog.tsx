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
import { transformToFormikErrorsObj } from 'core/utils/transform';
import { ValidationError } from 'express-validator';
import { useFormik } from 'formik';
import Matrix from 'matrix/types/MatrixData';
import { useTranslation } from 'react-i18next';
import Session from 'session/types/Session';
import * as yup from 'yup';

type CreateSessionDialogProps = {
  onCreate: (session: Partial<Session>) => Promise<ValidationError[]>;
  onClose: () => void;
  open: boolean;
  processing: boolean;
  matrices: Matrix[];
};

const CreateSessionDialog = ({
  onCreate,
  onClose,
  open,
  processing,
  matrices,
}: CreateSessionDialogProps) => {
  const { t } = useTranslation();

  const handleSubmit = async (values: Partial<Session>) => {
    const serverErrors = await onCreate(values);
    formik.setErrors(transformToFormikErrorsObj(serverErrors));
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      matrixId: matrices ? matrices[0].id : undefined,
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
        .required(t('common.validations.required')),
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
          {t('session.create.title')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('session.create.form.name.label')}
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
            id="matrixId"
            disabled={processing}
            fullWidth
            select
            label={t('session.create.form.matrixId.label')}
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
          <LoadingButton loading={processing} type="submit" variant="contained">
            {t('session.create.form.submit')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateSessionDialog;

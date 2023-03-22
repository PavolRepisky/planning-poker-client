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
import MatrixData from 'matrix/types/MatrixData';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ValuesGrid from './ValuesGrid';

type MatrixDialogProps = {
  onCreate: (matrix: Partial<MatrixData>) => void;
  onClose: () => void;
  onUpdate: (matrix: MatrixData) => void;
  open: boolean;
  processing: boolean;
  matrix?: MatrixData;
};

const MatrixDialog = ({
  onCreate,
  onClose,
  onUpdate,
  open,
  processing,
  matrix,
}: MatrixDialogProps) => {
  const { t } = useTranslation();
  const editMode = Boolean(matrix && matrix.id);

  const handleSubmit = (values: Partial<MatrixData>) => {
    const matrixValues = values.values;
    const rows = matrixValues ? matrixValues.length : 0;
    const columns = matrixValues ? matrixValues[0].length : 0;

    if (matrix && matrix.id) {
      onUpdate({ ...values, id: matrix.id, rows, columns } as MatrixData);
    } else {
      onCreate({ ...values, rows, columns });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: matrix ? matrix.name : '',
      values: matrix
        ? matrix.values
        : [
            ['', ''],
            ['', ''],
          ],
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .required(t('common.validations.required'))
        .min(3, t('common.validations.minChar', { size: 3 }))
        .max(50, t('common.validations.maxChar', { size: 50 })),
      values: yup
        .array()
        .of(
          yup
            .array()
            .of(
              yup
                .string()
                .trim()
                .strict(true)
                .required(t('common.validations.nonEmptyValues'))
            )
            .min(1, t('common.validations.required'))
        )
        .min(1, t('common.validations.required')),
    }),
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
          {editMode
            ? t('matrixManagement.modal.edit.title')
            : t('matrixManagement.modal.add.title')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('matrixManagement.form.name.label')}
            name="name"
            type="text"
            autoFocus
            disabled={processing}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            size="small"
          />
          <ValuesGrid formik={formik} processing={processing} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t('matrixManagement.modal.edit.action')
              : t('matrixManagement.modal.add.action')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MatrixDialog;

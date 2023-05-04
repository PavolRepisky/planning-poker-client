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
import { useFormik } from 'formik';
import ValuesGrid from 'matrix/components/ValuesGrid';
import MatrixData from 'matrix/types/MatrixData';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

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

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('common.validations.required'))
      .max(config.maxNameLength, t('common.validations.string.max')),
    values: yup
      .array()
      .typeError(t('common.validations.type'))
      .required(t('common.validations.required'))
      .test('2d-array', t('common.validations.type'), function (value) {
        return (
          Array.isArray(value) &&
          value.length >= config.matrixMinRows &&
          value.length <= config.matrixMaxRows &&
          value.every(
            (row) =>
              Array.isArray(row) &&
              row.length >= config.matrixMinColumns &&
              row.length <= config.matrixMaxColumns
          )
        );
      })
      .test('non-empty-values', t('common.validations.required'), (value) => {
        if (Array.isArray(value)) {
          return value.every(
            (row) =>
              Array.isArray(row) &&
              row.every(
                (item: string | undefined) => item && item.trim().length > 0
              )
          );
        }
      })
      .test(
        'unique-values',
        t('common.validations.matrix.uniqueValues'),
        (value) => {
          if (Array.isArray(value)) {
            const flattenValues = value.flat();
            return new Set(flattenValues).size === flattenValues.length;
          }
          return true;
        }
      ),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const handleSubmit = (formData: FormData) => {
    const matrixValues = formData.values;
    const rows = matrixValues.length;
    const columns = matrixValues.length > 0 ? matrixValues[0].length : 0;

    if (matrix && matrix.id) {
      onUpdate({ ...formData, id: matrix.id, rows, columns } as MatrixData);
    } else {
      onCreate({ ...formData, rows, columns });
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
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="matrix-dialog-title"
      maxWidth="md"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="matrix-dialog-title">
          {editMode
            ? t('matrix.modal.edit.title')
            : t('matrix.modal.add.title')}
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('matrix.form.name.label')}
            name="name"
            type="text"
            autoFocus
            disabled={processing}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <ValuesGrid formik={formik} processing={processing} />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t('matrix.modal.edit.action')
              : t('matrix.modal.add.action')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MatrixDialog;

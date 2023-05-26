import {
  Box,
  Button,
  ButtonGroup,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import config from 'core/config/config';
import { useTranslation } from 'react-i18next';

interface ValuesGridProps {
  formik: any;
  processing: boolean;
}

const ValuesGrid = ({ processing, formik }: ValuesGridProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const values: string[][] = formik.values.values;

  const handleValueChange = (
    row: number,
    column: number,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    values[row][column] = event.target.value.trim();
    formik.setFieldValue('values', values);
  };

  const handleAddRow = () => {
    const columnsCount = values[0].length;
    values.push(new Array(columnsCount).fill(''));
    formik.setFieldValue('values', values);
  };

  const handleRemoveRow = () => {
    values.pop();
    formik.setFieldValue('values', values);
  };

  const handleAddColumn = () => {
    const newValues = values.map((row: string[]) => {
      const newRow = row;
      newRow.push('');
      return newRow;
    });
    formik.setFieldValue('values', newValues);
  };

  const handleRemoveColumn = () => {
    const newValues = formik.values.values.map((row: string[]) => {
      const newRow = row;
      newRow.pop();
      return newRow;
    });
    formik.setFieldValue('values', newValues);
  };

  return (
    <Box>
      <Box sx={{ ml: 2, mb: 1 }}>
        <Typography component="p" color={theme.palette.text.secondary}>
          {t('matrix.form.values.label')} *
        </Typography>
        <FormHelperText
          error={formik.touched.values && Boolean(formik.errors.values)}
        >
          {formik.touched.values && formik.errors.values}
        </FormHelperText>
      </Box>

      <Grid
        container
        spacing={{ xs: 1, md: 2 }}
        minWidth="sm"
        sx={{ overflowX: 'auto', minWidth: 500 }}
      >
        <Grid item xs>
          <Grid container spacing={1}>
            {values.map((row, idx) => {
              return (
                <Grid key={idx} item xs={12}>
                  <Grid container spacing={{ xs: 1, md: 2 }}>
                    {row.map((value, idx2) => {
                      return (
                        <Grid key={idx2} item xs sx={{ minWidth: 0 }}>
                          <TextField
                            required
                            fullWidth
                            value={value}
                            type="text"
                            disabled={processing}
                            onChange={(event) =>
                              handleValueChange(idx, idx2, event)
                            }
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                onClick={handleAddRow}
                disabled={values.length >= config.matrixMaxRows}
                sx={{
                  borderBottom: 'none',
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                data-testid="add-row-button"
              >
                +
              </Button>
              <Button
                size="small"
                fullWidth
                variant="outlined"
                onClick={handleRemoveRow}
                disabled={values.length <= config.matrixMinRows}
                sx={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
                data-testid="remove-row-button"
              >
                -
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs="auto"
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 17,
          }}
        >
          <ButtonGroup size="small">
            <Button
              onClick={handleAddColumn}
              disabled={values[0].length >= config.matrixMaxColumns}
              data-testid="add-column-button"
            >
              +
            </Button>
            <Button
              onClick={handleRemoveColumn}
              disabled={values[0].length <= config.matrixMinColumns}
              data-testid="remove-column-button"
            >
              -
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ValuesGrid;

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

interface ValuesGridProps {
  formik: any;
  processing: boolean;
}

const ValuesGrid = ({ processing, formik }: ValuesGridProps) => {
  const theme = useTheme();

  const handleValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const indexes = event.target.name.split('=')[1];
    const idx1 = +indexes.split(',')[0];
    const idx2 = +indexes.split(',')[1];

    const newValues = formik.values.values;
    newValues[idx1][idx2] = event.target.value;

    formik.setFieldValue('values', newValues);
  };

  const handleAddRow = () => {
    const newValues = formik.values.values;
    const columns = newValues ? newValues[0].length : 0;
    const rows = newValues.length;
    newValues.push(new Array(columns).fill(''));
    formik.setFieldValue('values', newValues);
    formik.setFieldValue('rows', rows + 1);
  };

  const handleRemoveRow = () => {
    const newValues = formik.values.values;
    const rows = newValues.length;
    newValues.pop();
    formik.setFieldValue('values', newValues);
    formik.setFieldValue('rows', rows - 1);
  };

  const handleAddColumn = () => {
    const newValues = formik.values.values.map((row: string[]) => {
      const newRow = row;
      newRow.push('');
      return newRow;
    });
    const columns = newValues ? newValues[0].length : 0;
    formik.setFieldValue('values', newValues);
    formik.setFieldValue('columns', columns);
  };

  const handleRemoveColumn = () => {
    const newValues = formik.values.values.map((row: string[]) => {
      const newRow = row;
      newRow.pop();
      return newRow;
    });
    const columns = newValues ? newValues[0].length : 0;
    formik.setFieldValue('values', newValues);
    formik.setFieldValue('columns', columns - 1);
  };

  const gridRows: any = [];
  formik.values.values.forEach((row: string[], idx: number) => {
    const items = row.map((item, idx2) => (
      <Grid item xs>
        <TextField
          key={`value=${idx},${idx2}`}
          required
          fullWidth
          name={`value=${idx},${idx2}`}
          value={item}
          type="text"
          disabled={processing}
          onChange={handleValueChange}
          size="small"
        />
      </Grid>
    ));
    gridRows.push(
      <Grid container spacing={2} className="values-row" key={`row=${idx}`}>
        {items}
      </Grid>
    );
  });

  return (
    <Box>
      <Box sx={{ pl: 1, mb: 1 }}>
        <Typography component="p" color={theme.palette.text.secondary}>
          Values *
        </Typography>
        <FormHelperText
          error={formik.touched.values && Boolean(formik.errors.values)}
        >
          {formik.touched.values && formik.errors.values}
        </FormHelperText>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs>
          {gridRows}

          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={handleAddRow}
            sx={{
              borderBottom: 'none',
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            +
          </Button>
          <Button
            size="small"
            fullWidth
            variant="outlined"
            onClick={handleRemoveRow}
            disabled={
              formik.values.values ? formik.values.values.length <= 1 : false
            }
            sx={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
          >
            -fromik.values
          </Button>
        </Grid>
        <Grid
          item
          xs="auto"
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 13,
          }}
        >
          <ButtonGroup size="small" aria-label="small outlined button group">
            <Button onClick={handleAddColumn}>+</Button>
            <Button
              onClick={handleRemoveColumn}
              disabled={
                formik.values.values
                  ? formik.values.values[0].length <= 1
                  : false
              }
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

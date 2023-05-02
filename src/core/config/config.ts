const config = {
  maxNameLength: !Number.isNaN(Number(process.env.REACT_APP_MAX_NAME_LENGTH))
    ? Number(process.env.REACT_APP_MAX_NAME_LENGTH)
    : 50,

  matrixMaxRows: !Number.isNaN(Number(process.env.REACT_APP_MATRIX_MAX_ROWS))
    ? Number(process.env.REACT_APP_MATRIX_MAX_ROWS)
    : 50,

  matrixMinRows: !Number.isNaN(Number(process.env.REACT_APP_MATRIX_MIN_ROWS))
    ? Number(process.env.REACT_APP_MATRIX_MIN_ROWS)
    : 50,
  matrixMaxColumns: !Number.isNaN(
    Number(process.env.REACT_APP_MATRIX_MAX_COLUMNS)
  )
    ? Number(process.env.REACT_APP_MATRIX_MAX_COLUMNS)
    : 50,

  matrixMinColumns: !Number.isNaN(
    Number(process.env.REACT_APP_MATRIX_MIN_COLUMNS)
  )
    ? Number(process.env.REACT_APP_MATRIX_MIN_COLUMNS)
    : 50,

  origin: process.env.REACT_APP_ORIGIN || 'http://localhost:3000',
};

export default config;

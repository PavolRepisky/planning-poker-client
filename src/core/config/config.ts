const config = {
  maxNameLength: !Number.isNaN(Number(process.env.REACT_APP_MAX_NAME_LENGTH))
    ? Number(process.env.REACT_APP_MAX_NAME_LENGTH)
    : 50,

  matrixMaxRows: !Number.isNaN(Number(process.env.REACT_APP_MATRIX_MAX_ROWS))
    ? Number(process.env.REACT_APP_MATRIX_MAX_ROWS)
    : 6,

  matrixMinRows: !Number.isNaN(Number(process.env.REACT_APP_MATRIX_MIN_ROWS))
    ? Number(process.env.REACT_APP_MATRIX_MIN_ROWS)
    : 1,
  matrixMaxColumns: !Number.isNaN(
    Number(process.env.REACT_APP_MATRIX_MAX_COLUMNS)
  )
    ? Number(process.env.REACT_APP_MATRIX_MAX_COLUMNS)
    : 6,

  matrixMinColumns: !Number.isNaN(
    Number(process.env.REACT_APP_MATRIX_MIN_COLUMNS)
  )
    ? Number(process.env.REACT_APP_MATRIX_MIN_COLUMNS)
    : 1,

  origin: process.env.REACT_APP_ORIGIN || 'http://localhost:3000',
  accessTokenKey: 'accessToken',
};

export default config;

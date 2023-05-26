interface ServerValidationError {
  path: string | undefined;
  location: string | undefined;
  value: string | string[][];
  message: string;
}

export default ServerValidationError;

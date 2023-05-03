import ServerValidationError from 'core/types/ServerValidationError';

export const parseValidationErrors = (errors: ServerValidationError[]) => {
  const result: Record<string, string> = {};

  errors.forEach((error) => {
    result[`${error.path}`] = error.message;
  });
  return result;
};

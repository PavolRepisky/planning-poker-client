import { ValidationError } from 'express-validator';
export const transformToFormikErrorsObj = (errors: ValidationError[]) => {
  const result: Record<string, string> = {};

  errors.forEach((error) => {
    result[`${error.param}`] = error.msg;
  });
  return result;
};

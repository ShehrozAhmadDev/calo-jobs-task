import { CustomHelpers } from 'joi';

export const jobIdValidator = (value: string, helpers: CustomHelpers) => {
  const jobIdRegex = /^job_\d+$/;
  if (!jobIdRegex.test(value)) {
    return helpers.message({ custom: '"{{#label}}" must be a valid job ID in the format "job_<timestamp>"' });
  }
  return value;
};

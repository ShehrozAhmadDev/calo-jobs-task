import Joi from 'joi';
import { jobIdValidator } from '../validate/custom.validation';
/**
 * Validation for creating a job
 */
export const createJob = {
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(50),
  }),
};

/**
 * Validation for fetching all jobs
 */
export const getAllJobs = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'resolved').optional(),
    sortBy: Joi.string().optional(),
    limit: Joi.number().integer().min(1).optional(),
    page: Joi.number().integer().min(1).optional(),
  }),
};

/**
 * Validation for fetching a job by ID
 */
export const getJobById = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(jobIdValidator).required(),
  }),
};

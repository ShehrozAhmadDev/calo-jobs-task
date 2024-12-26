import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { createJob, getAllJobs, getJobById, subscribeToJobUpdates } from './job.service';

/**
 * Handles the creation of a new job.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const createJobHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const newJob = createJob(name);
  res.status(201).json({ id: newJob.id, name: newJob.name });
});

/**
 * Handles fetching all jobs.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getAllJobsHandler = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const jobs = getAllJobs();
  res.status(200).json(jobs);
});

/**
 * Handles fetching a specific job by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getJobByIdHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const jobId = req.params['jobId'];
  const job = getJobById(jobId || '');
  res.status(200).json(job);
});

/**
 * Handles server-sent events for job updates.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const jobUpdatesHandler = catchAsync((req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  subscribeToJobUpdates((job) => {
    res.write(`data: ${JSON.stringify(job)}\n\n`);
  });

  req.on('close', () => {
    console.log('Client disconnected');
  });
});

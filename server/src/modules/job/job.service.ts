// src/services/job/job.service.ts

import { Job } from './job.interface';
import { readJobs, writeJobs } from './job.utils';
import { ApiError } from '../../config/errors';
import httpStatus from 'http-status';
import config from '../../config/config';
import { Worker } from 'worker_threads';
import path from 'path';

interface WorkerResult {
  status: 'resolved' | 'failed';
  result: string | null;
  resolvedAt: Date;
}

let jobSubscribers: Array<(job: Job) => void> = [];

/**
 * Adds a new subscriber to the job updates stream.
 * @param {Function} callback - Callback to call when a job is updated.
 */
export const subscribeToJobUpdates = (callback: (job: Job) => void): void => {
  jobSubscribers.push(callback);
};

/**
 * Notifies all subscribers about the latest job update.
 * @param {Job} job - The updated job object.
 */
export const notifySubscribers = (job: Job): void => {
  jobSubscribers.forEach((callback) => callback(job));
};

/**
 * Creates a new job with a unique ID and an initial status of "pending."
 * @param {string} jobName - name of job
 * @returns {Job} The newly created job object.
 */
export const createJob = (jobName: string): Job => {
  if (!jobName) throw new ApiError(400, 'Job name is required');

  const jobs = readJobs();
  const newJob: Job = {
    id: `job_${Date.now().toString()}`,
    name: jobName,
    status: 'pending',
    result: null,
    createdAt: new Date(),
  };
  jobs.push(newJob);
  writeJobs(jobs);
  processJob(newJob.id);
  return newJob;
};

/**
 * Simulates processing a job by adding a random delay before resolving it.
 * Fetches a random photo from Unsplash API upon completion.
 * @param {string} jobId - The ID of the job to process.
 */
export const processJob = (jobId: string): void => {
  const worker = new Worker(path.resolve(__dirname, './job.worker.ts'), {
    execArgv: ['-r', 'ts-node/register'],
    workerData: {
      jobId,
      unsplashKey: config.unsplash_key,
    },
  });

  worker.on('message', (message: WorkerResult) => {
    const { status, result, resolvedAt } = message;
    const jobs: Job[] = readJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);

    if (jobIndex === -1) {
      throw new Error(`Job with ID ${jobId} not found`);
    }

    const job = jobs[jobIndex]!;
    job.status = status;
    job.result = result;
    job.resolvedAt = new Date(resolvedAt);
    writeJobs(jobs);
    notifySubscribers(job);
  });

  worker.on('error', (error: Error) => {
    console.error(`Worker error for job ${jobId}:`, error);
    const jobs: Job[] = readJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);

    if (jobIndex === -1) {
      throw new Error(`Job with ID ${jobId} not found`);
    }

    const job = jobs[jobIndex]!;
    job.status = 'failed';
    job.result = null;
    job.resolvedAt = new Date();
    writeJobs(jobs);

    notifySubscribers(job);
  });

  worker.on('exit', (code: number) => {
    if (code !== 0) {
      console.error(`Worker for job ${jobId} exited with code ${code}`);
    }
  });
};

/**
 * Fetches all jobs from the data file.
 * @returns {Job[]} Array of job objects.
 */
export const getAllJobs = (): Job[] => {
  const jobs = readJobs();
  return jobs.map((job) => ({
    ...job,
    result: job.status === 'resolved' ? job.result : null,
  }));
};

/**
 * Fetches a specific job by its ID.
 * @param {string} jobId - The ID of the job to retrieve.
 * @returns {Job} The job object if found.
 */
export const getJobById = (jobId: string): Job => {
  const jobs = readJobs();
  const job = jobs.find((job) => job.id === jobId);
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, `Job with ID ${jobId} not found`);
  return job;
};

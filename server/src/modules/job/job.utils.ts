import fs from 'fs';
import path from 'path';
import { Job } from './job.interface';
import { ApiError } from '../../config/errors';

const jobsFilePath: string = path.join(process.cwd(), 'data', 'jobs.json');

/**
 * Reads the jobs data from the jobs.json file.
 * Creates the file if it does not exist.
 * @returns {Job[]} Array of job objects.
 */
export const readJobs = (): Job[] => {
  try {
    if (!fs.existsSync(jobsFilePath)) {
      const dirPath = path.dirname(jobsFilePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(jobsFilePath, JSON.stringify([]), 'utf8');
    }

    const data = fs.readFileSync(jobsFilePath, 'utf8');
    return JSON.parse(data) as Job[];
  } catch (error) {
    throw new ApiError(500, 'Failed to read jobs file');
  }
};

/**
 * Writes the given jobs data to the jobs.json file.
 * @param {Job[]} jobs - Array of job objects to be saved.
 */
export const writeJobs = (jobs: Job[]): void => {
  try {
    fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2));
  } catch (error) {
    throw new ApiError(500, 'Failed to write jobs file');
  }
};

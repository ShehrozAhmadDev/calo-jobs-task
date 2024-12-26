import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { createJob, getAllJobs, getJobById } from '../../modules/job/job.validation';
import { createJobHandler, getAllJobsHandler, getJobByIdHandler, jobUpdatesHandler } from '../../modules/job/job.controller';

const router: Router = express.Router();

router.route('/').post(validate(createJob), createJobHandler).get(validate(getAllJobs), getAllJobsHandler);
router.route('/updates').get(jobUpdatesHandler);
router.route('/:jobId').get(validate(getJobById), getJobByIdHandler);

export default router;

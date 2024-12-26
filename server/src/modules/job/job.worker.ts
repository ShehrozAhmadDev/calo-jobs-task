import { parentPort, workerData } from 'worker_threads';
import axios from 'axios';
import { WorkerData, WorkerResult } from './job.interface';

const { jobId, unsplashKey } = workerData as WorkerData;

const processJob = async (jobId: string): Promise<void> => {
  try {
    console.log(`Processing job with ID: ${jobId}`);

    const delay = Math.floor((Math.random() * 60) / 5 + 1) * 5000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: { query: 'food' },
      headers: {
        Authorization: `Client-ID ${unsplashKey}`,
      },
    });

    const result: WorkerResult = {
      status: 'resolved',
      result: response.data.urls.regular,
      resolvedAt: new Date(),
    };

    parentPort?.postMessage(result);
  } catch (error) {
    console.error('Error in worker:', error);
    const result: WorkerResult = {
      status: 'failed',
      result: null,
      resolvedAt: new Date(),
    };
    parentPort?.postMessage(result);
  }
};

processJob(jobId);

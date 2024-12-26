export interface Job {
  id: string;
  name: string;
  status: 'pending' | 'resolved' | 'failed';
  result: string | null;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface WorkerData {
  jobId: string;
  unsplashKey: string;
}

export interface WorkerResult {
  status: 'resolved' | 'failed';
  result: string | null;
  resolvedAt: Date;
}

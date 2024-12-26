export type JobStatus = "pending" | "resolved" | "failed";

export interface Job {
  id: string;
  name: string;
  status: JobStatus;
  result: string;
  createdAt: string;
  resolvedAt?: string;
}

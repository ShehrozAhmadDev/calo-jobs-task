import axios from "axios";
import { Job } from "../types/job";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1";

async function requestHandler<T>(request: Promise<T>): Promise<T> {
  try {
    return await request;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API Error:", error);
    throw error.response?.data || new Error("An unexpected error occurred.");
  }
}

export async function fetchJobs(): Promise<Job[]> {
  return requestHandler(
    axios.get<Job[]>(`${API_BASE_URL}/jobs`).then((res) => res.data)
  );
}

export async function createJob(name: string): Promise<string> {
  return requestHandler(
    axios
      .post<{ id: string }>(`${API_BASE_URL}/jobs`, { name })
      .then((res) => res.data.id)
  );
}

export async function fetchJobById(id: string): Promise<Job> {
  return requestHandler(
    axios.get<Job>(`${API_BASE_URL}/jobs/${id}`).then((res) => res.data)
  );
}

export function subscribeToJobUpdates(
  onUpdate: (job: Job) => void,
  onError: (error: Event) => void
): () => void {
  let eventSource: EventSource | null = null;
  let retryCount = 0;
  const maxRetries = 3; // Max number of retries
  const initialRetryDelay = 2000; // Initial delay in milliseconds (2 seconds)
  const maxRetryDelay = 30000; // Maximum delay in milliseconds (30 seconds)

  function calculateRetryDelay(attempt: number): number {
    return Math.min(initialRetryDelay * 2 ** (attempt - 1), maxRetryDelay);
  }

  function connect() {
    eventSource = new EventSource(`${API_BASE_URL}/jobs/updates`);

    eventSource.onmessage = (event) => {
      const updatedJob = JSON.parse(event.data);
      onUpdate(updatedJob);
      retryCount = 0; // Reset retry count on successful connection
    };

    eventSource.onerror = (error) => {
      if (eventSource?.readyState === EventSource.CLOSED) {
        if (retryCount < maxRetries) {
          retryCount++;
          const delay = calculateRetryDelay(retryCount);

          console.log(
            `Connection lost. Retrying in ${
              delay / 1000
            } seconds... (Attempt ${retryCount}/${maxRetries})`
          );

          setTimeout(connect, delay);
        } else {
          onError(error);
          console.error("Max retries reached. Stopping reconnection attempts.");
        }
      } else {
        onError(error);
      }
    };
  }

  connect();

  return () => {
    if (eventSource) {
      eventSource.close();
    }
  };
}

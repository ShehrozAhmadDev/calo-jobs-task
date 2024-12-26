import { useState, useEffect } from "react";
import { Job } from "@/app/types/job";
import { useToast } from "@/hooks/use-toast";
import {
  fetchJobs,
  createJob,
  fetchJobById,
  subscribeToJobUpdates,
} from "@/app/services";

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllJobs = async () => {
    try {
      setIsLoading(true);
      const fetchedJobs = await fetchJobs();
      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = async (job: Job) => {
    try {
      const updatedJob = await fetchJobById(job.id);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch job details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateJob = async (jobName: string) => {
    try {
      const newJobId = await createJob(jobName);
      toast({
        title: "Success",
        description: `Job created with ID: ${newJobId}`,
      });
      fetchAllJobs();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to create job:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAllJobs();

    const unsubscribe = subscribeToJobUpdates(
      (updatedJob) => {
        setJobs((prevJobs) => {
          const jobIndex = prevJobs.findIndex(
            (job) => job.id === updatedJob.id
          );
          if (jobIndex !== -1) {
            const newJobs = [...prevJobs];
            newJobs[jobIndex] = updatedJob;
            return newJobs;
          }
          return [...prevJobs, updatedJob];
        });

        if (selectedJob && selectedJob.id === updatedJob.id) {
          setSelectedJob(updatedJob);
        }

        toast({
          title: "Job Updated",
          description: `Job ${updatedJob.name} (${updatedJob.id}) has been ${updatedJob.status}`,
        });
      },
      (error) => {
        console.error("EventSource failed:", error);
        toast({
          title: "Connection Error",
          description:
            "Failed to receive job updates. The system will try to reconnect automatically.",
          variant: "destructive",
          duration: 5000,
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    jobs,
    isLoading,
    selectedJob,
    setSelectedJob,
    fetchAllJobs,
    handleRowClick,
    handleCreateJob,
  };
};

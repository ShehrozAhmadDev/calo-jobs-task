"use client";

import { jobTableColumns } from "../components/base/job-table-columns/job-table-columns";
import { DataTable } from "../components/data-table/data-table";
import { JobDetailsModal } from "../components/base/job-details/job-details-modal";
import { CreateJobModal } from "../components/base/create-job/create-job-modal";
import { JobStats } from "../components/base/job-stats/job-stats";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useJobs } from "@/hooks/use-jobs";

export default function JobsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    jobs,
    isLoading,
    selectedJob,
    setSelectedJob,
    handleRowClick,
    handleCreateJob,
  } = useJobs();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Jobs Dashboard</h1>
      <JobStats jobs={jobs} />
      <div className="my-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Jobs</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Job
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center">Loading jobs...</div>
      ) : (
        <DataTable
          columns={jobTableColumns}
          data={jobs}
          meta={{
            onRowClick: handleRowClick,
          }}
        />
      )}
      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateJob={handleCreateJob}
      />
    </div>
  );
}

import { Job } from "@/app/types/job";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobStatsProps {
  jobs: Job[];
}

export function JobStats({ jobs }: JobStatsProps) {
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter((job) => job.status === "resolved").length;
  const pendingJobs = jobs.filter((job) => job.status === "pending").length;
  //const inProgressJobs = jobs.filter(job => job.status === 'in_progress').length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobs}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {completedJobs}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {pendingJobs}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

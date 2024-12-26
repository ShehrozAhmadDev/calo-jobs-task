"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: (jobName: string) => void;
}

export function CreateJobModal({
  isOpen,
  onClose,
  onCreateJob,
}: CreateJobModalProps) {
  const [jobName, setJobName] = useState("");

  const handleCreateJob = () => {
    onCreateJob(jobName);
    setJobName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="job-name" className="text-right">
              Job Name
            </Label>
            <Input
              id="job-name"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateJob}>Create Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

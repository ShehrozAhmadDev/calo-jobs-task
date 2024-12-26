"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Job } from "@/app/types/job";

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailsModal({
  job,
  isOpen,
  onClose,
}: JobDetailsModalProps) {
  if (!job) return null;

  const createdAt = new Date(job.createdAt);
  const resolvedAt = job.resolvedAt ? new Date(job.resolvedAt) : null;
  const timeTaken = resolvedAt
    ? `${Math.floor(
        (resolvedAt.getTime() - createdAt.getTime()) / 60000
      )}m ${Math.floor(
        ((resolvedAt.getTime() - createdAt.getTime()) % 60000) / 1000
      )}s`
    : "In Progress";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{job.name}</DialogTitle>
          <DialogDescription>Job ID: {job.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <span className="font-semibold">Status:</span>
            <Badge
              variant={job.status === "resolved" ? "outline" : "default"}
              className="ml-2"
            >
              {job.status}
            </Badge>
          </div>
          <div>
            <span className="font-semibold">Created At:</span>
            <p>{createdAt.toLocaleString()}</p>
          </div>
          <div>
            <span className="font-semibold">Resolved At:</span>
            <p>{resolvedAt ? resolvedAt.toLocaleString() : "Pending"}</p>
          </div>
          <div>
            <span className="font-semibold">Time Taken:</span>
            <p>{timeTaken}</p>
          </div>
          {job.status === "resolved" && job.result && (
            <div>
              <span className="font-semibold">Result:</span>
              <div className="mt-2 relative aspect-video w-full">
                <Image
                  src={job.result}
                  alt={`Result for ${job.name}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.open(job.result!, "_blank")}
              >
                Open Image <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

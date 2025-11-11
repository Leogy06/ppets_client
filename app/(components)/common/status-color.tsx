import { Status } from "@/types";
import { CircleCheckBig, CircleOff, Clock, OctagonX } from "lucide-react";

export function StatusColor({ status }: { status: Status }) {
  switch (status) {
    case "PENDING":
      return (
        <div className="flex gap-2 text-blue-500 items-center text-xs">
          <Clock size={16} />
          Pending
        </div>
      );
    case "APPROVED":
      return (
        <div className="flex gap-2 text-green-500 items-center text-xs">
          <CircleCheckBig />
          Approved
        </div>
      );
    case "REJECTED":
      return (
        <div className="flex gap-2 text-red-500 items-center text-xs">
          <CircleOff />
          Rejected
        </div>
      );

    case "CANCEL":
      return (
        <div className="flex gap-2 text-orange-500 items-center text-xs">
          <OctagonX />
          Cancel
        </div>
      );

    default:
      return (
        <div className="flex gap-2 text-muted-foreground items-center text-xs">
          Unknown Status
        </div>
      );
  }
}

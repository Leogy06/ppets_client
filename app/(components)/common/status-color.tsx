import { Condition, Status } from "@/types";
import {
  Check,
  CheckCheck,
  CircleCheckBig,
  CircleOff,
  Clock,
  Hammer,
  HeartCrack,
  OctagonX,
  Wrench,
} from "lucide-react";

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

export function ItemConditionColor({ condition }: { condition: Condition }) {
  switch (condition) {
    case "EXCELLENT":
      return (
        <div className="flex gap-2 text-green-500 items-center text-xs">
          <CheckCheck size={16} />
          Excellent
        </div>
      );
    case "GOOD":
      return (
        <div className="flex gap-2 text-blue-500 items-center text-xs">
          <Check size={16} />
          Good
        </div>
      );
    case "POOR":
      return (
        <div className="flex gap-2 text-purple-500 items-center text-xs">
          <HeartCrack size={16} />
          Poor
        </div>
      );
    case "REPAIR":
      return (
        <div className="flex gap-2 text-red-500 items-center text-xs">
          <Wrench size={16} />
          Repair
        </div>
      );
    case "MAINTENANCE":
      return (
        <div className="flex gap-2 text-yellow-500 items-center text-xs">
          <Hammer size={16} />
          Maintenance
        </div>
      );
    default:
      return "text-foreground";
  }
}

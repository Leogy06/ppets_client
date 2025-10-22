import { User } from "@/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { TransitionStartFunction } from "react";

export const checkUserRole = (
  user: User,
  router: AppRouterInstance,
  startTransition: TransitionStartFunction
) => {
  switch (user.role) {
    case 1:
      startTransition(() => router.push("/admin"));
      break;
    case 2:
      startTransition(() => router.push("/employee"));
    default:
      startTransition(() => router.push("/unauthorized"));
      break;
  }
};

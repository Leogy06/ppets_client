import { User } from "@/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { TransitionStartFunction } from "react";

//navigates role
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
      break;
    default:
      startTransition(() => router.push("/unauthorized"));
      break;
  }
};

export const readUserRole = (role: number) => {
  let roleString: string;

  if (role === 1) {
    roleString = "Admin";
  } else if (role === 2) {
    roleString = "Employee";
  } else {
    roleString = "Unknown role.";
  }

  return roleString;
};

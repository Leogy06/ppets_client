import { User } from "@/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const checkUserRole = (user: User, router: AppRouterInstance) => {
  switch (user.role) {
    case 1:
      router.push("/admin");
      break;
    case 2:
      router.push("/employee");
    default:
      router.push("/unauthorized");
      break;
  }
};

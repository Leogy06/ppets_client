import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function useRouterTransition() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const push = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  const replace = (path: string) => {
    startTransition(() => {
      router.replace(path);
    });
  };

  const back = () => {
    startTransition(() => {
      router.back();
    });
  };

  return { push, replace, back, isPending };
}

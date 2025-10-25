import { format } from "date-fns";

export function formatDate(date: string) {
  if (!date) return "--";

  const formattedDate = format(new Date(date), "yyyy-MM-dd");

  return formattedDate;
}

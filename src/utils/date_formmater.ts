import dayjs from "dayjs";

export const dateFormmater = (
  date: null | Date,
  format = "YYYY-MM-DD hh:mm:a"
): string => {
  if (!date) {
    return "--";
  }
  return dayjs(date).format(format);
};

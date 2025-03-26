export const handleError = (error: unknown, fallBackMsg: string) => {
  const errMsg =
    (error as { data?: { message?: string } }).data?.message ?? fallBackMsg;

  return errMsg;
};

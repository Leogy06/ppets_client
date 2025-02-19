export const handleError = (error: any, fallBackMsg: string) => {
  const errMsg =
    (error as { data?: { message?: string } }).data?.message ?? fallBackMsg;

  return errMsg;
};

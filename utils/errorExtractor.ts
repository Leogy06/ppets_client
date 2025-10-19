export const extractedError = (error: unknown): string => {
  if (
    typeof error === "object" &&
    "data" in (error as any) &&
    typeof (error as any).data === "object" &&
    "message" in (error as any).data
  ) {
    return String((error as any).data.message);
  }

  return "An unexpected error occured";
};

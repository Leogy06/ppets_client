// utils/errorExtractor.ts
export const extractedError = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as any).data === "object" &&
    (error as any).data !== null &&
    "message" in (error as any).data
  ) {
    return String((error as any).data.message);
  }

  return "An unexpected error occurred. Please try again.";
};

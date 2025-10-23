// utils/errorExtractor.ts
export const extractedError = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const errObj = error as any;

    // Case 1: error.data.message exists
    if (errObj.data && typeof errObj.data.message === "string") {
      return errObj.data.message;
    }

    // Case 2: error.message exists directly
    if (typeof errObj.message === "string") {
      return errObj.message;
    }

    // Case 3: error is a plain object with a message property
    if ("message" in errObj && typeof errObj.message === "string") {
      return errObj.message;
    }
  }

  return "An unexpected error occurred. Please try again.";
};

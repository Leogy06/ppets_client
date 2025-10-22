import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseNumberSafe(value: unknown, fallback = 0): number {
  if (value === null || value === undefined) return fallback;

  const num = Number(value);

  // Return parsed number if it's valid, otherwise fallback
  return !isNaN(num) ? num : fallback;
}

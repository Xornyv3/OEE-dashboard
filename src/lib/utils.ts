import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to detect prod and default API base
export function getApiBase() {
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  if (envBase) return envBase;
  // Default to /api in production builds on Vercel, otherwise local dev
  if ((import.meta as any).env?.MODE === 'production') return '/api';
  return 'http://localhost:4000';
}

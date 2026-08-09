import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_NAME = "Nonprofit Resources";
export const SITE_URL = "https://nonprofit-resources.org";
export const GITHUB_ORG = "https://github.com/nonprofit-resources";
export const SUPPORT_EMAIL = "support@nonprofit-resources.org";

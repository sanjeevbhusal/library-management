import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ms from "ms";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRelativeDate(date: Date) {
  const currentDate = Date.now();
  const diff = currentDate - date.getTime();

  if (diff > 0) {
    return `${ms(Date.now() - date.getTime())} ago`;
  } else {
    return `after ${ms(diff * -1)}`;
  }
}

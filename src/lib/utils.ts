import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves an image source.
 * If the source is a remote URL (starts with http), it returns it as is.
 * Otherwise, it assumes it's a local asset path/import.
 */
export function resolveImage(src: string | any) {
  if (typeof src === "string" && src.startsWith("http")) {
    return src;
  }
  return src;
}

export function formatPrice(price: number | string) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return (num || 0).toFixed(3);
}

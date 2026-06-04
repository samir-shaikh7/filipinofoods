import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves an image source.
 * Routes it through Vercel's Image Optimization for huge bandwidth savings.
 */
export function resolveImage(src: string | any, width: number = 828, quality: number = 75) {
  if (typeof src === "string" && src.startsWith("http")) {
    // Bypass optimization in local development
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      return src;
    }
    return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  }
  return src;
}

export function formatPrice(price: number | string) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return (num || 0).toFixed(3);
}

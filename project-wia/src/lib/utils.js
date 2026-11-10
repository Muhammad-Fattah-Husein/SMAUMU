import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility untuk menggabungkan class Tailwind dengan aman dan efisien
 * Menggunakan clsx untuk conditional classes dan tailwind-merge untuk resolusi konflik kelas
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

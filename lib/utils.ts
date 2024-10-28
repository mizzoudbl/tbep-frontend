import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function openDB(name: string, mode: IDBTransactionMode) {
  return new Promise<IDBObjectStore | null>((resolve, reject) => {
    const request = indexedDB.open('universal', 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(name, mode);
      const store = tx.objectStore(name);
      resolve(store);
    };
    request.onerror = () => reject(null);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('network');
      db.createObjectStore('files');
    };
  });
}

/**
 * Gives array of unique values
 * @param arr
 * @returns
 */
export function distinct<T>(arr: T[]): Array<T> {
  return Array.from(new Set(arr));
}

/**
 * Formats bytes to human readable format
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 * @returns Formatted string
 */
export function formatBytes(bytes: number | string, decimals = 2): string {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(+bytes) / Math.log(k));
  return `${Number.parseFloat((+bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Capitalises the first letter of a string
 * @param str
 * @returns Capitalised string
 */
export function toCapitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a color transition between two hex colors
 * @param startColor Hexcode color 1
 * @param endColor Hexcode color 2
 * @param steps Number of divisions
 * @returns
 */
export function generateColorTransition(startColor: string, endColor: string, steps: number): Array<string> {
  // Helper function to parse a hex color into RGB components
  const parseColor = (color: string) => {
    // check with regex if the color consist of only characters
    if (/[a-z]/i.test(color)) {
    }
    const hex = color.replace('#', '');
    return {
      r: Number.parseInt(hex.substring(0, 2), 16),
      g: Number.parseInt(hex.substring(2, 4), 16),
      b: Number.parseInt(hex.substring(4, 6), 16),
    };
  };

  // Helper function to interpolate between two values
  const interpolate = (start: number, end: number, factor: number) => {
    return Math.round(start + factor * (end - start));
  };

  // Helper function to convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join('')}`;
  };

  const startRGB = parseColor(startColor);
  const endRGB = parseColor(endColor);

  return Array.from({ length: steps }, (_, i) => {
    const factor = i / (steps - 1);
    const r = interpolate(startRGB.r, endRGB.r, factor);
    const g = interpolate(startRGB.g, endRGB.g, factor);
    const b = interpolate(startRGB.b, endRGB.b, factor);
    return rgbToHex(r, g, b);
  });
}

export function footNotes(text: string): string {
  return text
    .split(/References?:/i)
    .map((chunk, idx, arr) => {
      return chunk.replace(
        /\[\d+\]/g,
        matcher => `[^${matcher.slice(1)}${idx === arr.length - 1 ? `: ${matcher}` : ''}`,
      );
    })
    .join('**References:**');
}

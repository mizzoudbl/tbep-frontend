import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function distinct<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function formatBytes(bytes: number | string, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(+bytes) / Math.log(k));
  return `${Number.parseFloat((+bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

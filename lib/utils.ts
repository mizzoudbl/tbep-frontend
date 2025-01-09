import EventEmitter from 'events';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  DISEASE_DEPENDENT_PROPERTIES,
  type DiseaseDependentProperties,
  type DiseaseIndependentProperties,
} from './data';
import type { OtherSection, UniversalData } from './interface';

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

export const eventEmitter = new EventEmitter();
export enum Events {
  ALGORITHM = 'algorithm',
}
export type EventMessage = {
  [Events.ALGORITHM]: {
    name: string;
    parameters: Record<string, string>;
  };
};

export function propertyResolve(
  universalData: UniversalData,
  {
    selectedRadio,
    clickedNode,
    diseaseName,
    selectedProperty,
  }: Record<'selectedRadio' | 'clickedNode' | 'diseaseName' | 'selectedProperty', string>,
): string {
  return DISEASE_DEPENDENT_PROPERTIES.includes(selectedRadio as DiseaseDependentProperties)
    ? ((universalData.database[clickedNode]?.[diseaseName] as OtherSection)[
        selectedRadio as DiseaseDependentProperties
      ][selectedProperty] ??
        (universalData.user[clickedNode]?.[diseaseName] as OtherSection)[selectedRadio as DiseaseDependentProperties][
          selectedProperty
        ])
    : (universalData.database[clickedNode]?.common[selectedRadio as DiseaseIndependentProperties][selectedProperty] ??
        universalData.user[clickedNode]?.common[selectedRadio as DiseaseIndependentProperties][selectedProperty]);
}

export function envURL(env?: string) {
  return (env || 'https://pdnet.missouri.edu').replace(/\/$/, '');
}

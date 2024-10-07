import type { Attributes } from 'graphology-types';

export interface NodeAttributes extends Attributes {
  x: number;
  y: number;
  size?: number;
  color?: string;
  label?: string;
  ID?: string;
  Description?: string;
}

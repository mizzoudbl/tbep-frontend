import type { Attributes } from 'graphology-types';

export interface EdgeAttributes extends Attributes {
  score?: number;
  size?: number;
  color?: number | string;
}

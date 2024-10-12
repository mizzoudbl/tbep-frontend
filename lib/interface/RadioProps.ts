import type { GraphStore } from './graph';

export interface RadioProps {
  radioValue: string;
  onChange: (value: string, key: keyof GraphStore) => void;
}

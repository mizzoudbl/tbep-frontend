import type { GeneInteractionType } from '@/lib/data';

export interface GraphConfigForm {
  seedGenes: string;
  diseaseMap: string;
  order: string;
  interactionType: GeneInteractionType;
  minScore: string;
}

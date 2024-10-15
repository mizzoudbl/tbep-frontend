import type { DiseaseType, GeneInteractionType } from '@/lib/data';

export interface GraphConfigForm {
  seedGenes: string;
  diseaseMap: DiseaseType;
  order: string;
  interactionType: GeneInteractionType;
  minScore: string;
}

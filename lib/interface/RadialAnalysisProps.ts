import type { RadialAnalysisSetting } from './graph';

export interface RadialAnalysisProps {
  value: RadialAnalysisSetting;
  onChange: (value: number, key: keyof RadialAnalysisSetting) => void;
  minScore: number;
}

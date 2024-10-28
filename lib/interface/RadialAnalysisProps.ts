import type { RadialAnalysisSetting } from './graph';

export interface RadialAnalysisProps {
  value: RadialAnalysisSetting;
  onChange: (value: number | string, key: keyof RadialAnalysisSetting) => void;
}

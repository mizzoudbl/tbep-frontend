import type { GraphologyWorkerLayout } from '@/components/graph';

export interface RightSideBarProps {
  sliderValue2: number;
  setSliderValue2: React.Dispatch<React.SetStateAction<number>>;
  handleSliderChange: (value: number[], setValue: React.Dispatch<React.SetStateAction<number>>) => void;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<number>>,
  ) => void;
}

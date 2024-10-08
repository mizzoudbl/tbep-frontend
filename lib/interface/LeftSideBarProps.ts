import { CheckedState } from '@radix-ui/react-checkbox';

export interface LeftSideBarProps {
  selectedRadioColor: string | undefined;
  setSelectedRadioColor: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedRadioSize: string | undefined;
  setSelectedRadioSize: React.Dispatch<React.SetStateAction<string | undefined>>;
}

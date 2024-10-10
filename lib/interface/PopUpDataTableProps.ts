import type { SelectedNodeProperty } from '.';

/**
 * Props for the data table in the popup
 * @interface PopUpDataTableProps
 */
export interface PopUpDataTableProps {
  /**
   * Data to be displayed in the table
   * @inheritdoc SelectedNodeProperty
   */
  data: SelectedNodeProperty[];

  /**
   * State of the popup
   */
  open: boolean;

  /**
   * Function to set the open state of the popup
   */
  setOpen: (open: boolean) => void;
}

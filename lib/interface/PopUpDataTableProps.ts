import type { ColumnDef } from '@tanstack/react-table';
import type { SelectedNodeProperty } from '.';

/**
 * Props for the data table in the popup
 * @interface PopUpDataTableProps<E>
 */
export interface PopUpDataTableProps<E> {
  /**
   * Data to be displayed in the table
   * @inheritdoc SelectedNodeProperty
   */
  data: E[];

  /**
   * Columns for the data table
   */
  columns: ColumnDef<E>[];

  /**
   * State of the popup
   */
  open: boolean;

  /**
   * Function to set the open state of the popup
   */
  setOpen: (open: boolean) => void;
}

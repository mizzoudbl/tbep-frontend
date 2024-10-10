import type { GeneVerificationData } from './api';

/**
 * Props for the normal popup table
 * @interface PopUpTableProps
 */
export interface PopUpTableProps {
  /**
   * State of the popup
   */
  tableOpen: boolean;

  /**
   * Data to be displayed in the table
   * @inheritdoc GeneVerificationData
   */
  data?: GeneVerificationData | null;

  /**
   * Gene IDs to be displayed in the table
   */
  geneIDs?: string[];

  /**
   * Function to handle the generation of the graph in next page
   * @returns {void}
   */
  handleGenerateGraph: () => void;

  /**
   * Function to set the open state of the popup
   * @param open New state of the popup
   * @returns {void}
   */
  setTableOpen: (open: boolean) => void;
}

/**
 * Columns for the data table containing the selected nodes by brush tool
 * @interface SelectedNodeProperty
 */
export interface SelectedNodeProperty {
  /**
   * Gene Name of the node
   */
  Gene_Name: string;

  /**
   * ENSG ID of the node
   */
  ID: string;

  /**
   * Description of the node
   */
  Description: string;
}

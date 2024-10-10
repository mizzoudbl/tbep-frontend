/**
 * Represents the topleft and bottomright coordinates of the selection box
 * @interface SelectionBox
 */
export interface SelectionBox {
  /**
   * x coordinate of the topleft corner of the selection box
   */
  startX: number;

  /**
   * y coordinate of the topleft corner of the selection box
   */
  startY: number;

  /**
   * x coordinate of the bottomright corner of the selection box
   */
  endX: number;

  /**
   * y coordinate of the bottomright corner of the selection box
   */
  endY: number;
}

import type { Attributes } from 'graphology-types';

/**
 * Edge attributes used in the graph
 * @extends Attributes
 * @interface EdgeAttributes
 */
export interface EdgeAttributes extends Attributes {
  /**
   * combined score/weight of the edge
   */
  score?: number;

  /**
   * size of the edge
   */
  size?: number;

  /**
   * color of the edge
   */
  color?: number | string;

  /**
   * label of the edge visible on the graph
   * */
  forceLabel?: boolean;

  /**
   * boolean whether the edge is hidden
   */
  hidden?: boolean;
}

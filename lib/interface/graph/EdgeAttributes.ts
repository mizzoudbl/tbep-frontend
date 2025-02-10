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
  color?: string;

  /**
   * Hover color of edge
   */
  altColor?: string;

  /**
   * label of the edge visible on the graph
   * */
  forceLabel?: boolean;

  /**
   * boolean whether the edge is hidden
   */
  hidden?: boolean;

  /**
   * type of the edge (custom defined but ProgramClasses needs to be mapped in SigmaContainer)
   * defeault: line
   */
  type?: 'line' | 'rectangle';

  /**
   * z-index of the edge
   */
  zIndex?: number;
}

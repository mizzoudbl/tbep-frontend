/**
 * Interface for the force settings
 * @interface ForceSettings
 */
export interface ForceSettings {
  /**
   * Strength of the repulsion force between each pair of nodes
   */
  repulsion: number;

  /**
   * Strength of the attraction force between each pair of connected noes
   *
   */
  attraction: number;

  /**
   * Strength of the gravity force that pulls nodes towards the center of the graph
   */
  gravity: number;
}

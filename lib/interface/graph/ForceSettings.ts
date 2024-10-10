/**
 * Interface for the force settings
 * @interface ForceSettings
 */
export interface ForceSettings {
  /**
   * Strength of the repulsion force
   */
  repulsion: number;

  /**
   * Strength of the attraction force
   */
  attraction: number;

  /**
   * Strength of the gravity force
   */
  gravity: number;

  /**
   * Strength of the damping force
   */
  damping: number;

  /**
   * Strength of the speed force
   */
  speed: number;
}

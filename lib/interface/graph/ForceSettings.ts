/**
 * Interface for the force settings
 * @interface ForceSettings
 */
export interface ForceSettings {
  /**
   * Strength of the link distance
   */
  chargeStrength: number;

  /**
   * Distance between the links
   */
  linkDistance: number;

  /**
   * Strength of the collide force
   */
  collideForce: number;

  /**
   * Radius of the collide force
   */
  collideRadius: number;
}

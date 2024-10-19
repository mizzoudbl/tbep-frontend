import type AbstractGraph from 'graphology-types';
import type { EdgeAttributes, NodeAttributes } from '../interface';
import type { WorkerLayoutForceSettings } from './hook';
import { forceIterate } from './iterate';

export type State = {
  index?: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};
export type NodeStates = Record<string, State>;

export const DEFAULT_FORCE_SETTINGS: Required<WorkerLayoutForceSettings> = {
  // simulation
  alpha: 1,
  alphaMin: 0.001,
  alphaDecay: 0.02276277,
  alphaTarget: 0,
  velocityDecay: 0.1,

  // Centering force
  centeringForce: 1,

  // Collide force
  collideRadius: 5,
  collideForce: 1000,

  // Link force
  linkDistance: 30,
  // Many body force
  chargeStrength: -30,
};

export class ForceSupervisor {
  isRunning = false;
  #nodeStates: NodeStates = {};
  #frameID: number | null = null;
  #killed = false;
  #graph: AbstractGraph<NodeAttributes, EdgeAttributes>;
  #settings: Required<WorkerLayoutForceSettings>;

  constructor(graph: AbstractGraph<NodeAttributes, EdgeAttributes>, settings: WorkerLayoutForceSettings) {
    this.#graph = graph;
    this.#settings = {
      // main simulation
      alpha: settings.alpha ?? DEFAULT_FORCE_SETTINGS.alpha,
      alphaMin: settings.alphaMin ?? DEFAULT_FORCE_SETTINGS.alphaMin,
      alphaDecay: settings.alphaDecay ?? 1 - (settings.alphaMin ?? DEFAULT_FORCE_SETTINGS.alphaMin) ** (1 / 300),
      alphaTarget: settings.alphaTarget ?? DEFAULT_FORCE_SETTINGS.alphaTarget,
      velocityDecay: 1 - (settings.velocityDecay ?? DEFAULT_FORCE_SETTINGS.velocityDecay),

      // Centering force
      centeringForce: settings.centeringForce ?? DEFAULT_FORCE_SETTINGS.centeringForce,

      // Collide force
      collideRadius: settings.collideRadius ?? DEFAULT_FORCE_SETTINGS.collideRadius,
      collideForce: settings.collideForce ?? DEFAULT_FORCE_SETTINGS.collideForce,

      // Link force
      linkDistance: settings.linkDistance ?? DEFAULT_FORCE_SETTINGS.linkDistance,

      // Many body force
      chargeStrength: settings.chargeStrength ?? DEFAULT_FORCE_SETTINGS.chargeStrength,
    };
  }

  #runFrame = () => {
    if (!this.isRunning) return;

    forceIterate(this.#graph, this.#settings, this.#nodeStates);

    this.#graph.updateEachNodeAttributes((node, attr) => {
      const state = this.#nodeStates[node];
      this.#nodeStates[node] = state;
      attr.x = state.x += state.vx *= this.#settings.velocityDecay;
      attr.y = state.y += state.vy *= this.#settings.velocityDecay;
      return attr;
    });

    if (
      (this.#settings.alpha ?? DEFAULT_FORCE_SETTINGS.alpha) <
      (this.#settings.alphaMin ?? DEFAULT_FORCE_SETTINGS.alphaMin)
    ) {
      this.stop();
      return;
    }

    this.#frameID = requestAnimationFrame(this.#runFrame);
  };

  start() {
    if (this.#killed) throw new Error('Force Layout has been killed');
    this.#settings.alpha = 1;
    if (this.isRunning) return;
    this.isRunning = true;
    this.#runFrame();
  }
  stop() {
    this.isRunning = false;
    if (this.#frameID !== null) {
      cancelAnimationFrame(this.#frameID);
      this.#frameID = null;
    }
  }

  kill() {
    this.stop();
    this.#nodeStates = {};
    this.#killed = true;
  }
  updateSettings(settings: WorkerLayoutForceSettings) {
    this.#settings = {
      ...this.#settings,
      ...settings,
    };
    this.start();
  }
}

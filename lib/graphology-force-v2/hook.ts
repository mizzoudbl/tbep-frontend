import { useSigma } from '@react-sigma/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ForceSupervisor } from './ForceSupervisor';

export interface WorkerLayoutForceSettings {
  // Simulation settings
  alpha?: number;
  alphaMin?: number;
  alphaDecay?: number;
  alphaTarget?: number;
  velocityDecay?: number;

  // Centering force
  centeringForce?: number;

  // Collide force
  collideRadius?: number;
  collideForce?: number;

  // Link force
  linkDistance?: number;

  // Many body force
  chargeStrength?: number;
}

export interface WorkerLayoutForceHook {
  start: () => void;
  stop: () => void;
  updateSettings: (settings: WorkerLayoutForceSettings) => void;
}

export function useWorkerLayoutForce(settings: WorkerLayoutForceSettings): WorkerLayoutForceHook {
  const sigma = useSigma();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [layout, setLayout] = useState<WorkerLayoutForceHook | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!sigma) return;
    let newLayout: WorkerLayoutForceHook | null = null;
    newLayout = new ForceSupervisor(sigma.getGraph(), settings);
    setLayout(newLayout);
  }, [sigma]);

  const stop = useCallback(() => {
    if (layout) {
      layout.stop();
      setIsRunning(false);
    }
  }, [layout]);

  const start = useCallback(() => {
    if (layout) {
      layout.start();
      setIsRunning(true);
    }
  }, [layout]);

  const updateSettings = useCallback(
    (settings: WorkerLayoutForceSettings) => {
      if (layout) {
        layout.updateSettings(settings);
      }
    },
    [layout],
  );

  return { stop, start, updateSettings };
}

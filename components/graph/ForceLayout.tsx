'use client';

import { useStore } from '@/lib/store';
import { useWorkerLayoutForce } from '@react-sigma/layout-force';
import { useEffect } from 'react';

export function ForceLayout() {
  const settings = useStore(state => state.forceSettings);

  const { start, stop, kill, isRunning } = useWorkerLayoutForce({
    settings: {
      attraction: 0.0001,
      gravity: 0.00001,
      inertia: 0.95,
      repulsion: 0.001,
    },
  });

  useEffect(() => {
    useStore.setState({ forceWorker: { start, stop, kill } });
    // return () => {
    //   kill();
    // };
  }, [start, stop, kill]);

  return null;
}

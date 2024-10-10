'use client';

import { useStore } from '@/lib/store';
import { useWorkerLayoutForce } from '@react-sigma/layout-force';
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import { useEffect } from 'react';

export function ForceLayout() {
  const settings = useStore(state => state.forceSettings);

  const { start, stop, kill } = useWorkerLayoutForce({
    // Name of the edge attribute for score
    // getEdgeWeight: 'score',
    settings: {
      /* TODO: Select defaultValue which are not to be controlled by user */
      ...settings,
    },
  });

  useEffect(() => {
    useStore.setState({ forceWorker: { start, stop, kill } });
    return () => {
      kill();
    };
  }, [start, stop, kill]);

  return null;
}

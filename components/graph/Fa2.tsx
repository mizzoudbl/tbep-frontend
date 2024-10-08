'use client';

import { useStore } from '@/lib/store';
import { useSigma } from '@react-sigma/core';
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import { useEffect } from 'react';

export function Fa2() {
  const settings = useStore(state => state.fa2Settings);
  const setFa2Worker = useStore(state => state.setFa2Worker);
  const setSettings = useStore(state => state.setFa2Settings);
  const sigma = useSigma();

  const { start, stop, kill } = useWorkerLayoutForceAtlas2({
    // Name of the edge attribute for score
    getEdgeWeight: 'score',
    settings: {
      // slows the animation (default: 1)
      slowDown: 10,
      // faster repulsion computation algorithm (n^2 -> nlog(n))
      barnesHutOptimize: true,
      // for using Noack’s LinLog model
      linLogMode: true,
      ...settings,
    },
  });

  useEffect(() => {
    start();
    setFa2Worker({ start, stop, kill });
    setTimeout(() => stop(), 5000);
    return () => {
      kill();
    };
  }, [start, stop, kill, setFa2Worker]);

  return null;
}

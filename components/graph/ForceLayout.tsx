'use client';

import { useStore } from '@/lib/store';
// import { useWorkerLayoutForce } from '@/lib/graphology-force-v2';
import { useWorkerLayoutForce } from '@react-sigma/layout-force';
import { useEffect } from 'react';

export function ForceLayout() {
  const settings = useStore(state => state.forceSettings);

  const hook = useWorkerLayoutForce({
    settings: {
      attraction: 0.0001,
      gravity: 0.00001,
      inertia: 0.95,
      repulsion: 0.001,
    },
  });

  // const hook = useWorkerLayoutForce({
  //   chargeStrength: settings.chargeStrength,
  //   linkDistance: settings.linkDistance,
  // });

  useEffect(() => {
    useStore.setState({ forceWorker: hook });
  }, [hook]);

  // useEffect(() => {
  //   if (!hook.updateSettings) return;
  //   hook.updateSettings({
  //     ...settings,
  //   });
  // }, [settings,hook.updateSettings]);

  return null;
}

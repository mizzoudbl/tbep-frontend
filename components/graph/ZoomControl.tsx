'use client';

import { useCamera, useSigma } from '@react-sigma/core';
import { fitViewportToNodes } from '@sigma/utils';
import { Focus, ZoomIn, ZoomOut } from 'lucide-react';

export function ZoomControl() {
  const { zoomIn, zoomOut } = useCamera({ duration: 200, factor: 1.5 });
  const sigma = useSigma();

  return (
    <>
      <div className='react-sigma-control'>
        <button type='button' onClick={() => zoomIn} title='Zoom In'>
          <ZoomIn />
        </button>
      </div>
      <div className='react-sigma-control'>
        <button type='button' onClick={() => zoomOut} title='Zoom Out'>
          <ZoomOut />
        </button>
      </div>
      <div className='react-sigma-control'>
        <button
          type='button'
          onClick={() => fitViewportToNodes(sigma, sigma.getGraph().nodes(), { animate: true })}
          title='Reset'
        >
          <Focus />
        </button>
      </div>
    </>
  );
}

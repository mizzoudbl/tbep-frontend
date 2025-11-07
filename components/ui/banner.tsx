'use client';

import { XIcon } from 'lucide-react';
import React, { useEffect } from 'react';

export function Banner({ children }: { children: React.ReactNode }) {
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    if (localStorage.getItem('banner') !== 'false') {
      setShow(true);
    }
  }, []);

  return (
    <>
      {show && (
        <div className='bg-teal-600 py-0.5 text-center'>
          {children}
          <button
            type='button'
            className='float-right mt-0.5 mr-4 text-white transition-transform hover:scale-125'
            onClick={() => {
              localStorage.setItem('banner', 'false');
              setShow(false);
            }}
          >
            <XIcon className='size-5' />
          </button>
        </div>
      )}
    </>
  );
}

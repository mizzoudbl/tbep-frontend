'use client';

import { X } from 'lucide-react';
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
        <div className='bg-teal-600 text-center py-0.5'>
          {children}
          <button
            type='button'
            className='float-right mr-4 mt-0.5 hover:scale-125 transition-transform text-white'
            onClick={() => {
              localStorage.setItem('banner', 'false');
              setShow(false);
            }}
          >
            <X className='w-5 h-5' />
          </button>
        </div>
      )}
    </>
  );
}

'use client';

import AnimatedNetworkBackground from '@/components/AnimatedNetworkBackground';
import { Button } from '@/components/ui/button';
import { databaseStats } from '@/lib/data';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className='mx-auto p-2 sm:p-6 min-h-[70vh] h-full'>
      <section className='relative flex items-center justify-center overflow-hidden h-full rounded-xl bg-teal-800 text-white shadow-md'>
        {/* animated network backdrop */}
        <AnimatedNetworkBackground lineWidth={5} nodeSize={10} className='absolute inset-0 w-full h-full opacity-30' />
        {/* gradient overlay for readability */}
        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.45)_100%)]' />
        <div className='relative'>
          <h1 className='text-3xl sm:text-4xl font-bold text-center'>Welcome to TBEP</h1>
          <p className='mt-3 text-center text-teal-50 text-base sm:text-lg'>
            Gene-Gene Network Analysis · Functional Enrichment Exploration
          </p>
          <div className='mt-8 flex justify-center'>
            <Link href='/explore'>
              <Button size={'lg'} className='bg-white text-teal-900 hover:bg-teal-50'>
                Explore 🚀
              </Button>
            </Link>
          </div>
          <div className='mt-10 grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-5xl mx-auto'>
            {databaseStats.map(item => (
              <div key={item.label} className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold'>{item.count}</div>
                <div className='text-sm opacity-90'>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <span className='float-right pb-2 pr-2 text-xs'>*After removing redundant connections</span>
    </div>
  );
}

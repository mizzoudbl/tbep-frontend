'use client';

import Link from 'next/link';
import AnimatedNetworkBackground from '@/components/AnimatedNetworkBackground';
import { Button } from '@/components/ui/button';
import { databaseStats } from '@/lib/data';

export default function Home() {
  return (
    <div className='mx-auto h-full min-h-[70vh] p-2 sm:p-6'>
      <section className='relative flex h-full items-center justify-center overflow-hidden rounded-xl bg-teal-800 text-white shadow-md'>
        {/* animated network backdrop */}
        <AnimatedNetworkBackground lineWidth={5} nodeSize={10} className='absolute inset-0 h-full w-full opacity-30' />
        {/* gradient overlay for readability */}
        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.45)_100%)]' />
        <div className='relative'>
          <h1 className='text-center font-bold text-3xl sm:text-4xl'>Welcome to TBEP</h1>
          <p className='mt-3 text-center text-base text-teal-50 sm:text-lg'>
            Gene-Gene Network Analysis · Functional Enrichment Exploration
          </p>
          <div className='mt-8 flex justify-center'>
            <Link href='/explore'>
              <Button size={'lg'} className='bg-white text-teal-900 hover:bg-teal-50'>
                Explore 🚀
              </Button>
            </Link>
          </div>
          <div className='mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-5'>
            {databaseStats.map(item => (
              <div key={item.label} className='text-center'>
                <div className='font-bold text-2xl sm:text-3xl'>{item.count}</div>
                <div className='text-sm opacity-90'>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <span className='float-right pr-2 pb-2 text-xs'>*After removing redundant connections</span>
    </div>
  );
}

import { SideBar } from '@/components/app';
import { databaseStats, getStartedLinks } from '@/lib/data';
import { Link } from 'next-view-transitions';
import Image from 'next/image';

export default function SideBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='flex flex-col gap-4 md:w-[25%] '>
          <div className='relative shadow-teal-900 shadow-md rounded-md'>
            <div className='absolute inset-0 bg-black/40 rounded-md z-10' />
            <Image src='/image/sideBarBg.jpeg' alt='sideBarBg' priority className='rounded-md object-cover' fill />
            <div className='relative z-20'>
              <SideBar />
            </div>
          </div>
          <div className='flex h-full flex-col gap-4 rounded-md shadow-md p-4 border'>
            <i className='font-semibold text-2xl w-full text-center'>Database Statistics</i>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
              {databaseStats.map(item => (
                <div key={item.count} className='flex flex-col items-center'>
                  <span className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent font-bold sm:text-sm md:text-base lg:text-3xl'>
                    {item.count}
                  </span>
                  <span className='font-light text-center sm:text-sm lg:text-lg'>{item.label}</span>
                  {item.note && <p className='text-xs font-thin'>{item.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='w-full flex gap-4 flex-col'>
          <div className='container'>{children}</div>
        </div>
      </div>
      <div className='flex flex-col items-center mt-10'>
        <h1 className='md:text-4xl text-2xl font-semibold tracking-tight'>About The Tool</h1>
        <div className='text-center my-4 mx-12 space-y-2'>
          <p>
            TBEP is an advanced network-based bioinformatics tool that accelerates drug target and biomarker discovery
            using network analysis. It integrates deep multimodal datasets to uncover causal disease mechanisms linked
            to specific phenotypes. Built on a cloud-based architecture, TBEP enables real-time processing of
            large-scale biological data.{' '}
          </p>
          <p>
            Additionally, it features an independent large language model (LLM) as an exploration assistant, helping
            researchers interpret complex biological relationships. While the LLM currently operates separately from the
            network, future iterations will enhance its integration for deeper insights.
          </p>
        </div>
        <h1 className='md:text-4xl mt-4 text-2xl font-semibold tracking-tight'>
          <b className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent'>
            Get Started
          </b>{' '}
          with the Tool
        </h1>
        <div className='flex justify-center gap-4 mt-4'>
          {getStartedLinks.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className='group relative flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:-translate-y-1'
            >
              <div className='relative'>
                <div className='absolute inset-0 rotate-45 scale-110 bg-teal-800/10 rounded-lg transition-all duration-300 group-hover:rotate-90 group-hover:scale-125' />
                <div className='relative bg-teal-800 text-white p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-800/20'>
                  {item.icon}
                </div>
              </div>
              <h3 className='mt-6 text-lg font-semibold text-gray-900'>{item.title}</h3>
              <p className='mt-2 text-sm text-gray-600'>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

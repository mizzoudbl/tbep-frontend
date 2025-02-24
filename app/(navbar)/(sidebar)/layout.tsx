import { SideBar } from '@/components/app';
import { FileText, HelpCircle, TvMinimalPlay } from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';

export default function SideBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col gap-4 lg:flex-row'>
        <div className='lg:w-1/4 w-full order-1 lg:order-none h-min flex flex-col gap-4 rounded-md shadow-md p-4 border'>
          <i className='font-semibold text-2xl'>Database Statistics</i>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-1'>
            <div className='flex flex-col items-center'>
              <span className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent font-bold sm:text-sm md:text-base lg:text-3xl'>
                17,700+
              </span>
              <span className='font-light sm:text-sm lg:text-lg'>Diseases</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent font-bold sm:text-sm md:text-base lg:text-3xl'>
                82,800+
              </span>
              <span className='font-light text-center sm:text-sm lg:text-lg'>Genes + its Alias Names</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent font-bold sm:text-sm md:text-base lg:text-3xl'>
                2,839,600+
              </span>
              <span className='font-light sm:text-sm lg:text-lg'>PPI Interactions</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent font-bold sm:text-sm md:text-base lg:text-3xl'>
                26,306,800+
              </span>
              <span className='font-light sm:text-sm lg:text-lg'>Function PPI Interactions</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent font-bold sm:text-sm md:text-base lg:text-3xl'>
                68,700+
              </span>
              <span className='font-light text-center sm:text-sm lg:text-lg'>Gene Properties to choose</span>
              <p className='text-xs font-thin'>*Varies between genes</p>
            </div>
          </div>
        </div>
        <div className='w-full flex gap-4 flex-col'>
          <div className='relative w-full shadow-teal-900 shadow-md rounded-md'>
            <Image src='/image/sideBarBg.jpeg' alt='sideBarBg' priority className='rounded-md object-cover' fill />
            <SideBar />
          </div>
          <div className='container'>{children}</div>
        </div>
      </div>
      <div className='flex flex-col items-center mt-10'>
        <h1 className='md:text-4xl text-2xl font-semibold tracking-tight'>
          <b className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent'>
            Get Started
          </b>{' '}
          with the Tool
        </h1>
        <div className='flex justify-center gap-4 mt-4'>
          <Link
            href={'/docs'}
            className='group relative flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:-translate-y-1'
          >
            <div className='relative'>
              <div className='absolute inset-0 rotate-45 scale-110 bg-teal-800/10 rounded-lg transition-all duration-300 group-hover:rotate-90 group-hover:scale-125' />
              <div className='relative bg-teal-800 text-white p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-800/20'>
                <HelpCircle className='w-8 h-8' />
              </div>
            </div>
            <h3 className='mt-6 text-lg font-semibold text-gray-900'>Documentation</h3>
            <p className='mt-2 text-sm text-gray-600'>Browse detailed guides and documentation</p>
          </Link>
          <Link
            href={'/docs/CHANGELOG'}
            className='group relative flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:-translate-y-1'
          >
            <div className='relative'>
              <div className='absolute inset-0 rotate-45 scale-110 bg-teal-800/10 rounded-lg transition-all duration-300 group-hover:rotate-90 group-hover:scale-125' />
              <div className='relative bg-teal-800 text-white p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-800/20'>
                <FileText className='w-8 h-8' />
              </div>
            </div>
            <h3 className='mt-6 text-lg font-semibold text-gray-900'>Latest Updates</h3>
            <p className='mt-2 text-sm text-gray-600'>Stay current with our newest features and changes</p>
          </Link>
          <Link
            href={'/docs/use-cases-and-short-help-videos'}
            className='group relative flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:-translate-y-1'
          >
            <div className='relative'>
              <div className='absolute inset-0 rotate-45 scale-110 bg-teal-800/10 rounded-lg transition-all duration-300 group-hover:rotate-90 group-hover:scale-125' />
              <div className='relative bg-teal-800 text-white p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-800/20'>
                <TvMinimalPlay className='w-8 h-8' />
              </div>
            </div>
            <h3 className='mt-6 text-lg font-semibold text-gray-900'>Tutorial Videos</h3>
            <p className='mt-2 text-sm text-gray-600'>Watch our video tutorials to get started</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

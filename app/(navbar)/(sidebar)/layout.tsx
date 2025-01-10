'use client';
import { Search, Upload, Video } from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function SideBarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className='container mx-auto p-4'>
      <div className='w-full flex gap-4 flex-col md:flex-row'>
        <div className='relative md:h-[70vh] md:w-[25%] w-full shadow-teal-900 shadow-md rounded-md'>
          <Image
            src='/image/sideBarBg.jpeg'
            alt='sideBarBg'
            priority
            className='rounded-md object-cover'
            layout='fill'
          />
          <ul className='relative z-10 p-4 flex md:flex-col gap-2 font-semibold text-white'>
            <li className={`transition-colors p-2 rounded hover:font-bold ${pathname === '/' && 'bg-primary'}`}>
              <Link href='/' className='flex items-center'>
                <Search size={20} className='mr-2' /> Search By Proteins
              </Link>
            </li>
            <li
              className={`transition-colors p-2 rounded hover:font-bold ${pathname === '/tutorial-video' && 'bg-primary'}`}
            >
              <Link href='/tutorial-video' className='flex items-center'>
                <Video size={20} className='mr-2' /> Tutorial Video
              </Link>
            </li>
            <li
              className={`transition-colors p-2 rounded hover:font-bold ${pathname === '/upload-network' && 'bg-primary'}`}
            >
              <Link href='/upload-network' className='flex items-center'>
                <Upload size={20} className='mr-2' /> Upload Network
              </Link>
            </li>
          </ul>
        </div>
        <div className='container'>{children}</div>
      </div>
    </div>
  );
}

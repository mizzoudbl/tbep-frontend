'use client';
import { Search, Upload, Video } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import bg from '@/public/image/sideBarBg.jpeg';

export default function SideBarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className='w-full flex gap-4'>
      <ul
        style={{ backgroundImage: `url(${bg.src})` }}
        className='bg-cover h-[70vh] shadow-teal-900 shadow-md rounded-md p-4 w-[25%] flex flex-col gap-2 font-semibold text-white'
      >
        <li
          className={`transition-colors p-2 rounded hover:font-bold ${pathname === '/' && 'bg-primary'}`}
        >
          <Link href='/' className='flex'>
            <Search size={20} className='mr-2' /> Search By Proteins
          </Link>
        </li>
        <li
          className={`transition-colors p-2 rounded hover:font-bold ${pathname === '/tutorial-video' && 'bg-primary'}`}
        >
          <Link href='/tutorial-video' className='flex'>
            <Video size={20} className='mr-2' /> Tutorial Video
          </Link>
        </li>
        <li
          className={`transition-colors p-2 rounded hover:font-bold ${pathname === '/upload-network' && 'bg-primary'}`}
        >
          <Link href='/upload-network' className='flex'>
            <Upload size={20} className='mr-2' /> Upload Network
          </Link>
        </li>
      </ul>
      <div className='container'>{children}</div>
    </div>
  );
}

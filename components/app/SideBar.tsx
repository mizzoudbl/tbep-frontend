'use client';

import { SearchIcon, UploadIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';

export function SideBar() {
  const pathname = usePathname();

  return (
    <ul className='relative p-4 flex flex-col gap-2 font-semibold text-white'>
      <li className={`transition-colors p-2 rounded w-full hover:font-bold ${pathname === '/' && 'bg-primary'}`}>
        <Link href='/' className='flex items-center'>
          <SearchIcon size={20} className='mr-2' /> Search By Proteins
        </Link>
      </li>
      <li
        className={`transition-colors p-2 rounded w-full hover:font-bold ${pathname === '/upload-network' && 'bg-primary'}`}
      >
        <Link href='/upload-network' className='flex items-center'>
          <UploadIcon size={20} className='mr-2' /> Upload Network
        </Link>
      </li>
    </ul>
  );
}

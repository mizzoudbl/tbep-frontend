import { links } from '@/lib/data';
import { getLatestVersionFromChangelog } from '@/lib/getChangelogVersion';
import { MenuIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { Button, buttonVariants } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export default function Navbar() {
  const version = getLatestVersionFromChangelog();

  return (
    <header className='bg-teal-800 text-white p-2'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex'>
          <Link href={'/'} className='flex items-center gap-2'>
            <Image src='/image/logo.svg' alt='TBEP logo' width={50} height={50} className='aspect-square' />
            <h1 className='text-lg md:text-xl font-bold flex items-end flex-wrap'>
              <p className='text-2xl lg:text-3xl'>T</p>arget & <p className='lg:text-3xl text-2xl ml-1'>B</p>iomarker{' '}
              <p className='text-2xl lg:text-3xl ml-1'>E</p>xploration <p className='lg:text-3xl text-2xl ml-1'>P</p>
              ortal <p className='text-2xl lg:text-3xl ml-2 '>(TBEP)</p>
            </h1>
          </Link>
          <Link href={'/docs/CHANGELOG'} className='text-xs self-end'>
            Version: {version ?? 'unknown'}
          </Link>
        </div>
        <nav className='hidden md:flex space-x-4'>
          {links.map(link => (
            <Link
              key={link.text}
              href={link.href}
              className={buttonVariants({ variant: 'ghost', className: 'hover:bg-teal-700' })}
            >
              {link.text}
            </Link>
          ))}
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='md:hidden hover:bg-teal-600 ml-2'>
              <MenuIcon className='h-6 w-6' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 text-black text-lg' align='end'>
            {links.map(link => (
              <Link key={link.text} href={link.href}>
                <DropdownMenuItem className='cursor-pointer'>
                  {link.icon}
                  <span>{link.text}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

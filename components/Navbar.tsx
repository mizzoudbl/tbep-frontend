import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { links } from '@/lib/data';
import { getLatestVersionFromChangelog } from '@/lib/getChangelogVersion';
import { Banner } from './ui/banner';
import { Button, buttonVariants } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export default function Navbar() {
  const version = getLatestVersionFromChangelog();

  return (
    <header className='bg-teal-800 text-white'>
      <Banner>
        This website is for <b className='font-semibold'>academic use</b> only. Please refer to the
        <Link href='/docs/LICENSE' className='underline ml-1'>
          LICENSE
        </Link>
      </Banner>
      <div className='container mx-auto flex justify-between items-center p-4'>
        <div className='flex'>
          <Link href={'/'} className='flex items-center gap-2'>
            <Image src='/image/logo.svg' alt='TBEP logo' width={50} height={50} className='aspect-square' />
            <h1 className='flex flex-wrap items-end font-bold text-lg md:text-xl'>
              <p className='text-2xl lg:text-3xl'>T</p>arget & <p className='ml-1 text-2xl lg:text-3xl'>B</p>iomarker{' '}
              <p className='ml-1 text-2xl lg:text-3xl'>E</p>xploration <p className='ml-1 text-2xl lg:text-3xl'>P</p>
              ortal <p className='ml-2 text-2xl lg:text-3xl'>(TBEP)</p>
            </h1>
          </Link>
          <Link href={'/docs/CHANGELOG'} className='self-end text-xs'>
            Version: {version ?? 'unknown'}
          </Link>
        </div>
        <nav className='hidden space-x-4 md:flex'>
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
            <Button variant='ghost' size='icon' className='ml-2 hover:bg-teal-600 md:hidden'>
              <MenuIcon className='size-6' />
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

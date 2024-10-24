import { links } from '@/lib/data';
import { Menu } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Button, buttonVariants } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export default function Navbar() {
  return (
    <header className='bg-teal-800 text-white p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href={'/'}>
          <h1 className='text-lg md:text-xl font-bold flex items-end'>
            <p className='text-3xl'>T</p>arget & <p className='text-3xl ml-1'>B</p>iomarker{' '}
            <p className='text-3xl ml-1'>E</p>xploration <p className='text-3xl ml-1'>P</p>ortal{' '}
            <p className='text-3xl ml-2'>(TBEP)</p>
          </h1>
        </Link>
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
            <Button variant='ghost' size='icon' className='md:hidden hover:bg-teal-600'>
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 text-black text-lg' align='end'>
            {links.map(link => (
              <Link key={link.text} href={link.href}>
                <DropdownMenuItem>
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

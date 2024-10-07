import { Download, HelpCircle, Info, Menu, MessageCircle } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Button, buttonVariants } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Navbar() {
  return (
    <header className='bg-teal-800 text-white p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href={'/'}>
          <h1 className='text-2xl font-bold'>Target Discovery Platform</h1>
        </Link>
        <nav className='hidden md:flex space-x-4'>
          <Link href={'/help'} className={buttonVariants({ variant: 'ghost', className: 'hover:bg-teal-700' })}>
            Help
          </Link>
          <Link href={'/about'} className={buttonVariants({ variant: 'ghost', className: 'hover:bg-teal-700' })}>
            About
          </Link>
          <Link href={'/faq'} className={buttonVariants({ variant: 'ghost', className: 'hover:bg-teal-700' })}>
            FAQ
          </Link>
          <Link href={'/contact'} className={buttonVariants({ variant: 'ghost', className: 'hover:bg-teal-700' })}>
            Contact
          </Link>
          <Link href={'/download'} className={buttonVariants({ variant: 'ghost', className: 'hover:bg-teal-700' })}>
            Download
          </Link>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='md:hidden hover:bg-teal-600'>
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 text-black text-lg' align='end'>
            <Link href={'/help'}>
              <DropdownMenuItem>
                <HelpCircle className='mr-2 h-4 w-4' />
                <span>Help</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={'/about'}>
              <DropdownMenuItem>
                <Info className='mr-2 h-4 w-4' />
                <span>About</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={'/faq'}>
              <DropdownMenuItem>
                <MessageCircle className='mr-2 h-4 w-4' />
                <span>FAQ</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={'/contact'}>
              <DropdownMenuItem>
                <MessageCircle className='mr-2 h-4 w-4' />
                <span>Contact</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={'/download'}>
              <DropdownMenuItem>
                <Download className='mr-2 h-4 w-4' />
                <span>Download</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

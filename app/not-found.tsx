import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col justify-between'>
      <Navbar />
      <div className='flex flex-col items-center gap-4'>
        <Image src={'/image/404.png'} alt='404' width={500} height={500} />
        <Link href='/' className={buttonVariants({ variant: 'default', className: '' })}>
          Back to home
        </Link>
      </div>
      <Footer />
    </div>
  );
}

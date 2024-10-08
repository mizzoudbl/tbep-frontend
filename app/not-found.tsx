import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { buttonVariants } from '@/components/ui/button';
import _404 from '@/public/image/404.png';
import { Link } from 'next-view-transitions';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className='flex min-h-screen justify-between flex-col'>
      <Navbar />
      <div className='flex flex-col gap-4 items-center'>
        <Image src={_404.src} alt='404' width={500} height={500} />
        <Link href='/' className={buttonVariants({ variant: 'default', className: '' })}>
          Back to home
        </Link>
      </div>
      <Footer />
    </div>
  );
}

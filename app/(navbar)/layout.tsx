import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col justify-between'>
      <Navbar />
      <div className='container mx-auto p-4'>{children}</div>
      <Footer />
    </div>
  );
}

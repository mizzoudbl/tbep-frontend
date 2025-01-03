import { Link } from 'next-view-transitions';
import Image from 'next/image';
import React from 'react';

export default function Footer() {
  return (
    <footer className='bg-teal-800 text-white p-4 relative bottom-0'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <Link href='/docs' className='hover:text-teal-200 mb-2'>
              Documentation
            </Link>
            <Link href='/about' className='hover:text-teal-200 mb-2'>
              About
            </Link>
            <Link href='/tutorial-video' className='hover:text-teal-200 mb-2'>
              Tutorial Videos
            </Link>
            <Link href='/upload-network' className='hover:text-teal-200 mb-2'>
              Custom Upload Network
            </Link>
          </div>
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold mb-4'>Collaborating Institutions</h3>
            <Link
              href='https://iiita.ac.in'
              target='_blank'
              className='flex items-center mb-2 hover:text-teal-200 cursor-pointer'
            >
              <Image src='/image/iiita-logo.png' alt='IIITA Logo' width={40} height={40} className='mr-2' />
              <span>Indian Institute of Information Technology, Allahabad ↗</span>
            </Link>
            <Link
              href='https://missouri.edu/'
              target='_blank'
              className='flex items-center mb-2 hover:text-teal-200 cursor-pointer'
            >
              <Image
                src='/image/mu-logo.png'
                alt='University of Missouri Logo'
                width={40}
                height={40}
                className='mr-2'
              />
              <span>University of Missouri ↗</span>
            </Link>
          </div>
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold mb-4'>Contact</h3>
            For any queries, please contact our team via email
            <Link href='/team' className='hover:text-teal-200 mb-2'>
              here.
            </Link>
            <p className='text-sm mt-4'>&copy; {new Date().getFullYear()} Target & Biomarker Exploration Portal</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

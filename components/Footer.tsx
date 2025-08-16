import { collaborators, footerLinks } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-teal-800 text-white p-4 relative bottom-0'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold mb-4 '>Quick Links</h3>
            <div className='grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2'>
              {footerLinks.map(link => (
                <Link key={link.href} href={link.href} className='hover:text-teal-200 mb-2'>
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold mb-4'>Collaborating Institutions</h3>
            {collaborators.map(institution => (
              <Link
                key={institution.href}
                href={institution.href}
                target='_blank'
                className='flex items-center mb-2 hover:text-teal-200 cursor-pointer'
              >
                <Image
                  src={institution.logo}
                  alt={institution.alt}
                  width={40}
                  height={40}
                  className='mr-2 aspect-square'
                />
                <span>{institution.name} ↗</span>
              </Link>
            ))}
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-semibold'>Contact</h3>
            <p>
              For any usage queries, please refer to documentation or contact our team via email
              <Link href='/team' className='text-teal-300 hover:text-teal-200 ml-1 underline'>
                here.
              </Link>
            </p>
            <p className='text-sm'>
              For code-related or commercial inquiries, please contact any of them: Prof. Dong Xu (
              <a className='underline' href='mailto:xudong@missouri.edu'>
                xudong@missouri.edu
              </a>
              ), Dr. Gyan P. Srivastava (
              <a href='mailto:gps8b9@missouri.edu' className='underline'>
                gps8b9@missouri.edu
              </a>
              ), Dr. Muneendra Ojha (
              <a href='mailto:muneendra@iiita.ac.in' className='underline'>
                muneendra@iiita.ac.in
              </a>
              ).
            </p>
          </div>
        </div>
        <hr className='my-2' />
        <p className='text-xs'>
          <a href='/' className='hover:underline'>
            Target & Biomarker Exploration Portal
          </a>{' '}
          &copy; {new Date().getFullYear()} is licensed under{' '}
          <a
            href='https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1'
            target='_blank'
            rel='license noopener noreferrer'
            className='flex'
          >
            CC BY-NC 4.0
            <img
              style={{
                height: '22px',
                marginLeft: '3px',
                verticalAlign: 'text-bottom',
              }}
              src='https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1'
              alt=''
            />
            <img
              style={{
                height: '22px',
                marginLeft: '3px',
                verticalAlign: 'text-bottom',
              }}
              src='https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1'
              alt=''
            />
            <img
              style={{
                height: '22px',
                marginLeft: '3px',
                verticalAlign: 'text-bottom',
              }}
              src='https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1'
              alt=''
            />
          </a>
        </p>
      </div>
    </footer>
  );
}

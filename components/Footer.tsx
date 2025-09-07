import Image from 'next/image';
import Link from 'next/link';
import { collaborators, footerLinks } from '@/lib/data';

export default function Footer() {
  return (
    <footer className='relative bottom-0 bg-teal-800 p-4 text-white'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='flex flex-col'>
            <h3 className='mb-4 font-semibold text-lg'>Quick Links</h3>
            <div className='grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2'>
              {footerLinks.map(link => (
                <Link key={link.href} href={link.href} className='mb-2 hover:text-teal-200'>
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex flex-col'>
            <h3 className='mb-4 font-semibold text-lg'>Collaborating Institutions</h3>
            {collaborators.map(institution => (
              <Link
                key={institution.href}
                href={institution.href}
                target='_blank'
                className='mb-2 flex cursor-pointer items-center hover:text-teal-200'
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
            <h3 className='font-semibold text-lg'>Contact</h3>
            <p>
              For any usage queries, please refer to documentation or contact our team via email
              <Link href='/team' className='ml-1 text-teal-300 underline hover:text-teal-200'>
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
            <Image
              style={{
                height: '22px',
                marginLeft: '3px',
                verticalAlign: 'text-bottom',
              }}
              src='https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1'
              alt=''
              width={22}
              height={22}
            />
            <Image
              style={{
                height: '22px',
                marginLeft: '3px',
                verticalAlign: 'text-bottom',
              }}
              src='https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1'
              alt=''
              width={22}
              height={22}
            />
            <Image
              style={{
                height: '22px',
                marginLeft: '3px',
                verticalAlign: 'text-bottom',
              }}
              src='https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1'
              alt=''
              width={22}
              height={22}
            />
          </a>
        </p>
      </div>
    </footer>
  );
}

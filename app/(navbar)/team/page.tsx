import Image from 'next/image';
import { team } from '@/lib/data';

export default function TeamPage() {
  return (
    <>
      {team.map(category => (
        <div key={category.heading} className='mb-4'>
          <div id={category.heading}>
            <h2 className='mb-4 text-center font-semibold text-3xl text-primary'>{category.heading}</h2>
            <div className={'flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row'}>
              {category.members.map(person => (
                <div
                  key={person.name}
                  className='flex min-h-80 w-80 flex-col items-center rounded-lg border p-4 transition-shadow hover:shadow-lg'
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={170}
                    height={170}
                    className='aspect-square rounded-full border border-primary object-cover p-2 hover:shadow-md'
                  />
                  <center>
                    <a href={person.link}>
                      <h3
                        className={`text-xl ${person.link && 'underline-offset-4 transition-colors hover:text-accent hover:underline'} mt-2 font-semibold`}
                      >
                        {person.name}
                      </h3>
                    </a>
                    {person.role && <h4 className='text-md text-primary'>{person.role}</h4>}
                    {person.title.split('\n').map((title, _index) => (
                      <p key={title} className='text-gray-600 text-sm'>
                        {title}
                      </p>
                    ))}
                    <a href={`mailto: ${person.email}`} className='underline'>
                      {person.email}
                    </a>
                  </center>
                </div>
              ))}
            </div>
          </div>
          <hr className='mt-4' />
        </div>
      ))}
    </>
  );
}

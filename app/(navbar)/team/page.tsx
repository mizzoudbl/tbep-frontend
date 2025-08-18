import Image from 'next/image';
import { team } from '@/lib/data';

export default function TeamPage() {
  return (
    <>
      {team.map(category => (
        <div key={category.heading} className='mb-4'>
          <div id={category.heading}>
            <h2 className='text-3xl text-primary text-center font-semibold mb-4'>{category.heading}</h2>
            <div className={'flex justify-center items-center flex-col md:flex-row flex-wrap gap-4'}>
              {category.members.map(person => (
                <div
                  key={person.name}
                  className='border p-4 w-80 min-h-80 rounded-lg hover:shadow-lg transition-shadow flex flex-col items-center'
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={170}
                    height={170}
                    className='object-cover aspect-square rounded-full border border-primary p-2 hover:shadow-md'
                  />
                  <center>
                    <a href={person.link}>
                      <h3
                        className={`text-xl ${person.link && 'transition-colors hover:text-accent hover:underline underline-offset-4'}  font-semibold mt-2`}
                      >
                        {person.name}
                      </h3>
                    </a>
                    {person.title.split('\n').map((title, _index) => (
                      <p key={title} className='text-sm text-gray-600'>
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

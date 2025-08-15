import { getStartedLinks } from '@/lib/data';
import { Link } from 'next-view-transitions';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container mx-auto'>
      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='w-full flex gap-4 flex-col'>
          <div className='container'>{children}</div>
        </div>
      </div>
      <section className='flex flex-col items-center mt-10'>
        <h1 className='md:text-4xl text-2xl font-semibold tracking-tight'>About The Tool</h1>
        <div className='text-center my-4 mx-12 space-y-2'>
          <p>
            TBEP is an advanced network-based bioinformatics tool that accelerates drug target and biomarker discovery
            using network analysis. It integrates deep multimodal datasets to uncover causal disease mechanisms linked
            to specific phenotypes. Built on a cloud-based architecture, TBEP enables real-time processing of
            large-scale biological data.{' '}
          </p>
          <p>
            Additionally, it features a large language model (LLM) as an exploration assistant, helping researchers
            interpret complex biological relationships. While the LLM currently operates separately from the network,
            future iterations will enhance its integration for deeper insights.
          </p>
        </div>
        <h1 className='md:text-4xl mt-4 text-2xl font-semibold tracking-tight'>
          <b className='bg-gradient-to-r from-teal-800 via-teal-600 to-teal-800 bg-clip-text text-transparent'>
            Get Started
          </b>{' '}
          with the Tool
        </h1>
        <div className='flex justify-center gap-4 mt-4'>
          {getStartedLinks.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className='group relative flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:-translate-y-1'
            >
              <div className='relative'>
                <div className='absolute inset-0 rotate-45 scale-110 bg-teal-800/10 rounded-lg transition-all duration-300 group-hover:rotate-90 group-hover:scale-125' />
                <div className='relative bg-teal-800 text-white p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-800/20'>
                  {item.icon}
                </div>
              </div>
              <h3 className='mt-6 text-lg font-semibold text-gray-900'>{item.title}</h3>
              <p className='mt-2 text-sm text-gray-600'>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

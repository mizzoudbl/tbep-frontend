import aboutImage from '@/public/image/about-architecture.jpg';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className='flex flex-col space-y-8 items-center'>
      <div>
        <h1 className='text-2xl font-bold mb-2'>About The Tool</h1>
        <p>
          We present a novel web-based bioinformatics tool designed to facilitate the identification of novel
          therapeutic targets and biomarkers for drug discovery. The tool integrates multi-omics datasets rooted in
          human genetics and utilizes experimentally validated protein-protein interaction (PPI) networks to perform
          genome-wide analyses of proteins that physically interact with genes responsible for disease phenotypes. A key
          feature of this tool is its real-time large-scale data processing capability, enabled by its efficient
          architecture and cloud-based framework. Additionally, the tool incorporates an integrated large language model
          (LLM) to assist scientists in exploring biological insights from the generated network and multi-omics data.
          The LLM enhances the interpretation and exploration of complex biological relationships, offering a more
          interactive and intuitive analysis experience. This integration of multi-omics data, PPI networks, and
          AI-driven exploration provides a powerful framework for accelerating the discovery of novel drug targets
        </p>
      </div>
      <div>
        <h1 className='text-2xl font-bold mb-2'>Tool Architecture</h1>
        <p>
          The tool consists of three core components: a <span className='font-semibold underline'>knowledge graph</span>
          , which maps relationships between pathways, targets, and diseases; a{' '}
          <span className='font-semibold underline'>knowledge base</span>, which collects multi-omics data information
          from various sources; and a{'  '}
          <span className='font-semibold underline'>knowledge bot</span>, which responds with the exact compact answer
          useful for the analytics along with relevant references and citations. Below is the high-level architecture
          diagram, explaining the same:
        </p>
      </div>
      <Image src={aboutImage} alt='about-architecture' className='w-2/3 shadow-md border rounded-md' />
    </div>
  );
}

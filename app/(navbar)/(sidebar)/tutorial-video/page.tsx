import tutorialVideos from '@/lib/data/tutorial-video.json';
import { Link } from 'next-view-transitions';

export default function TutorialVideoPage() {
  return (
    <div className='rounded-md shadow-md p-4'>
      <div className='space-y-8'>
        {tutorialVideos.map(video => (
          <div key={video.title} className='flex flex-col lg:flex-row gap-4'>
            <div>
              <h3 className='text-xl font-semibold mb-2'>{video.title}</h3>
              <p className='mb-4'>{video.description}</p>
            </div>
            <video width={400} controls preload='metadata' className='aspect-video rounded-md shadow-md border'>
              <source src={video.videoSrc} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
      For more tutorial videos, visit our documentation's{' '}
      <Link href='/docs/use-cases-and-short-help-videos' className='underline hover:opacity-75 text-primary'>
        tutorial section
      </Link>
      .
    </div>
  );
}

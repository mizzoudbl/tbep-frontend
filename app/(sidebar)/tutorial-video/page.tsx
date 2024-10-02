export default function TutorialVideoPage() {
  return (
    <div>
      <div className='space-y-8'>
        <div className="flex gap-4">
          <div>
            <h3 className='text-xl font-semibold mb-2'>Basic Overview of Platform</h3>
            <p className='mb-4'>
              Welcome to our tool, an Interactive Network Visualization tool. Please watch the video to see how to
              generate the network visualization.
            </p>
          </div>
          <div className='aspect-w-16 aspect-h-9'>
            {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
            <video width={700} controls preload='metadata'>
              <source src='/video/Intro_of_tool.mp4' type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="flex gap-4 flex-row-reverse">
          <div>
            <h3 className='text-xl font-semibold mb-2'>Network Analysis</h3>
            <p className='mb-4'>
              Our tool allows you to analyze the network. Please watch the video to see how to achieve it.
            </p>
          </div>
          <div className='aspect-w-16 aspect-h-9'>
            {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
            <video width={470} controls preload='metadata'>
              <source src='/video/Network_analysis.mp4' type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

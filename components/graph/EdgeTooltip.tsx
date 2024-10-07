import type { EdgeAttributes } from '@/lib/interface';

export function EdgeTooltip({ edge, x, y }: { edge: EdgeAttributes; x: number; y: number }) {
  if (!edge) return null;

  return (
    <div
      className='absolute z-10 p-4 bg-white rounded-lg shadow-lg border border-gray-200'
      style={{
        left: `${x + 10}px`,
        top: `${y + 10}px`,
      }}
    >
      <div className='space-y-1'>
        <p>
          <span className='font-semibold'>Score:</span> {edge.score}
        </p>
      </div>
    </div>
  );
}

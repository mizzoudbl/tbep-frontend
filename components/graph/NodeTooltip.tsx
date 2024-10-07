import type { NodeAttributes } from '@/lib/interface';

export function NodeTooltip({ node, x, y }: { node: NodeAttributes; x: number; y: number }) {
  if (!node) return null;

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
          <span className='font-semibold'>Name:</span> {node.label}
        </p>
        <p>
          <span className='font-semibold'>ENSG ID:</span> {node.ID}
        </p>
        <p>
          <span className='font-semibold'>Description:</span> {node.Description}
        </p>
      </div>
    </div>
  );
}

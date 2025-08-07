'use client';
import { XSquareIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Cell, Pie, PieChart, type TooltipProps } from 'recharts';
import { Button } from '../ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { ScrollArea } from '../ui/scroll-area';

const CustomTooltip = ({ active, payload }: TooltipProps<string, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='p-2 bg-white border border-gray-200 shadow-md rounded-md'>
        <p className='font-bold text-primary'>{data.name}</p>
        <p>Percentage: {data.percentage}%</p>
        <p>Gene Count: {data.count}</p>
        <p>Average Degree: {data.averageDegree}</p>
        <p className='italic mt-1 text-sm'>Click to view genes</p>
      </div>
    );
  }
  return null;
};

export function LeidenPieChart({
  data,
}: {
  data: {
    name: string;
    genes: string[];
    color: string;
    percentage: string;
    averageDegree: string;
    degreeCentralGene: string;
  }[];
}) {
  const [selectedClusterIndex, setSelectedClusterIndex] = useState<number | null>(null);

  return (
    <>
      <ChartContainer
        className='max-h-[65vh] w-[70%] aspect-square [&_.recharts-pie-label-text]:fill-foreground'
        config={data.reduce<Record<string, { label: string; color: string }>>((acc, c) => {
          acc[c.name] = {
            label: c.name,
            color: c.color,
          };
          return acc;
        }, {})}
      >
        <PieChart>
          <ChartTooltip content={<CustomTooltip />} />
          <Pie
            data={data.map(c => ({
              name: c.name,
              count: c.genes.length,
              percentage: +c.percentage,
              averageDegree: +c.averageDegree,
              fill: `var(--color-${c.name})`,
              genes: c.genes,
            }))}
            dataKey='percentage'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={150}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            onClick={(_, idx) => setSelectedClusterIndex(idx)}
          >
            {data.map(entry => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <AnimatePresence>
        {selectedClusterIndex !== null && (
          <motion.div
            key='gene-list'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='p-4 border rounded shadow bg-white'
          >
            <div className='flex gap-2'>
              <h3 className='font-bold mb-2'>Genes in {data[selectedClusterIndex].name}:</h3>
              <button
                type='button'
                onClick={() => setSelectedClusterIndex(null)}
                className='flex text-gray-500 hover:text-gray-700'
              >
                <XSquareIcon size={20} />
              </button>
            </div>
            <ScrollArea className='h-[55vh] border rounded'>
              <ul className='list-disc pl-6'>
                {data[selectedClusterIndex].genes.map(gene => (
                  <li key={gene}>{gene}</li>
                ))}
              </ul>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

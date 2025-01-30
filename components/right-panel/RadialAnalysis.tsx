'use client';

import { radialAnalysisOptions } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import type { RadialAnalysisProps, RadialAnalysisSetting } from '@/lib/interface';
import { Info } from 'lucide-react';
import React from 'react';
import { VirtualizedCombobox } from '../VirtualizedCombobox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function RadialAnalysis({ value, onChange }: RadialAnalysisProps) {
  const [minScore, setMinScore] = React.useState(0);
  const [isGeneDegree, setIsGeneDegree] = React.useState(true);
  const radioOptions = useStore(state => state.radioOptions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const minScore = Number(JSON.parse(localStorage.getItem('graphConfig') ?? '{}').minScore) ?? 0;
    setMinScore(minScore);
    onChange(minScore, 'edgeWeightCutOff');
  }, []);

  return (
    <div className='flex flex-col gap-1'>
      {radialAnalysisOptions.map((option, idx) => (
        <div key={option.key} className='space-y-1'>
          <div className='flex space-x-2 items-center'>
            <div className='flex flex-col space-y-2 w-full'>
              <Label htmlFor={option.key} className='text-xs font-semibold flex gap-1 items-center'>
                {option.label}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={12} />
                  </TooltipTrigger>
                  <TooltipContent align='end'>
                    <p className='max-w-60'>{option.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Slider
                id={option.key}
                min={option.key === 'edgeWeightCutOff' ? minScore : option.min}
                max={option.key === 'nodeDegreeCutOff' && !isGeneDegree ? 1 : option.max}
                step={option.key === 'nodeDegreeCutOff' && !isGeneDegree ? 0.01 : option.step}
                value={[value[option.key]]}
                onValueChange={value => onChange(value[0], option.key as keyof RadialAnalysisSetting)}
              />
              {option.key === 'nodeDegreeCutOff' && (
                <VirtualizedCombobox
                  data={['Gene Degree', ...radioOptions.database.TE, ...radioOptions.user.TE]}
                  width='550px'
                  align='end'
                  value={value.nodeDegreeProperty}
                  className='w-full'
                  setValue={value => {
                    setIsGeneDegree(value === 'Gene Degree');
                    onChange(value, 'nodeDegreeProperty');
                  }}
                />
              )}
            </div>
            <Input
              type='number'
              className='w-14'
              min={option.min}
              max={option.max}
              step={option.step}
              value={value[option.key]}
              onChange={e => onChange(Number.parseFloat(e.target.value), option.key as keyof RadialAnalysisSetting)}
            />
          </div>
          {idx !== radialAnalysisOptions.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
}

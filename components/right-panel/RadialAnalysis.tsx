'use client';

import { radialAnalysisOptions } from '@/lib/data';
import type { RadialAnalysisProps, RadialAnalysisSetting } from '@/lib/interface';
import { ChevronsUpDown } from 'lucide-react';
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function RadialAnalysis({ value, onChange }: RadialAnalysisProps) {
  const [minScore, setMinScore] = React.useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const minScore: number = JSON.parse(localStorage.getItem('graphConfig') || '{}').minScore || 0;
    setMinScore(minScore);
    onChange(minScore, 'edgeWeightCutOff');
    console.log(minScore);
  }, []);

  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <CollapsibleTrigger asChild>
        <div className='flex items-center justify-between w-full'>
          <p className='font-bold cursor-pointer hover:underline'>Radial Analysis</p>
          <ChevronsUpDown size={20} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='flex flex-col gap-2 mt-2'>
        <div key={'edgeWeightCutOff'} className='flex space-x-2 items-center'>
          <Tooltip>
            <div className='flex flex-col space-y-2 w-full'>
              <TooltipTrigger asChild>
                <Label htmlFor={'edgeWeightCutOff'} className='text-xs font-semibold'>
                  {'Edge Weight Cut-off'}
                </Label>
              </TooltipTrigger>
              <Slider
                id={'edgeWeightCutOff'}
                className='w-full'
                min={0}
                max={1}
                step={0.1}
                value={[value.edgeWeightCutOff]}
                onValueChange={value => onChange(value[0], 'edgeWeightCutOff' as keyof RadialAnalysisSetting)}
              />
            </div>
            <TooltipContent>
              <p>Removes edges with weight less than the cut-off value</p>
            </TooltipContent>
          </Tooltip>
          <Input
            type='number'
            className='w-16 h-8'
            min={minScore}
            max={1}
            step={0.1}
            value={value.edgeWeightCutOff}
            onChange={e =>
              onChange(Number.parseFloat(e.target.value), 'edgeWeightCutOff' as keyof RadialAnalysisSetting)
            }
          />
        </div>
        {radialAnalysisOptions.map(option => (
          <div key={option.key} className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor={option.key} className='text-xs font-semibold'>
                    {option.label}
                  </Label>
                </TooltipTrigger>
                <Slider
                  id={option.key}
                  className='w-full'
                  min={option.min}
                  max={option.max}
                  step={option.step}
                  value={[
                    option.key === 'nodeDegreeCutOff'
                      ? value.nodeDegreeCutOff
                      : option.key === 'hubGeneEdgeCount'
                        ? value.hubGeneEdgeCount
                        : 0,
                  ]}
                  onValueChange={value => onChange(value[0], option.key as keyof RadialAnalysisSetting)}
                />
              </div>
              <TooltipContent>
                <p>{option.tooltip}</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-16 h-8'
              min={option.min}
              max={option.max}
              step={option.step}
              value={
                option.key === 'nodeDegreeCutOff'
                  ? value.nodeDegreeCutOff
                  : option.key === 'hubGeneEdgeCount'
                    ? value.hubGeneEdgeCount
                    : undefined
              }
              onChange={e => onChange(Number.parseFloat(e.target.value), option.key as keyof RadialAnalysisSetting)}
            />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

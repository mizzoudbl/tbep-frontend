'use client';

import { radialAnalysisOptions } from '@/lib/data';
import type { RadialAnalysisProps, RadialAnalysisSetting } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { ChevronsUpDown } from 'lucide-react';
import React from 'react';
import { Combobox } from '../ComboBox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function RadialAnalysis({ value, onChange }: RadialAnalysisProps) {
  const [minScore, setMinScore] = React.useState(0);
  const [isGeneDegree, setIsGeneDegree] = React.useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const minScore = Number(JSON.parse(localStorage.getItem('graphConfig') ?? '{}').minScore) ?? 0;
    setMinScore(minScore);
    onChange(minScore, 'edgeWeightCutOff');
  }, []);

  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <CollapsibleTrigger asChild>
        <div className='flex items-center justify-between w-full'>
          <p className='font-bold cursor-pointer hover:underline'>Radial Analysis</p>
          <ChevronsUpDown size={20} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='flex flex-col gap-1'>
        {radialAnalysisOptions.map((option, idx) => (
          <div key={option.key} className='space-y-1'>
            <div className='flex space-x-2 items-center'>
              <Tooltip>
                <div className='flex flex-col space-y-2 w-full'>
                  <TooltipTrigger asChild>
                    <Label htmlFor={option.key} className='text-xs font-semibold'>
                      {option.label}
                    </Label>
                  </TooltipTrigger>
                  <Slider
                    id={option.key}
                    min={option.key === 'edgeWeightCutOff' ? minScore : option.min}
                    max={option.key === 'nodeDegreeCutOff' && !isGeneDegree ? 1 : option.max}
                    step={option.key === 'nodeDegreeCutOff' && !isGeneDegree ? 0.01 : option.step}
                    value={[value[option.key]]}
                    onValueChange={value => onChange(value[0], option.key as keyof RadialAnalysisSetting)}
                  />
                  {option.key === 'nodeDegreeCutOff' && (
                    <Combobox
                      data={[
                        { value: 'geneDegree', label: 'Gene Degree' },
                        ...useStore.getState().radioOptions.database.TE.map(item => ({ value: item, label: item })),
                        ...useStore.getState().radioOptions.user.TE.map(item => ({ value: item, label: item })),
                      ]}
                      value={value.nodeDegreeProperty}
                      className='w-full'
                      onChange={value => {
                        setIsGeneDegree(value === 'geneDegree');
                        onChange(value, 'nodeDegreeProperty');
                      }}
                    />
                  )}
                </div>
                <TooltipContent>
                  <p>{option.tooltip}</p>
                </TooltipContent>
              </Tooltip>
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
      </CollapsibleContent>
    </Collapsible>
  );
}

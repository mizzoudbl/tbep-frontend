'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type ActionsProps = ComponentProps<'div'>;

export const Actions = ({ className, children, ...props }: ActionsProps) => (
  <div className={cn('flex items-center gap-1', className)} {...props}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const Action = ({
  tooltip,
  children,
  label,
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}: ActionProps) => {
  const button = (
    <Button
      className={cn('relative size-7 p-0.5 text-muted-foreground hover:text-foreground', className)}
      size={size}
      type='button'
      variant={variant}
      {...props}
    >
      {children}
      <span className='sr-only'>{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side='bottom'>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export const CopyAction = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <Action
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      label='Copy'
      tooltip='Copy'
    >
      {copied ? <CheckIcon className='size-3' /> : <CopyIcon className='size-3' />}
    </Action>
  );
};

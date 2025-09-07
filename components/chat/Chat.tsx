import { SendIcon, Trash2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import React, { createRef } from 'react';
import { toast } from 'sonner';
import { LLM_MODELS } from '@/lib/data';
import type { Message } from '@/lib/interface';
import { envURL } from '@/lib/utils';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Markdown } from '.';

export function Chat() {
  const [inputValue, setInputValue] = React.useState('');
  const [model, setModel] = React.useState<(typeof LLM_MODELS)[number]['value']>(LLM_MODELS[0].value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const chatRef = createRef<HTMLDivElement>();

  const handleSubmit = async (
    e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    const newMessage: Message = { content: inputValue, role: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setIsLoading(true);
    setInputValue('');
    setIsChatOpen(true);

    try {
      const response = await fetch(`${envURL(process.env.NEXT_PUBLIC_LLM_BACKEND_URL)}/chat`, {
        method: 'POST',
        body: JSON.stringify({ question: inputValue, model, prevMessages: messages }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        toast.error('Failed to fetch response from LLM', {
          cancel: { label: 'Close', onClick() {} },
          description: 'LLM server is not responding. Please try again later.',
        });
        return;
      }
      const { streamID } = await response.json();

      const event = new EventSource(`${envURL(process.env.NEXT_PUBLIC_LLM_BACKEND_URL)}/stream?sid=${streamID}`);
      event.onopen = () => {
        const llmResponse: Message = {
          content: '',
          role: 'assistant',
        };
        setIsLoading(false);
        setMessages(prevMessages => [...prevMessages, llmResponse]);
      };

      event.onmessage = e => {
        setMessages(prevMessages => [
          ...prevMessages.slice(0, -1),
          {
            role: 'assistant',
            content: prevMessages[prevMessages.length - 1].content + e.data,
          },
        ]);
      };

      event.onerror = () => {
        event.close();
      };
    } catch (_error) {
      toast.error('Failed to fetch response from LLM');
      return;
    }
  };

  const handleDeleteMessages = () => {
    setMessages([]);
    setIsChatOpen(false);
  };

  return (
    <div className='mt-4 flex flex-col rounded-lg border p-4 shadow-md'>
      {isChatOpen && (
        <div className='space-y-2 p-2'>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className='flex justify-between border-b pb-2'>
              Chat with LLM
              <button type='button' onClick={handleDeleteMessages} className='text-gray-500 hover:text-gray-700'>
                <Trash2Icon className='size-5' />
              </button>
            </div>
            <div ref={chatRef} className='max-h-[70vh] space-y-2 overflow-y-scroll p-2'>
              {messages.map(message => (
                <div
                  key={`${message.content}-${message.role}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-full rounded-lg px-4 py-1 ${
                      message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Markdown>{message.content}</Markdown>
                    ) : (
                      <pre className='whitespace-pre-wrap'>{message.content}</pre>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className='flex justify-start'>
                  <div className='w-full max-w-xs rounded-lg bg-gray-200 p-4'>
                    <Skeleton className='mb-2 h-4 w-3/4 bg-gray-300' />
                    <Skeleton className='h-4 w-1/2 bg-gray-300' />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      <div className='flex items-center space-x-2'>
        <Textarea
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder='To chat with LLM, Type your message...'
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
          className='min-h-10 rounded-md px-4 py-2'
        />
        <Button type='submit' size='icon' disabled={isLoading || inputValue.trim() === ''} onClick={handleSubmit}>
          <SendIcon className='size-5' />
        </Button>
      </div>
      <div className='mt-2 flex'>
        <Select value={model} onValueChange={value => setModel(value as typeof model)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className='w-[110px] shrink-0'>
                <SelectValue placeholder='Select model' />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent> Choose a model to interact with</TooltipContent>
          </Tooltip>
          <SelectContent>
            {LLM_MODELS.map(model => (
              <SelectItem key={model.value} value={model.value}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <center className='ml-0.5 text-gray-500 text-sm'>
          This AI assistant may occasionally generate incorrect or misleading information. We are not responsible for
          any decisions made based on the generated content. By using this service, you agree to our{' '}
          <Link href='/docs/terms-of-use' className='font-medium underline underline-offset-4 hover:text-primary'>
            Terms of Use
          </Link>{' '}
          and{' '}
          <Link href='/docs/privacy-policy' className='font-medium underline underline-offset-4 hover:text-primary'>
            Privacy Policy
          </Link>
          .
        </center>
      </div>
    </div>
  );
}

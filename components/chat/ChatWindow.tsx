'use client';

import {
  ChevronDownIcon,
  GripHorizontalIcon,
  MessageCircleIcon,
  SendIcon,
  Trash2Icon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import { AnimatePresence, motion, type PanInfo, useDragControls } from 'motion/react';
import Link from 'next/link';
import React, { createRef } from 'react';
import { toast } from 'sonner';
import { LLM_MODELS } from '@/lib/data';
import type { Message } from '@/lib/interface';
import { envURL } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Markdown } from '.';

export function ChatWindow() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [model, setModel] = React.useState<(typeof LLM_MODELS)[number]['value']>(LLM_MODELS[0].value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [isChatInitiated, setIsChatInitiated] = React.useState(false);
  const [chatHeight, setChatHeight] = React.useState<number | null>(null);
  const chatRef = createRef<HTMLDivElement>();
  const [showAlert, setShowAlert] = React.useState(true);

  React.useEffect(() => {
    const show = localStorage.getItem('showAlert');
    if (show !== 'false') {
      setShowAlert(true);
    }
  }, []);

  const handleSubmit = async (e: React.KeyboardEvent<HTMLTextAreaElement> | React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newMessage: Message = { content: inputValue, role: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsChatOpen(true);
    setIsChatInitiated(true);
    try {
      const response = await fetch(`${envURL(process.env.NEXT_PUBLIC_LLM_BACKEND_URL)}/chat`, {
        method: 'POST',
        body: JSON.stringify({ question: inputValue, model, prevMessages: messages }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 400) {
        toast.error(await response.json().then(r => r.message ?? 'Error'), {
          cancel: { label: 'Close', onClick() {} },
          description: 'Please use another model or try again later.',
        });
        return;
      }
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
        setIsTyping(true);
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
        setIsTyping(false);
        event.close();
      };
    } catch (_error) {
      toast.error('Failed to fetch response from LLM');
      return;
    }
  };

  const handleDeleteMessages = () => {
    setMessages([]);
    setIsChatInitiated(false);
    setIsChatOpen(false);
    setIsTyping(false);
  };

  const dragControls = useDragControls();
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newHeight = (chatHeight ?? window.innerHeight - 100) - info.delta.y;
    if (newHeight >= 150 && newHeight <= window.innerHeight - 100) {
      setChatHeight(newHeight);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: I won't write reason
  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const textAreaRef = React.useRef<HTMLDivElement>(null);

  return (
    <form onSubmit={handleSubmit} className='relative mx-auto flex h-[10%] w-full flex-col items-center'>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ height: chatHeight ?? '85vh' }}
            className='absolute bottom-[10vh] m-1 w-[98%] overflow-hidden rounded-lg shadow-lg backdrop-blur-sm'
          >
            <motion.div
              drag='y'
              dragControls={dragControls}
              onDrag={handleDrag}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              className='flex h-4 w-full cursor-ns-resize items-center justify-center bg-gray-200'
            >
              <GripHorizontalIcon className='size-4 text-gray-400' />
            </motion.div>
            <div className='flex items-center justify-between border-b bg-gray-100 p-4'>
              <div className='flex items-center gap-4'>
                <h2 className='font-semibold text-lg'>Chat with LLM </h2>
              </div>
              <div className='flex items-center space-x-8'>
                <button type='button' onClick={handleDeleteMessages} className='text-gray-500 hover:text-gray-700'>
                  <Trash2Icon className='size-5' />
                </button>
                <button
                  type='button'
                  onClick={() => setIsChatOpen(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <ChevronDownIcon className='size-6' />
                </button>
              </div>
            </div>
            <div ref={chatRef} className='max-h-[87%] space-y-2 overflow-y-scroll p-2'>
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
                    <Markdown>{message.content}</Markdown>
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
            {showAlert && (
              <center>
                <Alert className='w-3/4'>
                  <TriangleAlertIcon size={20} />
                  <AlertTitle className='flex w-full items-center justify-between font-bold'>
                    Disclaimer{' '}
                    <XIcon
                      size={15}
                      className='m-2 rounded hover:border'
                      onClick={() => {
                        setShowAlert(false);
                        localStorage.setItem('showAlert', 'false');
                      }}
                    />
                  </AlertTitle>
                  <AlertDescription>
                    <p className='items-center text-sm'>
                      This AI assistant may occasionally generate incorrect or misleading information. We are not
                      responsible for any decisions made based on the generated content. By using this service, you
                      agree to our{' '}
                      <Link
                        href='/docs/terms-of-use'
                        className='font-medium underline underline-offset-4 hover:text-primary'
                      >
                        Terms of Use
                      </Link>{' '}
                      and{' '}
                      <Link
                        href='/docs/privacy-policy'
                        className='font-medium underline underline-offset-4 hover:text-primary'
                      >
                        Privacy Policy
                      </Link>
                      . <b>Also, currently this graph is not connected to the AI assistant.</b>
                    </p>
                  </AlertDescription>
                </Alert>
              </center>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className='mb-4 flex h-full w-full' ref={textAreaRef}>
        <div className='relative flex w-[97%]'>
          <Select value={model} onValueChange={value => setModel(value as typeof model)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className='-top-10 absolute right-5 w-[110px] shrink-0 backdrop-blur-xs'>
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
          <Textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder='To chat with LLM, Type your message...'
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            className='ml-2 resize-none rounded-md px-4 py-2'
          />
          <button type='submit' className='relative right-8 text-blue-500 hover:text-blue-600'>
            <SendIcon className='size-5' />
          </button>
        </div>
        {!isChatOpen && isChatInitiated && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsChatOpen(true)}
            className='relative right-4 h-10 self-end rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-blue-600'
          >
            <MessageCircleIcon className='size-6' />
          </motion.button>
        )}
      </div>
    </form>
  );
}

'use client';

import { LLM_MODELS } from '@/lib/data';
import type { Message } from '@/lib/interface';
import { envURL } from '@/lib/utils';
import { AnimatePresence, type PanInfo, motion, useDragControls } from 'framer-motion';
import {
  ChevronDownIcon,
  GripHorizontalIcon,
  MessageCircleIcon,
  SendIcon,
  Trash2Icon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import React, { createRef } from 'react';
import { toast } from 'sonner';
import { Markdown } from '.';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

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
        body: JSON.stringify({ question: inputValue, model }),
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
    } catch (error) {
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
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newHeight = (chatHeight ?? window.innerHeight - 100) - info.delta.y;
    if (newHeight >= 150 && newHeight <= window.innerHeight - 100) {
      setChatHeight(newHeight);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const textAreaRef = React.useRef<HTMLDivElement>(null);

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto h-[10%] relative flex flex-col items-center'>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ height: chatHeight ?? '85vh' }}
            className='absolute bottom-[10vh] m-1 backdrop-blur rounded-lg shadow-lg overflow-hidden w-[98%]'
          >
            <motion.div
              drag='y'
              dragControls={dragControls}
              onDrag={handleDrag}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              className='cursor-ns-resize h-4 w-full bg-gray-200 flex items-center justify-center'
            >
              <GripHorizontalIcon className='w-4 h-4 text-gray-400' />
            </motion.div>
            <div className='flex justify-between items-center p-4 bg-gray-100 border-b'>
              <div className='flex items-center gap-4'>
                <h2 className='text-lg font-semibold'>Chat with LLM </h2>
              </div>
              <div className='flex items-center space-x-8'>
                <button type='button' onClick={handleDeleteMessages} className='text-gray-500 hover:text-gray-700'>
                  <Trash2Icon className='w-5 h-5' />
                </button>
                <button
                  type='button'
                  onClick={() => setIsChatOpen(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <ChevronDownIcon className='w-6 h-6' />
                </button>
              </div>
            </div>
            <div ref={chatRef} className='max-h-[87%] overflow-y-scroll p-2 space-y-2'>
              {messages.map(message => (
                <div
                  key={`${message.content}-${message.role}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-full px-4 py-1 rounded-lg ${
                      message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className='flex justify-start'>
                  <div className='bg-gray-200 rounded-lg p-4 max-w-xs w-full'>
                    <Skeleton className='h-4 bg-gray-300 w-3/4 mb-2 ' />
                    <Skeleton className='h-4 bg-gray-300 w-1/2 ' />
                  </div>
                </div>
              )}
            </div>
            {showAlert && (
              <center>
                <Alert className='w-3/4'>
                  <TriangleAlertIcon size={20} />
                  <AlertTitle className='font-bold flex w-full justify-between items-center'>
                    Disclaimer{' '}
                    <XIcon
                      size={15}
                      className='hover:border rounded m-2'
                      onClick={() => {
                        setShowAlert(false);
                        localStorage.setItem('showAlert', 'false');
                      }}
                    />
                  </AlertTitle>
                  <AlertDescription>
                    <p className='text-sm items-center'>
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
      <div className='flex w-full h-full mb-4' ref={textAreaRef}>
        <div className='relative flex w-[97%]'>
          <Select value={model} onValueChange={value => setModel(value as typeof model)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className='w-[110px] backdrop-blur-sm absolute -top-10 right-5 flex-shrink-0'>
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
            className='px-4 py-2 rounded-md resize-none ml-2'
          />
          <button type='submit' className='relative right-8  text-blue-500 hover:text-blue-600'>
            <SendIcon className='w-5 h-5' />
          </button>
        </div>
        {!isChatOpen && isChatInitiated && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsChatOpen(true)}
            className='relative self-end h-10 bg-blue-500 text-white rounded-full p-2 right-4 shadow-lg hover:bg-blue-600 transition-colors duration-200'
          >
            <MessageCircleIcon className='w-6 h-6' />
          </motion.button>
        )}
      </div>
    </form>
  );
}

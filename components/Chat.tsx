import type { Message } from '@/lib/interface';
import { envURL } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import { Link } from 'next-view-transitions';
import React, { createRef } from 'react';
import { toast } from 'sonner';
import { Markdown } from './Markdown';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Textarea } from './ui/textarea';

export default function Chat() {
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const chatRef = createRef<HTMLDivElement>();

  const handleSubmit = async (
    e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    const newMessage: Message = { text: inputValue, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setIsLoading(true);
    setInputValue('');
    setIsChatOpen(true);

    try {
      const response = await fetch(`${envURL(process.env.NEXT_PUBLIC_LLM_BACKEND_URL)}/chat`, {
        method: 'POST',
        body: JSON.stringify({ question: inputValue }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        toast.error('Failed to fetch response from LLM', {
          cancel: { label: 'Close', onClick() {} },
          position: 'top-center',
          richColors: true,
          description: 'LLM server is not responding. Please try again later.',
        });
        return;
      }
      const { streamID } = await response.json();

      const event = new EventSource(`${envURL(process.env.NEXT_PUBLIC_LLM_BACKEND_URL)}/stream?sid=${streamID}`);
      event.onopen = () => {
        const llmResponse: Message = {
          text: '',
          sender: 'llm',
        };
        setIsLoading(false);
        setIsTyping(true);
        setMessages(prevMessages => [...prevMessages, llmResponse]);
      };

      event.onmessage = e => {
        setMessages(prevMessages => [
          ...prevMessages.slice(0, -1),
          {
            sender: 'llm',
            text: prevMessages[prevMessages.length - 1].text + e.data,
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
    setIsChatOpen(false);
    setIsTyping(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
      window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight });
    }
  }, [isTyping]);

  return (
    <div className='rounded-lg shadow-md mt-4 p-4 flex flex-col'>
      {isChatOpen && (
        <div className='p-2 space-y-2'>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className='flex justify-between pb-2 border-b'>
              Chat with LLM
              <button type='button' onClick={handleDeleteMessages} className='text-gray-500 hover:text-gray-700'>
                <Trash2 className='w-5 h-5' />
              </button>
            </div>
            <div ref={chatRef} className='max-h-[70vh] overflow-y-scroll p-2 space-y-2'>
              {messages.map(message => (
                <div
                  key={`${message.text}-${message.sender}`}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-full px-4 py-1 rounded-lg ${
                      message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.sender === 'llm' ? (
                      <Markdown>{message.text}</Markdown>
                    ) : (
                      <pre className='whitespace-pre-wrap'>{message.text}</pre>
                    )}
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
          </motion.div>
        </div>
      )}
      <div className='flex items-center space-x-2'>
        <Textarea
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder='To chat with LLM, Type your message...'
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
          className='px-4 py-2 min-h-10 rounded-md'
        />
        <Button type='submit' size='icon' disabled={isLoading || inputValue.trim() === ''} onClick={handleSubmit}>
          <Send className='w-5 h-5' />
        </Button>
      </div>
      <center className='text-sm text-gray-500'>
        This AI assistant may occasionally generate incorrect or misleading information. We are not responsible for any
        decisions made based on the generated content. By using this service, you agree to our{' '}
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
  );
}

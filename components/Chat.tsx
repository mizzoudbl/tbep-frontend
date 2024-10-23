import { TypingAnimation } from '@/lib/hooks';
import type { Message } from '@/lib/interface';
import { motion } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import React from 'react';
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
  const chatRef = React.useRef<HTMLDivElement>(null);

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
      const response = await fetch(process.env.NEXT_PUBLIC_LLM_BACKEND_URL as string, {
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
      setIsLoading(false);
      setIsTyping(true);
      const llmResponse: Message = {
        text: await response.text(),
        sender: 'llm',
      };
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, llmResponse]);
      }, 1000);
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
      console.log('scrolling');
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
      window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight });
    }
  }, [isTyping]);

  return (
    <div className='rounded-lg shadow-md mt-4 p-4'>
      {isChatOpen && (
        <>
          <div className=' p-2 space-y-2'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className='flex justify-between pb-2 border-b'>
                Chat with LLM
                <button type='button' onClick={handleDeleteMessages} className='text-gray-500 hover:text-gray-700'>
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>
              <div ref={chatRef} className='max-h-[70vh] overflow-y-scroll p-2 space-y-2'>
                {messages.map((message, index) => (
                  <div
                    key={`${index}-${message.sender}`}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-full px-4 py-1 rounded-lg ${
                        message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.sender === 'llm' && index === messages.length - 1 && isTyping ? (
                        <TypingAnimation setIsTyping={setIsTyping} text={message.text} />
                      ) : message.sender === 'llm' ? (
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
          <hr />
        </>
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
    </div>
  );
}

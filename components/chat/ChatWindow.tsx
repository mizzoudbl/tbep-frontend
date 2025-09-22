'use client';

import {
  ChevronDownIcon,
  GripHorizontalIcon,
  MessageCircleIcon,
  Trash2Icon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import { AnimatePresence, motion, type PanInfo, useDragControls } from 'motion/react';
import Link from 'next/link';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ChatBase } from './ChatBase';

export function ChatWindow() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [chatHeight, setChatHeight] = React.useState<number | null>(null);

  const showAlert = typeof window !== 'undefined' ? localStorage.getItem('showAlert') !== 'false' : true;

  const dragControls = useDragControls();
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newHeight = (chatHeight ?? window.innerHeight - 150) - info.delta.y;
    if (newHeight >= 200 && newHeight <= window.innerHeight - 150) {
      setChatHeight(newHeight);
    }
  };

  return (
    <ChatBase onChatOpen={setIsChatOpen}>
      {({ messages, handleDeleteMessages, renderMessages, renderPromptInput }) => (
        <div className='relative mx-auto flex h-[12%] w-full flex-col items-center'>
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{ height: chatHeight ?? '80vh' }}
                className='absolute bottom-[13vh] w-[98%] overflow-hidden rounded-lg shadow-lg backdrop-blur-sm'
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
                    <h2 className='font-semibold text-lg'>Chat with TBEP Assistant</h2>
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
                <div className='max-h-[75vh] overflow-hidden'>
                  {renderMessages({
                    show: showAlert,
                    component: (
                      <center>
                        <Alert className='w-3/4'>
                          <TriangleAlertIcon size={20} />
                          <AlertTitle className='flex w-full items-center justify-between font-bold'>
                            Disclaimer{' '}
                            <XIcon
                              size={15}
                              className='m-2 rounded hover:border'
                              onClick={() => {
                                localStorage.setItem('showAlert', 'false');
                              }}
                            />
                          </AlertTitle>
                          <AlertDescription>
                            <p className='items-center text-sm'>
                              This AI assistant may occasionally generate incorrect or misleading information. We are
                              not responsible for any decisions made based on the generated content. By using this
                              service, you agree to our{' '}
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
                    ),
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className='flex h-full w-full'>
            <div className='relative flex w-full'>{renderPromptInput(true)}</div>
            {!isChatOpen && messages.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsChatOpen(true)}
                className='relative right-1 h-10 self-end rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-blue-600'
              >
                <MessageCircleIcon className='size-6' />
              </motion.button>
            )}
          </div>
        </div>
      )}
    </ChatBase>
  );
}

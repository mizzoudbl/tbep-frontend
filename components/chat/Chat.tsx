import { Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ChatBase } from './ChatBase';

export function Chat() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  return (
    <ChatBase onChatOpen={setIsChatOpen}>
      {({ handleDeleteMessages, renderMessages, renderPromptInput }) => (
        <div className='mt-4 flex flex-col rounded-lg border p-4 shadow-md'>
          {isChatOpen && (
            <div className='space-y-2 p-2'>
              <div className='fade-in animate-in duration-200'>
                <div className='flex justify-between border-b pb-2'>
                  Chat with TBEP Assistant
                  <button type='button' onClick={handleDeleteMessages} className='text-gray-500 hover:text-gray-700'>
                    <Trash2Icon className='size-5' />
                  </button>
                </div>
                {renderMessages()}
              </div>
            </div>
          )}
          <div className='mt-2 flex'>{renderPromptInput()}</div>
          <div className='mt-2 flex'>
            <center className='ml-0.5 text-gray-500 text-sm'>
              This AI assistant may occasionally generate incorrect or misleading information. We are not responsible
              for any decisions made based on the generated content. By using this service, you agree to our{' '}
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
      )}
    </ChatBase>
  );
}

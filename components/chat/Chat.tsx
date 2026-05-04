'use client';

import { BotIcon, Lightbulb, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { LLM_MODELS } from '@/lib/data';
import {
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
} from '../ai-elements/prompt-input';
import { ChatBase } from './ChatBase';

export function Chat() {
  return (
    <ChatBase onChatOpen={() => {}}>
      {({
        messages,
        handleDeleteMessages,
        renderMessages,
        inputValue,
        setInputValue,
        model,
        setModel,
        status,
        handleSubmit,
        handleSubmitAction,
      }) => (
        <div className='flex h-full min-h-0 flex-col rounded-lg border border-gray-200 bg-white shadow-sm'>
          <div className='flex shrink-0 items-center gap-3 border-b border-gray-100 px-5 py-4'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-md border border-teal-100 bg-teal-50'>
              <BotIcon className='size-5 text-teal-600' />
            </div>
            <div className='min-w-0'>
              <p className='font-semibold text-gray-900 text-sm'>AI Assistant</p>
              <p className='truncate text-gray-500 text-xs'>
                Ask questions about your gene network and get instant insights
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type='button'
                onClick={handleDeleteMessages}
                className='ml-auto shrink-0 text-gray-400 hover:text-gray-600'
              >
                <Trash2Icon className='size-4' />
              </button>
            )}
          </div>

          <div className='min-h-0 flex-1 overflow-y-auto'>
            {messages.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center gap-4 px-6 text-center'>
                <div className='flex size-14 items-center justify-center rounded-full bg-teal-600/10'>
                  <Lightbulb className='size-6 text-teal-600' />
                </div>
                <div>
                  <p className='font-semibold text-gray-900 text-base'>Ask me anything</p>
                  <p className='mt-1 text-gray-500 text-sm'>Get insights about your gene interactions and network</p>
                </div>
              </div>
            ) : (
              <div className='p-4'>{renderMessages()}</div>
            )}
          </div>

          <div className='shrink-0 border-t border-gray-100 px-4 pb-4 pt-3'>
            <div className='overflow-hidden rounded-lg border border-teal-500 bg-teal-50/40'>
              <PromptInputTextarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputValue.trim()) {
                      handleSubmit({ text: inputValue });
                    }
                  }
                }}
                placeholder='What would you like to know?'
                disabled={status === 'error'}
                className='min-h-12 resize-none border-0 bg-transparent px-4 pb-2 pt-3 text-sm shadow-none placeholder:text-teal-700/50 focus-visible:ring-0'
              />
              <div className='flex items-center justify-between border-t border-teal-100 px-3 py-2'>
                <PromptInputModelSelect
                  value={model}
                  onValueChange={value => setModel(value as (typeof LLM_MODELS)[number]['value'])}
                >
                  <PromptInputModelSelectTrigger
                    size='sm'
                    className='h-8 w-28 border border-teal-600 bg-transparent shadow-none hover:bg-teal-600/10 focus:ring-0'
                  >
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {LLM_MODELS.map(modelOption => (
                      <PromptInputModelSelectItem key={modelOption.value} value={modelOption.value}>
                        {modelOption.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>

                <PromptInputSubmit
                  className='size-9 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40'
                  disabled={!inputValue.trim() && status !== 'error'}
                  status={status}
                  onClick={() => {
                    if (status === 'submitted' || status === 'streaming') {
                      handleSubmitAction();
                    } else if (status === 'error') {
                      handleSubmitAction();
                    } else if (inputValue.trim()) {
                      handleSubmit({ text: inputValue });
                    }
                  }}
                />
              </div>
            </div>

            <p className='mt-2 text-center text-gray-400 text-xs leading-relaxed'>
              This AI may generate incorrect information. By using this service, you agree to our{' '}
              <Link href='/docs/terms-of-use' className='underline underline-offset-2 hover:text-gray-600'>
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link href='/docs/privacy-policy' className='underline underline-offset-2 hover:text-gray-600'>
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </ChatBase>
  );
}

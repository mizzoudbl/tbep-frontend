'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { RefreshCcwIcon } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { toast } from 'sonner';
import { LLM_MODELS } from '@/lib/data';
import { generateSessionId, getUserId } from '@/lib/langfuse-tracking';
import { cn, envURL } from '@/lib/utils';
import { Action, Actions, CopyAction } from '../ai-elements/actions';
import { Conversation, ConversationContent, ConversationScrollButton } from '../ai-elements/conversation';
import { Message, MessageAvatar, MessageContent } from '../ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '../ai-elements/prompt-input';
import { Response } from '../ai-elements/response';

export interface ChatBaseProps {
  onChatOpen?: (isOpen: boolean) => void;
  children?: (props: ChatBaseRenderProps) => React.ReactNode;
}

export interface ChatBaseRenderProps {
  // State
  inputValue: string;
  model: string;

  // Chat data
  messages: ReturnType<typeof useChat>['messages'];
  status: ReturnType<typeof useChat>['status'];

  // Handlers
  handleSubmit: (message: PromptInputMessage) => Promise<void>;
  handleDeleteMessages: () => void;
  handleSubmitAction: () => void;
  setInputValue: (value: string) => void;
  setModel: (model: (typeof LLM_MODELS)[number]['value']) => void;
  regenerate: () => void;

  // Components
  renderMessages: (alert?: { component: React.ReactNode; show: boolean }) => React.ReactNode;
  renderPromptInput: (compact?: boolean) => React.ReactNode;
  renderModelSelect: (className?: string) => React.ReactNode;
}

export function ChatBase({ onChatOpen, children }: ChatBaseProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [model, setModel] = React.useState<(typeof LLM_MODELS)[number]['value']>(LLM_MODELS[0].value);

  // Generate unique IDs for Langfuse session tracking
  const sessionId = React.useMemo(() => generateSessionId(), []);

  const { messages, setMessages, sendMessage, status, regenerate, stop, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: `${envURL(process.env.NEXT_PUBLIC_LLM_BACKEND_URL)}/chat`,
    }),
    onError(error) {
      toast.error('Failed to fetch response from LLM', {
        cancel: { label: 'Close', onClick() {} },
        description: error.message || 'LLM server is not responding. Please try again later.',
      });
    },
  });

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text) return;

    setInputValue('');
    onChatOpen?.(true);
    sendMessage({ text: message.text }, { body: { model, sessionId, userId: getUserId() } });
  };

  const handleDeleteMessages = () => {
    setMessages([]);
    onChatOpen?.(false);
  };

  const handleSubmitAction = () => {
    if (status === 'submitted' || status === 'streaming') {
      stop();
    } else if (status === 'error') {
      setMessages(messages.slice(0, -1));
      clearError();
    }
  };

  const renderMessages = (alert?: { component: React.ReactNode; show: boolean }) => (
    <Conversation className='max-h-[75vh]'>
      <ConversationContent>
        {messages.map((message, messageIndex) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return (
                    <div key={`${message.id}-${i}`}>
                      <Message from={message.role}>
                        <MessageContent className='shadow-md'>
                          <Response>{part.text}</Response>
                        </MessageContent>
                        <MessageAvatar
                          className={cn('shadow', message.role === 'assistant' && 'p-1')}
                          src={message.role === 'user' ? '/image/user.png' : '/image/logo.svg'}
                          name={message.role === 'user' ? 'You' : 'AI'}
                        />
                      </Message>
                      {message.role === 'assistant' && (
                        <Actions className='-mt-2 pl-10'>
                          {messages.length - 1 === messageIndex && (
                            <Action onClick={() => regenerate()} label='Retry'>
                              <RefreshCcwIcon className='size-3' />
                            </Action>
                          )}
                          <CopyAction text={part.text} />
                        </Actions>
                      )}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </motion.div>
        ))}
        {alert?.show && alert?.component}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );

  const renderPromptInput = (compact = false) => (
    <PromptInput onSubmit={handleSubmit} className='mx-2'>
      <PromptInputBody>
        <PromptInputTextarea
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
          className={compact ? 'h-[6vh]' : 'resize-y'}
          disabled={status === 'error'}
        />
      </PromptInputBody>
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputModelSelect
            onValueChange={value => {
              setModel(value as typeof model);
            }}
            value={model}
          >
            <PromptInputModelSelectTrigger className={compact ? 'h-7' : ''}>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {LLM_MODELS.map(modelOption => (
                <PromptInputModelSelectItem
                  className={compact ? 'h-7' : ''}
                  key={modelOption.value}
                  value={modelOption.value}
                >
                  {modelOption.name}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
        </PromptInputTools>
        <PromptInputSubmit
          className={compact ? 'h-7' : ''}
          disabled={!inputValue && !status}
          status={status}
          onClick={handleSubmitAction}
        />
      </PromptInputToolbar>
    </PromptInput>
  );

  if (children) {
    return (
      <>
        {children({
          inputValue,
          model,
          messages,
          status,
          handleSubmit,
          handleDeleteMessages,
          handleSubmitAction,
          setInputValue,
          setModel,
          regenerate,
          renderMessages,
          renderPromptInput,
          renderModelSelect: (className?: string) => (
            <PromptInputModelSelect
              onValueChange={value => {
                setModel(value as typeof model);
              }}
              value={model}
            >
              <PromptInputModelSelectTrigger className={className}>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {LLM_MODELS.map(modelOption => (
                  <PromptInputModelSelectItem className={className} key={modelOption.value} value={modelOption.value}>
                    {modelOption.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          ),
        })}
      </>
    );
  }

  return null;
}

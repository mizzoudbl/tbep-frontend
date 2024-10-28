import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      components={{
        a: ({ children, href }) => (
          <a href={href as string} className='text-blue-500 underline'>
            {children}
          </a>
        ),
        li: ({ children }) => <li className='list-disc'>{children}</li>,
      }}
      remarkPlugins={[remarkGfm]}
      className='prose prose-sm max-w-none'
    >
      {children}
    </ReactMarkdown>
  );
};

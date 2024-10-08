import { Markdown } from '@/components/Markdown';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const useTypingEffect = (text: string, timeout: number, setIsTyping: (arg0: boolean) => void) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const splitText = text.split(' ');

  useEffect(() => {
    if (currentIndex < splitText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => `${prev} ${splitText[currentIndex]}`);
        setCurrentIndex(prev => prev + 1);
      }, timeout);

      return () => clearTimeout(timer);
    }
    setIsTyping(false);
  }, [splitText, currentIndex, timeout, setIsTyping]);

  return displayedText;
};

export const TypingAnimation = ({
  text,
  timeout = 1,
  setIsTyping,
}: { text: string; timeout?: number; setIsTyping: (arg0: boolean) => void }) => {
  const displayedText = useTypingEffect(text, timeout, setIsTyping);
  return <Markdown>{displayedText}</Markdown>;
};

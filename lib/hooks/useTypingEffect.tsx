import { Markdown } from '@/components/Markdown';
import { useEffect, useRef, useState } from 'react';

export const useTypingEffect = (text: string, timeout: number, setIsTyping: (arg0: boolean) => void) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);
  const splitText = text.split(' ');

  useEffect(() => {
    if (index.current < splitText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => `${prev} ${splitText[index.current]}`);
        index.current++;
      }, timeout);
      return () => clearTimeout(timer);
    }
    setIsTyping(false);
  }, [splitText, timeout, setIsTyping]);

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

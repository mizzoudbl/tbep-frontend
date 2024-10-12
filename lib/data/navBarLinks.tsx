import { Download, HelpCircle, Info, Menu, MessageCircle } from 'lucide-react';

export const links = [
  { href: '/help', text: 'Help', icon: <HelpCircle className='mr-2 h-4 w-4' /> },
  { href: '/about', text: 'About', icon: <Info className='mr-2 h-4 w-4' /> },
  { href: '/faq', text: 'FAQ', icon: <MessageCircle className='mr-2 h-4 w-4' /> },
  { href: '/contact', text: 'Contact', icon: <MessageCircle className='mr-2 h-4 w-4' /> },
  { href: '/download', text: 'Download', icon: <Download className='mr-2 h-4 w-4' /> },
];

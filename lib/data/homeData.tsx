import { FileTextIcon, HelpCircleIcon, InfoIcon, MessageSquareMore, TvMinimalPlayIcon, Users2Icon } from 'lucide-react';

export const links = [
  { href: '/docs', text: 'Docs', icon: <HelpCircleIcon className='size-4' /> },
  { href: '/about', text: 'About', icon: <InfoIcon className='size-4' /> },
  { href: '/team', text: 'Team', icon: <Users2Icon className='size-4' /> },
  { href: '/feedback', text: 'Feedback', icon: <MessageSquareMore className='size-4' /> },
];

export const databaseStats = [
  { count: '21,800+', label: 'Diseases' },
  { count: '82,500+', label: 'Genes + its Alias Names' },
  { count: '*6,40,400+', label: 'String PPI Interactions' },
  // { count: '*56,95,700+', label: 'FunPPI Interactions' },
  { count: '*4,79,800+', label: 'IntAct Interactions' },
  { count: '*2,22,000+', label: 'BioGrid Interactions' },
];

export const getStartedLinks = [
  {
    href: '/docs',
    icon: <HelpCircleIcon className='size-8' />,
    title: 'Documentation',
    description: 'Browse detailed guides and documentation',
  },
  {
    href: '/docs/CHANGELOG',
    icon: <FileTextIcon className='size-8' />,
    title: 'Latest Updates',
    description: 'Stay current with our newest features and changes',
  },
  {
    href: '/docs/use-cases-and-short-help-videos',
    icon: <TvMinimalPlayIcon className='size-8' />,
    title: 'Tutorial Videos',
    description: 'Watch our video tutorials to get started',
  },
];

export const footerLinks = [
  { href: '/docs', text: 'Documentation' },
  { href: '/about', text: 'About' },
  { href: '/feedback', text: 'Feedback' },
  { href: '/docs/CHANGELOG', text: 'Latest Updates' },
  { href: '/docs/terms-of-use', text: 'Terms of Use' },
  { href: '/docs/privacy-policy', text: 'Privacy Policy' },
];

export const collaborators = [
  {
    href: 'https://iiita.ac.in',
    logo: '/image/iiita-logo.png',
    alt: 'IIITA Logo',
    name: 'Indian Institute of Information Technology, Allahabad',
  },
  {
    href: 'https://missouri.edu/',
    logo: '/image/mu-logo.png',
    alt: 'University of Missouri Logo',
    name: 'University of Missouri',
  },
];

import { Head, Image } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getBranchName } from './lib/getBranchName';

const navbar = (
  <Navbar
    logo={
      <>
        <Image src='/image/logo.svg' alt='TBEP Logo' width={40} height={40} />
        <span className='ml-2 font-bold'>TBEP Help Manual</span>
      </>
    }
    logoLink='/'
    projectLink='https://github.com/mizzoudbl/tbep'
  />
);

const footer = (
  <Footer className='flex-col border-t  items-center md:items-start'>
    <p>
      <a href='/' className='hover:underline'>
        Target & Biomarker Exploration Portal
      </a>{' '}
      &copy; {new Date().getFullYear()} is licensed under{' '}
      <a
        href='https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1'
        target='_blank'
        rel='license noopener noreferrer'
        style={{ display: 'flex' }}
      >
        CC BY-NC 4.0
        <Image
          width={22}
          className='align-text-bottom ml-1'
          src='https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1'
          alt=''
        />
        <Image
          width={22}
          className='align-text-bottom ml-1'
          src='https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1'
          alt=''
        />
        <Image
          width={22}
          className='align-text-bottom ml-1'
          src='https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1'
          alt=''
        />
      </a>
    </p>
  </Footer>
);

export const DocsThemeHead = () => (
  <Head
    color={{
      hue: 180,
      saturation: 50,
      lightness: {
        dark: 60,
        light: 35,
      },
    }}
  />
);

export const DocsThemeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Layout
      nextThemes={{
        defaultTheme: 'light',
      }}
      darkMode
      navbar={navbar}
      footer={footer}
      editLink='Edit this page on GitHub'
      docsRepositoryBase={`https://github.com/mizzoudbl/tbep-frontend/blob/${getBranchName()}`}
      pageMap={await getPageMap()}
    >
      {children}
    </Layout>
  );
};

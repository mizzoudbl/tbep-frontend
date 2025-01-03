import { Image, ImageZoom } from 'nextra/components'

export default {
  components: {
    img: ({ alt, ...props}) => (
      <>
        <ImageZoom alt={alt} style={{ borderRadius: '0.5rem', margin: '0 auto' }} {...props} />
        <i style={{ textAlign: 'center', display: 'block' }} >{alt}</i>
      </>
    )
  },
  head: (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Docs | Target & Biomarker Exploration Portal</title>
      <meta name="description" content='Help Manual for Drug Target Discovery Platform for Homosapiens' />
      <meta name="keywords" content='TBEP, Drug Target, Biomarker, Homosapiens, Drug Discovery, Target Discovery, Biomarker Discovery' />
      <meta name="author" content='Bhupesh Dewangan' />
    </>
  ),
  logo: (
    <>
      <Image src="/image/logo.svg" alt="TBEP Logo" width={40} height={40} />
      <span className="ml-2 font-bold">Help Manual</span>
    </>
  ),
  logoLink: "/docs",
  docsRepositoryBase:
    "https://github.com/bhupesh98/tbep-frontend/tree/main/pages/docs",
  project: {
    link: "https://github.com/bhupesh98/tbep",
  },
  color: {
    hue: 180,
    saturation: 50,
    lightness: {
      dark: 60,
      light: 35,
    },
  },
  readMore: "Read More →",
  editLink: {
    content: 'Edit this page on GitHub →',
  },
  footer: {
    content: (
      <p>
        MIT &copy; {new Date().getFullYear()} Target & Biomarker Exploration
        Portal
      </p>
    ),
  },
};

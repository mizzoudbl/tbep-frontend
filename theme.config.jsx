import { Image, ImageZoom } from "nextra/components";

export default {
  components: {
    img: ({ alt, ...props }) => (
      <>
        <ImageZoom
          alt={alt}
          style={{ borderRadius: "0.5rem", margin: "0 auto" }}
          {...props}
        />
        <i style={{ textAlign: "center", display: "block" }}>{alt}</i>
      </>
    ),
  },
  head: (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Documentation | Target & Biomarker Exploration Portal</title>
      <meta
        name="description"
        content="Help Manual for Drug Target Discovery Platform for Homosapiens"
      />
      <meta
        name="keywords"
        content="Documentation,TBEP, Drug Target, Biomarker, Homosapiens, Drug Discovery, Target Discovery, Biomarker Discovery"
      />
      <meta name="creator" content="Bhupesh Dewangan" />
      <meta
        property="og:title"
        content="Documentation | Target &amp; Biomarker Exploration Portal"
      />
      <meta
        property="og:description"
        content="Help Manual for Drug Target Discovery Platform for Homo-sapiens"
      />
      <meta property="og:url" content="https://pdnet.missouri.edu" />
      <meta
        property="og:site_name"
        content="Target &amp; Biomarker Exploration Portal"
      />
      <meta property="og:locale" content="en_US" />
      <meta
        property="og:image"
        content="https://pdnet.missouri.edu/image/open-graph.png"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Target &amp; Biomarker Exploration Portal"
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Documentation | Target &amp; Biomarker Exploration Portal"
      />
      <meta
        name="twitter:description"
        content="Help Manual for Drug Target Discovery Platform for Homo-sapiens"
      />
      <meta
        name="twitter:image"
        content="https://pdnet.missouri.edu/image/open-graph.png"
      />
      <meta name="twitter:image:width" content="1200" />
      <meta name="twitter:image:height" content="630" />
      <meta
        name="twitter:image:alt"
        content="Target &amp; Biomarker Exploration Portal"
      />
    </>
  ),
  logo: (
    <>
      <Image src="/image/logo.svg" alt="TBEP Logo" width={40} height={40} />
      <span className="ml-2 font-bold">TBEP Help Manual</span>
    </>
  ),
  logoLink: "/docs",
  darkMode: false,
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  color: {
    hue: 180,
    saturation: 50,
    lightness: {
      dark: 60,
      light: 35,
    },
  },
  footer: {
    content: (
      <p>
        <a href="/" className="hover:underline">
          Target & Biomarker Exploration Portal
        </a>{" "}
        &copy; {new Date().getFullYear()} is licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1"
          target="_blank"
          rel="license noopener noreferrer"
          style={{ display: "flex" }}
        >
          CC BY-NC 4.0
          <img
            style={{
              height: "22px!important",
              marginLeft: "3px",
              verticalAlign: "text-bottom",
            }}
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
            alt=""
          />
          <img
            style={{
              height: "22px!important",
              marginLeft: "3px",
              verticalAlign: "text-bottom",
            }}
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
            alt=""
          />
          <img
            style={{
              height: "22px!important",
              marginLeft: "3px",
              verticalAlign: "text-bottom",
            }}
            src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
            alt=""
          />
        </a>
      </p>
    ),
  },
};

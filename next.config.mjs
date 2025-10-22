import nextra from "nextra";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
  turbopack: {},
  transpilePackages: ["shiki"]
};

const withNextra = nextra({
  contentDirBasePath: "/docs",
  defaultShowCopyCode: true,
  readingTime: true,
});

export default withNextra(nextConfig);

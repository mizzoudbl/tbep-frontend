/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pdnet.missouri.edu',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    outDir: 'out',
}
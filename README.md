This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm
# or
bun
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Disclaimer

Dependencies not to upgrade:

```
@radix-ui/react-scroll-area past v1.2.0
next past v15.4.5
nextra past v3.3.1
nextra-theme-docs past v3.3.1
inquirer past v9.3.7
recharts past v2.15.1
@apollo/client past v3.14.0
```

- Don't use the latest version of @radix-ui/react-scroll-area as it messes up with the scroll position in the left side bar. v1.2.0 is the latest version that works fine with the current codebase.
**Hours wasted:** 3hr

- Don't upgrade the next dependency past 15.4.5 as it fails to type lint successfully pages/_meta.ts as it doesn't respect nextra v3 metadata. Migrating to Nextra v4 will take a lot of time and changes, so it is on hold.

- Don't upgrade the inquirer dependency past v9.3.7 as it doesn't mask the password input correctly without code change.

- Don't upgrade the recharts dependency past v2.15.1 as it may introduce potential API changes. All of it has to be validated and migrated before upgrading.

- Don't upgrade the @apollo/client dependency past v3.14.0 as it doesn't allow changing query on a hook which is needed in [LeftSideBar.tsx](components/left-panel/LeftSideBar.tsx) to change the query based on which execution of that query.

- While building this project in Dockerized form or publishing the website in production, I encourage you to upload videos (as maintaining it in `git lfs` is going to cost it), please keep all the related videos in [this folder](/public/video/). All the videos are currently uploaded in this [gdrive folder](https://drive.google.com/drive/folders/1LvPTY8Z559shYoWTaSOHFuWOFKGG8QHv), you can download them from there and upload them in the above-mentioned folder.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Function region

`vercel.json` pins Serverless Functions to `sin1` (Singapore). This is not a
preference — **it has to match wherever the Neon database lives**, which is
currently Singapore (`ap-southeast-1`).

Functions ran in the default `iad1` (Washington DC) while the database was in
Singapore, so every query crossed the Pacific. The homepage never noticed —
it is static and served from the CDN — but each round trip on the enquiry form
cost roughly a quarter of a second.

If the database is ever moved, move this with it. Co-located is what matters;
a mismatch is worse than either region on its own, and moving only one of the
two is the way to make submissions slower while looking like an optimisation.

Note that regions other than the default require a Vercel Pro plan. Route-level
`preferredRegion` is not an alternative here: on Vercel it only accepts a
specific region when the route runs on the edge runtime, and these routes need
Node for Prisma and the Neon WebSocket driver.

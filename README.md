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


## SalesIQ live chat

The widget key is selected once per page load in this order:

1. `ZOHO_SALESIQ_WIDGET_CODE` in the deployment environment (or `.env.local`).
2. Prag-Admin's **Zoho SalesIQ Widget Code** setting for the corresponding site.
3. The official PRAG widget key supplied for this integration.

Example environment override:

```env
ZOHO_SALESIQ_WIDGET_CODE=siq7f354a9f8f29eefa04acd8f76de79b15389e83109974604f61f319fb69114d7a
```

Leave the environment variable unset to use the admin setting. Environment
changes require a rebuild/redeployment (restart the local development server).
Admin changes follow the existing content/config cache and apply on a new page
load; an active chat session is not replaced during client-side navigation.
An invalid environment override fails validation; an empty or invalid admin
value uses the official fallback. Do not paste a second SalesIQ installation
into custom script fields. WhatsApp stays on the left and SalesIQ on the right.

# Deployment handoff: Vercel client + Render API

The local application is verified. Hosting import forms are prepared, but no production deployment has been created yet. Commit and push the current changes to both main branches before importing/deploying, because these services build GitHub source rather than uncommitted local files.

## Prepared imports

- Vercel: AtikHasanDev/Assignment-9, Next.js, repository root, project name assignment-9, Hobby scope.
- Render: public AtikHasanDev/Assignemnt-9-server repository, service name fixmate-api-atikhasan, Node, main branch, Singapore, free compute, build `npm ci`, start `npm start`, health check `/api/ready`.
- Render free instances can sleep when inactive; the first request after a pause may take longer. The free plan is selected in the draft, replacing Render's initially selected paid plan.
- The owner approved copying MONGODB_URI, MONGODB_DB, BETTER_AUTH_SECRET, JWT_SECRET, IMGBB_API_KEY and STRIPE_SECRET_KEY to the Render draft. Those six values are entered and masked alongside NODE_ENV=production. The local webhook secret was excluded. They will not become a deployed service environment until the service is created. Client/auth/payment origins still need the actual deployed URLs.

`F` below means the actual frontend HTTPS origin assigned by Vercel, and `B` means the actual API HTTPS origin assigned by Render. Neither is confirmed until its project/service is created. Do not use placeholder origins in the final submission.

## API environment on Render

| Variable | Value |
| --- | --- |
| NODE_ENV | production |
| CLIENT_ORIGINS | F (exact origin, no trailing slash) |
| BETTER_AUTH_URL | F (authentication is accessed through the frontend proxy) |
| PAYMENT_CLIENT_ORIGIN | F |
| MONGODB_URI | Existing Atlas connection URI, supplied privately |
| MONGODB_DB | Existing database name |
| BETTER_AUTH_SECRET | Auth secret, supplied privately |
| JWT_SECRET | JWT secret, supplied privately |
| IMGBB_API_KEY | Existing ImgBB key, supplied privately |
| STRIPE_SECRET_KEY | Existing sk_test_ key, supplied privately |
| STRIPE_WEBHOOK_SECRET | Signing secret for the deployed Stripe test endpoint, configured after its URL is known |

Keep keys and connection strings out of Git. The owner approved the six-value Render transfer above; do not request that approval again for the same service and values. Render provides PORT; the Express startup already reads it. If Atlas rejects the deployed connection, use the service's documented outbound addresses to configure the database network allowlist; don't blindly disable network restrictions. The optional local DNS override is not required unless production DNS actually fails.

## Client environment on Vercel

| Variable | Value |
| --- | --- |
| NEXT_PUBLIC_API_URL | F |
| NEXT_PUBLIC_SITE_URL | F |
| API_PROXY_URL | B |
| API_URL | B |

Set Production environment values before the final build. NEXT_PUBLIC_API_URL routes browser calls through F/api/*; next.config.ts rewrites them to B/api/*. Server-rendered service requests use API_URL directly. This keeps the session cookie on the frontend domain and avoids cross-site browser cookie restrictions. BETTER_AUTH_URL must therefore be F, not B, in this proxy configuration. Local defaults still work without API_PROXY_URL.

Deploy the API and client after both actual origins are known and the settings are consistent, then redeploy if an origin or build-time client variable changed. Keep Node.js 22 or newer on both hosts. Do not use a static export: the app uses dynamic service routes and server rendering.

## Stripe test endpoint

Register B/api/payments/webhook in the sandbox for checkout.session.completed and checkout.session.async_payment_succeeded. Use snapshot events and save that endpoint's whsec_ signing secret in Render, then redeploy/restart the API. The local stripe listen signing secret is not the deployed endpoint secret. Keep all Stripe keys in test mode for the assignment. Checkout explicitly disables adaptive pricing to keep the UI and receipts in USD.

## Final verification and submission

1. F loads services and images; F/api/ready returns 200 and MongoDB ready. B/api/ready also returns 200.
2. Sign in and reload each role dashboard; check cookies persist through the frontend proxy. Confirm a customer cannot open admin data APIs.
3. Verify image upload, service creation/edit approval reset, booking creation/cancellation, technician transitions, and final amount.
4. Complete a sandbox payment, observe a 200 Stripe webhook delivery, payment confirmation, customer history, admin transaction, and one paid timeline entry after re-verification.
5. Check mobile navigation with Tab/Shift+Tab/Escape, 390px and desktop layouts, custom 404 and error recovery.
6. Add the actual frontend/API URLs, repository URLs, and demo credentials to the assignment submission. The shared demo password is in the ignored server .env.demo file; share it only through the intended submission channel. Verify at least 20 meaningful client and 12 meaningful server commits after the final commits are made.

Current local evidence: all 31 server tests; production build and TypeScript; real multi-role API checks; browser customer/admin sign-in; customer mobile/desktop history; successful $40 Stripe sandbox payment; 200 real webhook delivery; exactly one payment and paid timeline event after repeated verification. No real money moved. The local seeded completed booking is now paid, so use a new completed booking for another payment test.

Official references: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Express on Render](https://render.com/docs/deploy-node-express-app), [Stripe webhooks](https://docs.stripe.com/webhooks).

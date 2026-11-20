# Live deployment: Vercel + Render

Verified on 20 November 2026.

- Client: https://fixmate-atikhasan.vercel.app
- API readiness: https://fixmate-api-atikhasan.onrender.com/api/ready
- Vercel project: https://vercel.com/acme-8a0c/fixmate-atikhasan
- Render service: https://dashboard.render.com/web/srv-dc02s86i0phs73bhd580
- Stripe sandbox endpoint: https://fixmate-api-atikhasan.onrender.com/api/payments/webhook

Initial runtime deployments used client commit 94fa543 and server commit 31cb784. The final client handoff also extends production service-fetch timeouts for free-instance startup. The hosting dashboards show the current deployed revisions. Commits and pushes remain owner-controlled.

## Production configuration

Vercel Production variables:

| Variable | Value |
| --- | --- |
| NEXT_PUBLIC_API_URL | https://fixmate-atikhasan.vercel.app |
| NEXT_PUBLIC_SITE_URL | https://fixmate-atikhasan.vercel.app |
| API_PROXY_URL | https://fixmate-api-atikhasan.onrender.com |
| API_URL | https://fixmate-api-atikhasan.onrender.com |

Browser API calls stay on the frontend origin; Next rewrites /api/* to Render. Server-rendered service requests use API_URL. This keeps the BetterAuth cookie on the frontend domain. Environment changes require a new Vercel production deployment.

Render: free compute, Singapore, repository AtikHasanDev/Assignemnt-9-server, main, root directory, npm ci, npm start, health check /api/ready. NODE_ENV is production. CLIENT_ORIGINS, BETTER_AUTH_URL and PAYMENT_CLIENT_ORIGIN all use the exact frontend origin above. MongoDB/BetterAuth/JWT/ImgBB/Stripe secrets are server-only environment settings.

The owner approved six named secret transfers and separately approved the newly generated deployed STRIPE_WEBHOOK_SECRET. The local Stripe listener secret was not copied or changed. A bulk .env import was rejected by automatic approval review; individual approved settings were entered instead. No private integration credentials are tracked by Git.

## Stripe test webhook

Endpoint we_1Udq1WArDCufaBkPSQRQDWxM is enabled in test mode for checkout.session.completed and checkout.session.async_payment_succeeded. Its own signing secret is stored in Render. Local development keeps its separate listener secret.

With explicit owner approval, the existing $40 demo refrigerator payment event was replayed to the deployed endpoint: HTTP200, received=true, one payment before and after. Stripe also accepted a provider-side resend of that same event. A subsequent database check confirmed one payment and one Paid timeline entry. No new charge was made. The Stripe dashboard delivery-log screen was not inspected because it required a fresh sign-in; the signed HTTP response and provider resend were verified independently.

## Verification and handoff

See LIVE_QA.md and FINAL_REQUIREMENTS_AUDIT.md. The public README includes the dedicated demo credentials with owner approval. The ignored root .env.submission provides a private copy of submission links and accounts.

Render free instances sleep when inactive and may take 50 seconds or more to wake. Production service fetches allow 65 seconds while existing loading/skeleton UI remains available; local development retains its shorter timeout. A free instance does not provide an always-warm latency guarantee.

For future updates, push the intended source revision and confirm the hosting dashboard deploys that revision; use Manual Deploy on Render if needed. Do not change production auth origins to a preview deployment alias. Verify /api/ready, role sign-ins/private reloads, images and checkout after configuration changes.

Official references: https://vercel.com/docs/frameworks/full-stack/nextjs, https://render.com/docs/deploy-node-express-app, https://docs.stripe.com/webhooks.

# FixMate

Smart device and home appliance repair booking with customer, technician, and administrator dashboards. Customers request a repair, follow its progress, and pay only after completion.

## Links and submission status

- Local preview: http://localhost:3000
- Live site: pending Vercel deployment; no production URL has been verified.
- Client repository: https://github.com/AtikHasanDev/Assignment-9
- Server repository: https://github.com/AtikHasanDev/Assignemnt-9-server
- Hosting plan: Vercel client and Render API. See [deployment handoff](docs/DEPLOYMENT.md).
- See the [final requirements audit](docs/FINAL_REQUIREMENTS_AUDIT.md) for verified behavior and remaining submission gaps.

## Features

- BetterAuth email/password sessions, customer/technician registration, custom JWT authorization, live role checks, and ownership enforcement.
- Approved, available services with MongoDB search, category/mode filters, sorting, URL persistence, and pagination.
- Technician service CRUD, ImgBB image uploads, availability controls, and administrator moderation.
- Customer requests with an optional ImgBB damage photo, duplicate protection, cancellation, and visual job timelines.
- Technician status pipeline with final pricing; role-specific statistics and charts.
- Stripe test Checkout after completion, signed webhooks, transactional fulfillment, unique payments, customer history, and admin revenue.
- Editable profiles, Sonner notifications, confirmation dialogs, responsive navigation, loading/error/404 views, and card hover feedback.

## Demo accounts

| Role | Email |
| --- | --- |
| Administrator | admin.demo@fixmate.example |
| Customer | customer.demo@fixmate.example |
| Technician | nadia.demo@fixmate.example |
| Technician | rafi.demo@fixmate.example |

The generated shared demo password is in the server's ignored `.env.demo` file as `SEED_PASSWORD`. Supply it through the intended examiner submission channel. This README does not yet satisfy the assignment's literal requirement to include an admin password. Accounts have been verified locally; live sign-in verification is pending deployment. Google sign-in is optional in the assignment and is not configured.

## Run locally

Requires Node.js 22 or newer. The server is an independent Git repository in `Assignemnt-9-server` (directory spelling is intentional), ignored by the client repository.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

In the server directory, install dependencies, copy `.env.example` to `.env`, enter your private configuration, and run `npm run dev`. Local client and API ports are 3000 and 5000. Configure Atlas, BetterAuth, JWT, ImgBB, and Stripe test secrets only in ignored environment files. Never put private credentials in `NEXT_PUBLIC_*` variables. Follow the server README for seed and Stripe listener commands.

## Validation

```powershell
npm run typecheck
npm run build
```

Server: `npm test` (32 tests), `npm run check`, and `npm run demo:check`. The demo workflow command uses configured local/Atlas/Stripe test services, creates disposable records and an unpaid test Checkout session, then cleans them up. It does not submit a payment. A separate browser sandbox payment and signed webhook were verified during development.

## Packages

Client: Next.js App Router, React, React DOM, TypeScript, BetterAuth, Lucide React, Sonner, DaisyUI, Tailwind CSS/PostCSS, Fontsource DM Sans/Manrope, Radix Slot, class-variance-authority, and Node/React type definitions. The shared controls use DaisyUI with a custom theme and Radix Slot for link composition; see [UI component notes](docs/UI_COMPONENTS.md).

Server: Node.js, Express, MongoDB driver, BetterAuth and its MongoDB adapter, jose, Stripe, dotenv, cors, and helmet.

## Public contact

Email: atikhasan.inbox@gmail.com. Phone: +8801303783098. Footer social icons open platform homepages as requested by the owner. Dhaka is displayed as the service area, not a verified personal street address.


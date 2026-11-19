# FixMate

A device and home appliance repair platform where customers find services, track repair jobs, and pay after completion.

## Current progress

Part 1 establishes a Next.js App Router application, TypeScript, an original responsive visual foundation, environment templates, and repository hygiene. Business features are planned in docs/IMPLEMENTATION_PLAN.md and are not implemented yet.

## Run locally

Requires Node.js 22 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. Run the independent server from Assignemnt-9-server in a separate terminal. That directory is intentionally ignored by this client repository.

## Validation

```powershell
npm run typecheck
npm run build
```

## Packages

Next.js, React, React DOM, Lucide React, TypeScript, and Node/React type definitions. Additional packages will be documented as their features are implemented.

## Configuration

Copy .env.example to .env.local. NEXT_PUBLIC_API_URL points to the Express server; NEXT_PUBLIC_SITE_URL identifies this client. NEXT_PUBLIC variables are browser-visible: never put private secrets in them. Actual environment files are ignored by Git.

## Submission status

- Live URL: not deployed yet.
- Admin credentials: not created yet.
- Technician/customer test credentials: not created yet.
- Repository remotes: not configured yet.

Production links and dedicated test-account details will be added after deployment and verification. Stripe must remain in test mode.


# FixMate

A device and home appliance repair platform where customers find services, track repair jobs, and pay after completion.

## Current progress

Part 16 adds the read-only administrator booking monitor at /dashboard/admin/bookings, with combined job/payment status filters, server pagination, customer and technician details, pricing, request details, and the job timeline. Terminal timeline text now identifies the customer rather than assuming the viewer cancelled the request. Production build/TypeScript and all 26 server tests pass. Authenticated administrator browser interactions remain to be verified.

Part 15 adds administrator user management and service moderation at /dashboard/admin/users and /dashboard/admin/services. User roles and service approval decisions have confirmation dialogs. Lists use server pagination; moderation defaults to pending services with all/approved/rejected filters. Account self-role changes are disabled and remain rejected by the API. Both sidebar entries are enabled. Production build/TypeScript and all 25 server tests pass. These pages require an administrator account; authenticated browser interaction still needs verification.

Part 14 adds /dashboard/technician/my-services with owned-service cards, approval/availability labels, editing, pause/resume, deletion confirmation, and refresh/error/empty states. Creation and editing share one validated form; edits reset approval through the existing API. My services is enabled in the sidebar. The authenticated browser workflow still needs manual verification.

Local preview: http://localhost:3000 (client), http://localhost:5000/api/ready (API readiness). Run npm run dev from the client directory and npm start from Assignemnt-9-server in separate terminals if the preview is stopped. Use localhost for both apps so authentication cookies and allowed origins match. Sign in as a technician to use Add a service and My services.

Part 13 adds /dashboard/technician/add-service with image upload, required service fields, USD price validation, submission progress/error feedback, and pending-approval confirmation. The technician sidebar now enables Add a service. A real ImgBB test upload succeeded after local key configuration. Production build/TypeScript and 25 server tests pass; the full authenticated browser flow remains to be verified. My services and editing controls follow in the next part.

Part 12 adds editable name, phone, service area, bio, and profile photo at /dashboard/profile. Email and role are read-only. Saving refetches the shared session to refresh account navigation. Photo uploads validate PNG/JPEG/WebP files up to 5 MB and 25 megapixels and show progress/error feedback; removal takes effect on Save profile. The server reads IMGBB_API_KEY from its ignored .env. Live provider upload is verified; authenticated browser verification remains pending.

Parts 1–3 establish the Next.js public layout and shared UI, plus a BetterAuth client, reactive session provider, and JSON API helper. The service directory remains a pre-launch placeholder. Registration/sign-in pages, live listings, and dashboards follow in later milestones. The remaining plan is in docs/IMPLEMENTATION_PLAN.md.

## Run locally

Part 11 enables the technician request queue at /dashboard/technician/requests. It shows customer contact/address, preferred date, problem description, service, status, and price, with server-backed status filtering and refresh. Requested jobs expose Accept/Reject; rejection requires confirmation. Accepted jobs expose Start work; in-progress jobs expose a completion dialog with a validated final USD amount. Terminal jobs have no mutation controls. Status changes show toasts, refresh the queue, and handle stale-state conflicts. Profile editing is the next client milestone; its protected server API is now available.

Part 10 adds a separate full-width dashboard shell with role-specific navigation, a sticky user top bar, mobile sidebar controls, active-page styling, and Home/Profile links. Customer, technician, and admin overview pages fetch their role-protected summaries and show reusable statistics cards and accessible status bar charts. Empty accounts show real zero values; API failures have retry controls. Profile details are currently read-only. Navigation entries for screens still under construction are disabled until their implementation milestones.

Part 9 adds a confirmation dialog for cancelling requested jobs, cancellation feedback, and expandable booking timelines. Timeline dates use Asia/Dhaka; rejected and cancelled jobs display terminal notices. Payment remains a future milestone, so the Paid timeline stage is displayed only when the server reports paymentStatus=paid. Technician request-management screens will use the new server status APIs in a later part.

Part 8 adds /services/[id] with service information, technician summary, starting price, request controls, and route-specific unavailable/error pages. Logged-out users are sent to sign-in with a return-to link; only customers can submit the form. The form validates phone, address, preferred date, and problem description. Successful requests link to a scoped read-only My Bookings page. Cancellation, status actions, payment controls, and timeline rendering follow in later parts.

Part 7 replaces the directory placeholder with server-rendered service browsing. A GET form keeps search, category, serviceMode, sort, and page in the URL; pagination preserves filters and resets to page one when the search form is submitted. Cards, result counts, no-match states, and API failure states use actual server responses. Category links from the home page open preselected filters. Service details follow in the next milestone.

Part 6 adds a request-time featured-service section that fetches the six newest approved, available services. It includes reusable service cards, loading skeletons, honest empty/error states, category links, and the four-step repair flow. No sample records are substituted when the API is unavailable. API_URL can override the API origin for server-side fetches; otherwise NEXT_PUBLIC_API_URL is used. Full service browsing and details are scheduled next.

Part 5 adds sign-in, sign-out, safe same-origin return-to navigation, shared toast notifications, a session-aware account dropdown, and a protected dashboard entry point. Login and registration send users to their role's dashboard. Dashboard statistics, sidebar navigation, profile editing, and business workflows remain scheduled. The sign-in form is at /sign-in; private redirects use the returnTo query parameter. Access tokens stay in memory and are exchanged from the HttpOnly BetterAuth cookie.

Part 4 adds /sign-up with customer/technician selection, accessible validation, password visibility, submission progress, and session-aware success feedback. The client API helper now exchanges the HttpOnly BetterAuth session for a short-lived JWT before private API calls. Sign-in pages, dashboard redirection, and app-wide toast notifications will be completed in subsequent milestones; the current success screen links to Services.

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


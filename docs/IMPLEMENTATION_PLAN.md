# FixMate implementation and commit plan

Work is delivered in small parts. The owner commits each completed part and asks to continue. Do not claim planned functionality is implemented. Each milestone must have a real code change and a descriptive commit; do not use empty commits to meet the count.

## Client milestones (22 planned meaningful commits)

1. Scaffold Next.js, establish the visual foundation, and ignore the nested server
2. Build shared responsive navigation, footer, and accessible UI primitives
3. Connect BetterAuth session handling and API request utilities
4. Build validated customer and technician registration
5. Build sign-in, sign-out, and safe return-to navigation
6. Build the dynamic featured-service home page and category links
7. Build service browsing with URL-backed server filters and sorting
8. Build service details and technician information
9. Build the customer repair-request form and duplicate-request feedback
10. Build protected role-aware dashboard layout and sidebar
11. Build customer overview statistics and job chart
12. Build customer bookings, cancellation confirmation, and timeline
13. Build Stripe checkout redirects and success/cancel pages
14. Build customer payment history
15. Build technician overview and validated image-upload service creation
16. Build technician service editing, deletion, and availability management
17. Build technician request management and final-amount completion
18. Build administrator overview and user role management
19. Build administrator moderation, booking monitoring, and transactions
20. Build shared profile editing and immediate session refresh
21. Add loading, empty, not-found, and error states across routes
22. Verify responsive flows and finalize deployment and submission documentation

## Server milestones (14 planned meaningful commits)

1. Scaffold Express, environment handling, CORS, and health endpoint
2. Connect MongoDB and create collection indexes
3. Configure BetterAuth with protected role registration and profile fields
4. Issue JWTs from sessions and enforce authorization middlewares
5. Build public service search, filtering, sorting, and pagination
6. Build technician service CRUD and ImgBB upload handling
7. Build admin service moderation and role management
8. Create repair requests with atomic active-booking protection
9. Enforce booking ownership, cancellation, and status transitions
10. Build dashboard summaries and scoped payment/history queries
11. Create Stripe checkout with server-controlled amounts and payment gates
12. Verify Stripe payments and process idempotent signed webhooks
13. Seed connected accounts, services, and bookings safely
14. Test security and payment rules and finalize production deployment

## Assignment constraints

- Next.js App Router client; Express server; MongoDB; BetterAuth; custom JWT role middlewares; Stripe test mode; ImgBB file uploads.
- Exactly four application collections: BetterAuth user collection plus services, bookings, payments. BetterAuth session, account, and verification collections are additional auth infrastructure.
- Public listings must be approved and available. Service edits reset approval to pending.
- Only customers request services. No duplicate active requests for the same service/customer.
- Only owning technicians move requested to accepted/rejected, accepted to in-progress, and in-progress to completed with a positive final amount.
- Only owning customers cancel requested jobs. Only completed, unpaid jobs can be paid.
- Unique Stripe session and booking payment indexes; webhook and success-page verification share idempotent fulfillment.
- Public pages, separate protected role dashboards, profile updates, toasts, confirmations, loading/error/empty states, and responsive layouts.
- Seed at least two technicians and twelve approved services, plus connected bookings in several statuses.
- Optional additions selected: job status history/timeline and server-side pagination.
- Submission requires working production URLs, test accounts, and at least 20 client plus 12 server meaningful commits.

## Current state

Part 1 committed by the owner:
- Client: 2d82ae3 — Scaffold FixMate client foundation.
- Server: 25203d8 — Scaffold FixMate Express API server.

Part 2 committed by owner (client f2b6453, server 0b5e16b):
- Client: shared public route layout, sticky responsive navigation, footer, About page, directory placeholder, and reusable UI components.
- Server: pooled MongoDB connection, application collection indexes, fail-fast startup, database readiness endpoint, and readiness tests.

MongoDB authentication and indexes were verified against Atlas. Part 3 adds BetterAuth server endpoints, registration role/password policies, client session handling, and API utilities. Live Express/Atlas smoke tests verified role coercion, technician registration, cookie sessions, role escalation rejection, and sign-out revocation; disposable test records were removed. Authentication pages, JWT-protected business APIs, booking/payment workflows, and deployment remain. Footer contact/social details still need verified project channels.

Part 3 committed by owner (client ae5c725, server a855ebb).

Part 4 adds the validated registration page and private API token exchange. Server role middlewares read current users from MongoDB; access tokens expire after 15 minutes. Registration currently shows a success screen linking to Services. Sign-in, dashboard redirects, and shared toast notifications remain scheduled. Local JWT tests cover signature, expiry, role changes, and deleted accounts.

Part 4 committed by owner (client b0ae7ed, server 843381f).

Part 5 adds sign-in/sign-out, safe return-to paths, account navigation, shared toasts, registration dashboard redirects, and a protected dashboard entry point. Full dashboard layouts/statistics and profile editing remain. Server public service APIs now query MongoDB for search, filters, sort, pagination, and approved/available details. Client service browsing is next.

Part 5 committed by owner (client 76cfc37, server f387d7f).

Part 6 adds the dynamic featured-service home section, reusable service cards, categories, and repair flow. Server technician CRUD validates fields, scopes mutations to the owner, and resets approval after edits. An authenticated ImgBB endpoint validates base64 image type/size. A real IMGBB_API_KEY and live upload verification are still required. Service details and client browsing remain scheduled next; no fabricated services are shown.

Part 6 committed by owner (client 399cc0c, server 2f92a52).

Part 7 adds URL-backed server-rendered service search, category/mode filters, price/newest sorting, and pagination. The search form starts a fresh first page; pagination preserves the current query. Admin-only service approval and user-role APIs are implemented with field allowlists and self-role protection. Admin UI and live service-detail pages remain scheduled. No new credentials or sample data were introduced in this part.

Commit accounting: six confirmed meaningful commits in each repository since initialization. Part 7 supplies the seventh commit in each repository. The owner performs all commits and requests continuation.


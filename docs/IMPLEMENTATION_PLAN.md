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

Part 7 committed by owner (client ddba662, server 0393d10).

Part 8 adds public service details and the validated role-restricted repair-request form. Customers get a success link to scoped read-only My Bookings. The server creates trusted snapshots, validates Bangladesh calendar dates, rejects own-service requests, and translates the active-booking unique constraint to a conflict response. Cancellation, technician transitions, payments, and the timeline UI remain scheduled. Request form work was brought forward from the next client milestone to make the booking endpoint reviewable together with its UI.

Part 8 committed by owner (client 38fbe94, server 1ed4c8c).

Part 9 adds customer cancellation with a native confirmation dialog and booking timeline UI. Server technician queues, valid forward status transitions, completion amount validation, owner checks, and compare-and-set updates are implemented. Tests cover all transition pairs and an in-memory acceptance/cancellation race. Full technician request controls, Stripe payment gates, and live Atlas concurrency verification remain scheduled. No payment has been processed in this part.

Part 9 committed by owner (client ee5f76a, server 577238c).

Part 10 adds the role-specific dashboard shell, mobile sidebar, reusable statistics cards, scoped overview pages and status charts. New APIs enforce matching JWT roles and derive counts from actual user/service/booking data. Profile has a dedicated read-only page. Navigation for unfinished dashboard screens is disabled and will be enabled with those screens. Full profile editing and business dashboard controls remain scheduled. This stage also implements the three overview UIs together to validate every role against one API contract.

Part 10 committed by owner (client 50c9322, server 1f61360).

Part 11 adds the technician request-management screen and enables its sidebar link. Accept/reject/start/complete actions use existing owner-scoped workflow APIs; rejection and completion have dedicated dialogs. The new profile API validates editable fields and rejects identity/role/email changes. BetterAuth's update-user path shares validation. Profile editing, immediate client session refresh after edits, and live image uploads remain scheduled next.

Part 11 committed by owner (client 0be14ba, server b879468).

Part 12 adds shared profile editing, client field validation, photo selection/removal, upload progress and error feedback, and a BetterAuth session refetch after saving. Uploads use the authenticated API and validate image format, size, and browser-decoded dimensions. The server upload provider now validates returned URLs and safely handles network, malformed-response, and provider failures. Production client build and all 25 server tests pass. IMGBB_API_KEY remains unconfigured; real uploads and authenticated browser session refresh still require live verification.

Part 12 committed by owner (client 6a93e45, server cd58246).

Part 13 adds /dashboard/technician/add-service and enables its sidebar link. Technicians can upload an image, enter validated service details and a starting USD price, and submit through the existing owner/role-protected API. Successful creation clears the form and confirms pending administrator approval. The reusable uploader now supports service-specific feedback and image descriptions. The ImgBB key is configured and a real tiny PNG upload succeeded. Production build/TypeScript and all 25 server tests pass. Full authenticated browser creation and profile session-refresh verification remain pending. Service listing/editing/deletion/availability UI is next; payments, admin UI, seed data, deployment, and final QA remain.

Part 13 committed by owner (client 4ed9184). Server remains cd58246.

Part 14 adds owned-service listing, edit/resubmit through a shared service form, availability controls, deletion confirmation, refresh and loading/error/empty states. The My services sidebar entry is enabled. Existing server APIs enforce technician ownership and reset approval after edits. Local client/API previews are running on localhost:3000 and localhost:5000; readiness reports MongoDB connected and the home/new dashboard routes return HTTP 200. TypeScript and all 25 server tests pass. Authenticated browser interactions still require manual verification.

Part 14 committed by owner (client 65719d1). Server remains cd58246.

Part 15 adds administrator user management and service moderation pages with enabled sidebar links, server-backed pagination, role-change confirmations, self-role protection, approval-status filters, service detail review, approve/reject confirmations, and loading/error/empty/refresh states. The existing protected admin APIs supply all data and mutations. Production build/TypeScript and all 25 server tests pass. Client/API previews remain available at localhost:3000 and localhost:5000; readiness and both new route responses return HTTP 200. Full authenticated administrator browser interactions remain to be verified.

Part 15 committed by owner (client 502e0f8). Server remains cd58246.

Part 16 adds read-only administrator booking monitoring with combined job/payment status filters, stable server pagination, customer/technician identities, dates, amounts, expandable contact/problem details, and job timelines. The protected GET /api/admin/bookings endpoint validates query fields and filters and projects only monitor fields. Timeline cancellation wording now works for all viewers. Production build/TypeScript and all 26 server tests pass, including new monitor authorization/filter/pagination tests. Authenticated administrator browser interactions remain to be verified.

Part 16 committed by owner (client 88bb0f6, server dae5566).

Part 17 adds customer Stripe checkout and success/cancel screens, server-controlled completed/unpaid payment gates and amounts, persistent checkout idempotency/session reuse, return verification, signed raw-body webhooks, and shared transactional fulfillment. Unique indexes and MongoDB transactions protect payment history and booking Paid status from concurrent/repeated callbacks. Build/TypeScript and all 30 server tests pass. A real Atlas transaction check with simulated Stripe verified one payment/one paid event under concurrent fulfillment and removed all disposable records. The user needs help configuring Stripe; setup instructions are in docs/STRIPE_LOCAL_SETUP.md. No real Stripe checkout or authenticated payment browser flow has been verified yet. USD charges below $0.50 are rejected because of Stripe's minimum.

Commit accounting: sixteen confirmed meaningful client implementation commits and thirteen server implementation commits since initialization. Part 17 supplies the seventeenth client implementation commit and fourteenth server implementation commit. The owner performs all commits and requests continuation. Remaining client milestones must still bring the client total to at least 20 meaningful commits. Next: customer payment history and administrator transactions; seed data, live Stripe checks, deployment, and final QA remain.

Stripe setup follow-up: the existing signed-in sandbox's test key was copied through the UI and saved by the owner in the ignored server .env. The official CLI is installed locally under ignored node_modules/.cache/stripe-cli. scripts/listen-stripe.js authenticates with that existing key through the environment, forwards completion events, and saves its signing secret without printing it. The listener is running and the API was restarted. Real Stripe checkout creation exposed removal of payment_method_types; the integration now uses Dashboard-managed dynamic payment methods. A corrected real $1 test checkout was verified unpaid and expired, with the disposable MongoDB booking removed. All 30 server tests pass. Full browser payment completion and real completion-event forwarding remain to be verified; no payment was submitted. See docs/STRIPE_LOCAL_SETUP.md for restart commands and checks.

Part 17 committed by owner (client 3676ff2, server 4f8c792), including the local Stripe setup follow-up.

Part 18 adds customer payment history and administrator transaction lists, confirmed-payment details, Dhaka timestamps, server pagination, refresh/loading/error/empty states, enabled sidebar links, and a payment-history link after successful verification. Shared API list logic enforces customer identity from authentication, admin-only global reads, strict pagination, explicit projections, and no-store responses. The client pagination hook is shared with existing admin screens. Production build/TypeScript and all 31 server tests pass. Authenticated browser payment/history verification, seed data, and deployment remain.

Commit accounting: seventeen confirmed meaningful client implementation commits and fourteen server implementation commits since initialization. Part 18 supplies the eighteenth client implementation commit and fifteenth server implementation commit. The owner performs all commits and requests continuation. Client delivery must still reach at least 20 meaningful commits. Next: seed connected test accounts/services/bookings and verify full role/payment flows, then finalize route states, responsive QA, deployment, and submission documentation.

Part 18 committed by owner (client c5f9492, server 53d0e26).

Part 19 adds reserved demo admin/customer/two-technician accounts, twelve approved services with seven generated/uploaded device illustrations, and six connected unpaid bookings in different statuses. Credentials are generated into ignored .env.demo. Seed reruns preserve edits and do not duplicate records; non-seed collisions are rejected. Real API workflow checks passed all demo roles, dashboard authorization, moderation/availability visibility, duplicate active booking prevention, cancellation, technician ownership/transitions/completion history, edit approval reset, payment history/monitor reads, and real unpaid Stripe checkout. Check records were cleaned up; no payment was submitted. The seeded public directory was visually inspected. Client additions include root/dashboard error recovery, a custom 404, root loading, and installed-version retry support in service errors. All 31 server tests pass; production build/TypeScript pass. Full signed-in browser/payment verification, responsive QA and deployment remain.

Commit accounting: eighteen confirmed meaningful client implementation commits and fifteen server implementation commits since initialization. Part 19 supplies the nineteenth client implementation commit and sixteenth server implementation commit. The owner performs all commits and requests continuation. Client delivery must still reach at least 20 meaningful commits. Next: final responsive/accessibility fixes, browser workflow verification, deployment and submission documentation.


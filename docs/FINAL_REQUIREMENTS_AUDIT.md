# FixMate final requirements audit

Audited 20 November 2026 against `D:/Assignment 9-Category_006.docx`; extracted reference: [assignment-requirements.txt](assignment-requirements.txt). The document is a specification, not permission to publish credentials or deploy. This report covers the current working tree in both independent repositories, including uncommitted fixes.

**Verdict: required application flows and desktop tables are implemented, deployed, and verified.** Live client and API links are recorded in DEPLOYMENT.md; submission documentation and verification limits are listed below. All eight required desktop dashboard list surfaces now use semantic tables with their existing cards and actions available in expandable details or on smaller screens. Dedicated demo passwords are included in README with explicit owner approval. No mark/percentage is promised.

Status meanings: **Pass** = implemented with source inspection and the evidence stated below; **Partial** = a concrete difference remains; **Pending** = not completed/verified; **Optional** = explicitly optional and not selected; **Review** = subjective assessment requiring a human. Local and production evidence are distinguished below; LIVE_QA.md records the hosted checks.

## Verification evidence

Services redesign follow-up: production build passed; browser checks verified Electrical filter + ascending prices ($20/$22/$27), reload persistence, no-match/reset states and pagination (12 then9 records). Responsive directory grids were checked at 1440px (3 columns), 820px (2) and390px (1), with no horizontal page overflow. Public API confirms three approved available listings per category,21 total. Home category section now uses sage green (#e9f1e1).

Owner-requested professional signup: the home recruitment section links to `/sign-up?role=technician`. Browser verification confirmed the technician option is selected, while ordinary `/sign-up` still defaults to customer. It uses the existing registration API and server role validation; no new account was created during this check. Production build passed after this addition.

Dark-mode follow-up: added a sun/moon pill switch before Home in desktop public navigation, beside the menu on mobile, and in the dashboard top bar. Verified manual light selection survives reload even with a dark system preference, keyboard activation, dark theme across route navigation, Services cards/filters, customer overview/charts and profile inputs. At320px the visible switch and mobile header fit without horizontal page overflow. next-themes preserves the preference; Sonner follows the selected theme. Reduced-motion settings disable switch/color animation. Production build and TypeScript passed. This adds the dark-mode half of O05, not its missing PDF invoice half.

- Client production build: passed, including both exact `/payment/success` and `/payment/cancel` routes. TypeScript is included in the build.
- Server `npm test`: **32 passed, 0 failed**, covering auth policy/JWT/live roles, ownership, public filtering, pagination, uploads, profiles, job transitions, duplicate requests, payment gating, transactional idempotency, webhook signatures, and revenue across pagination.
- `npm run demo:check`: passed with real local API, Atlas and Stripe test mode. All roles signed in; disposable service moderation/availability, requests with and without photos, duplicate protection, cancellation, technician transitions, ownership, edit approval reset, payment-history APIs, and real unpaid Checkout were verified. Disposable records and session were cleaned up.
- Earlier browser payment evidence: a **$40 Stripe sandbox** payment, real signed webhook HTTP 200, customer/admin histories, and exactly one payment/paid timeline event after repeated verification. No real money moved. This is local evidence, not a deployed webhook test.
- Footer email/phone/platform URLs verified in the browser. Desktop and 390px mobile layouts inspected; no horizontal page overflow. All five social icon bounding boxes are centered in their 38px circles (0px horizontal/vertical offset). Hero search for laptop opened the filtered results; the AC shortcut preselected AC and returned two services. Customer bookings loaded after a full navigation with the existing session, refreshed controls and status badges. The locally stored repair photograph loaded successfully. Final hero/footer screenshots were saved alongside the local preview.
- Git histories: **22 client commits**, **19 server commits** before this audit's uncommitted changes. Recent descriptive commits cover distinct implementation milestones. Raw counts exceed the 20/12 minimum; an examiner ultimately judges meaningfulness.

## Repository, stack, configuration and deployment

| ID | Criterion | Status | Evidence / remaining work |
| --- | --- | --- | --- |
| S01 | 20 meaningful client / 12 server commits | Pass | Counts 22/19; descriptive feature milestones in separate Git repositories. No audit changes committed automatically. |
| S02 | README name, purpose, features, packages | Pass | Root README rewritten to remove obsolete milestone claims; includes setup and repository links. |
| S03 | README live URL and admin credentials | Pass | Public README now contains verified live URLs and the dedicated demo credentials, explicitly approved by the owner. |
| S04 | Frontend `.env.local`, server `.env`, secrets excluded from Git | Pass | Ignored actual env files, example templates, browser-safe public settings; private Atlas/auth/JWT/ImgBB/Stripe config on server. |
| S05 | Next App Router; TypeScript/JavaScript; accepted UI library | Pass | Next 16.4.6, TS client, DaisyUI 5/Tailwind 4 with custom theme; real shared controls, not merely a claimed shadcn scaffold. See UI_COMPONENTS.md. |
| S06 | Node/Express/MongoDB; BetterAuth adapter/JWT; Stripe/ImgBB | Pass | Server package.json and implemented modules; real local integration checks. |
| D01 | Working live client/API, no CORS/404/504 failures | Pass | Vercel client and Render API deployed; frontend/API readiness and database connectivity verified. |
| D02 | Every live route reloads successfully | Pass | Required public/details/auth/payment route HTTP checks passed; browser reloads verified on representative private routes for each role. |
| D03 | Logged-in private-route reload retains session | Pass | Customer, technician and admin signed in through the frontend proxy and retained their sessions after private-route reload. |
| D04 | Production domain in auth trusted origins and CORS | Pass | Exact primary frontend origin configured in auth/CORS; production CORS and token exchange verified. |
| D05 | Deployed Stripe test webhook and its signing secret | Pass | Enabled deployed Stripe sandbox endpoint with its own signing secret; approved signed replay HTTP200 and provider resend accepted. |
| D06 | Submission links and live demo accounts | Pass | Live links, both GitHub repositories and live-tested demo credentials supplied in README/private handoff. |

## Data design and business rules

Server paths in this report are relative to `Assignemnt-9-server/`.

| ID | Criterion | Status | Evidence / remaining work |
| --- | --- | --- | --- |
| B01 | Four own-data collections plus BetterAuth infrastructure | Pass | `src/db/indexes.js`: BetterAuth `user` represents users; services, bookings, payments; auth session/account/verification are exempt. |
| B02 | User identity/photo and role/phone/area/bio fields | Pass | `src/auth/auth.js`, profile validation/routes. |
| B03 | Service fields, enum categories/modes, owner snapshot, pending/available defaults | Pass | Service validation and technician routes; protected owner fields from database identity. |
| B04 | Booking service/customer/technician snapshots, request fields, amounts/status/payment | Pass | Booking routes/validation; snapshots survive later service edits. Optional problemImage is additional. |
| B05 | Payment identity names/emails, amount, USD, IDs, paid date/status | Pass | Payment fulfillment now saves both names and `paymentStatus: paid`. Backfill filled labels on one existing verified paid record without inventing a transaction. |
| B06 | Correct user/service/booking/payment relationships | Pass | Owner emails and service/booking IDs; indexed access patterns. |
| B07 | Customer/technician registration only; admin seeded | Pass | Server policy defaults unexpected role to customer; administrator absent from signup controls. |
| B08 | Approved AND available public listings; edit resets approval | Pass | Public Mongo query, service detail visibility, mutation tests and real workflow verification. |
| B09 | Exact status transitions and terminal-state rejection | Pass | `src/bookings/workflow.js`, atomic mutations and tests: requested→accepted/rejected/cancelled; accepted→in-progress; in-progress→completed. |
| B10 | Customer cancellation only while requested | Pass | Ownership and current-state filters; confirmation UI and real workflow checks. |
| B11 | Completion requires positive final amount | Pass | Server numeric/cents validation and completion dialog. |
| B12 | No duplicate active requests for same customer/service | Pass | Partial unique Mongo index plus conflict handling; real duplicate rejected. |
| B13 | Admin/technician cannot request; technician cannot request own service | Pass | Customer-only endpoint and request UI role gate; role tests. |
| B14 | Customer/technician only access owned bookings | Pass | Authenticated database identity scopes reads/mutations; other technician and wrong role rejected in real check. |
| B15 | Pay only for own completed unpaid booking; Paid badge afterward | Pass | Server payment gate + customer UI; supplied client amount ignored. |

## Shared layout, authentication and public pages

| ID | Criterion | Status | Evidence / remaining work |
| --- | --- | --- | --- |
| L01 | Consistent wrench logo and brand | Pass | Shared Brand component in header/footer/sidebar. |
| L02 | Home/services/about navigation; sticky/active navbar | Pass | Header, publicLinks and active-route styling. |
| L03 | Guest sign-in/up; avatar dropdown with name/role/dashboard/profile/sign-out | Pass | AccountMenu; role-aware dashboardPath and Sonner sign-out feedback. |
| L04 | Mobile hamburger navigation | Pass | Responsive Header with accessible controls. |
| L05 | Footer logo/tagline/links/categories/copyright | Pass | Shared footer. |
| L06 | Footer email and phone | Pass | Owner-provided mailto/tel values, verified in browser. |
| L07 | Footer address | Pass | Dhaka, Bangladesh is displayed as the public address, explicitly confirmed by the owner. |
| L08 | Footer social links and new X logo | Pass | Owner explicitly requested generic platform homepages; Facebook, X, Instagram, LinkedIn, GitHub. New X glyph; centered controls with target blank/rel protection. |
| L09 | Public header/footer separate from dashboard sidebar/topbar | Pass | Public route group and DashboardLayout; no public footer in dashboard. |
| L10 | All required public/customer/technician/admin/profile routes | Pass | App route files and successful build output. Both exact payment URLs added; older dashboard payment URLs retained for compatibility. |
| L11 | Guest private-route redirect; wrong-role block/redirect | Pass | Session-aware dashboard guard, API middleware; role boundaries verified. Production reload is D03. |
| A01 | BetterAuth MongoDB adapter and additional fields/default customer | Pass | Server auth config and client session provider. |
| A02 | Signup name/email/password/customer-or-technician selection | Pass | SignUpForm and server policy. |
| A03 | Password ≥6, uppercase/lowercase, required/email validation | Pass | Field errors and client validation; bypass attempts rejected server-side in tests. |
| A04 | Signup toast, dashboard redirect and sign-in link | Pass | Auth forms plus Sonner provider. |
| A05 | Sign-in validation, credential error toast and signup link | Pass | SignInForm; real role sign-ins successful. |
| A06 | Safe attempted-page return; default role dashboard | Pass | Auth navigation helper only accepts safe same-origin paths. |
| A07 | Google login | Optional | Explicitly optional in source document; not configured. This is not a mandatory missing criterion. |
| H01 | Clear hero headline/subtitle/search or CTA and quality visual | Pass | Search-first redesign, category navigation and local repair photograph. Taskrabbit used as inspiration; assets/copy not copied. |
| H02 | Six newest approved available featured services | Pass | getFeaturedServices asks Mongo API for newest limit6; ServiceCard renders required identity/category/mode/price/image. |
| H03 | Equal service cards/images and View Details | Pass | Grid equal rows, consistent photo heights, bounded titles, shared card component. |
| H04 | Four-step find/request/repair/pay flow | Pass | Home steps section. |
| H05 | Clickable seven categories and trust/value section | Pass | Hero rail and category section open URL-filtered browse; factual workflow benefits, no fabricated ratings/statistics. |
| P01 | Approved available browse grid 3–4 desktop/2 tablet/1 mobile | Pass | Shared service grid and responsive breakpoints. |
| P02 | All required card details and friendly no-results state | Pass | Image/title/category/mode/area/price/technician/details; EmptyState/reset CTA. |
| P03 | Full details and technician name/photo/area/bio | Pass | Service details API and page; unavailable/nonexistent service returns404. |
| P04 | Guest repair return-to; only customer request controls | Pass | RepairRequest role/session gating. |
| P05 | Readonly customer name/email; phone/address/date/problem fields | Pass | RepairRequest; date and min20 description checked client/server, Dhaka date boundary tests. |
| P06 | Request initial statuses/snapshots, success link/toast, duplicate error | Pass | Booking creation plus client feedback and real integration checks. |
| P07 | Optional repair damage photo and card hover (owner requests) | Pass | ImgBB uploader with remove/preview; submit allowed without photo; real workflows both ways and prior browser upload verified. Hover/focus motion respects reduced motion. |

## Dashboards and profile

Desktop tables are now complete. Each has column headers and record rows; disclosure buttons open the existing detail cards and actions. Smaller screens render cards directly. Browser checks covered all eight tables across the three roles, technician mobile cards and customer disclosure actions without mutating bookings.

| ID | Criterion | Status | Evidence / remaining work |
| --- | --- | --- | --- |
| U01 | Responsive full-width dashboard, collapsible sidebar, topbar avatar/name/role/home | Pass | Shared role-aware DashboardLayout and responsive CSS. |
| U02 | Reusable overview stats and charts | Pass | Overview/StatsCard/StatusChart with scoped server summaries; real zeros and retry states. |
| U03 | Customer counts: total requests/active/completed | Pass | Customer overview summary endpoint. |
| U04 | Customer bookings fields, cancel/pay gates and paid badge | Pass | Bookings page, confirmations, status/timeline components. |
| U05 | Customer bookings desktop table/mobile cards | Pass | Semantic desktop table; existing booking cards on smaller screens. |
| U06 | Customer payment history fields incl technician name | Pass | Payment history now renders technician name plus email, amount/transaction/date/service; scoped server API. |
| U07 | Customer payment history table | Pass | Shared payment-history table with existing receipt cards on smaller screens. |
| U08 | Technician counts: services/approved/pending requests | Pass | Technician overview summary endpoint. |
| U09 | Validated add-service fields + ImgBB file input | Pass | ServiceEditor/ImageUpload; positive price and required image; no URL-only image field. |
| U10 | Readonly technician name/email, pending+available, approval toast | Pass | Identity fields added in audit fixes; server derives trusted owner, defaults and notifications. |
| U11 | Technician service CRUD, prefilling, approval reset, availability | Pass | My Services/editor with confirmation; server ownership and real moderation/edit checks. |
| U12 | My Services table | Pass | Services table with image/title/category/price/approval/availability and management details. |
| U13 | Technician queue fields and status filter | Pass | Requests page shows customer contact/address/date/problem/service/status; includes optional photo. |
| U14 | Only valid buttons; completion amount prefill/modal; terminal no action | Pass | Requests UI and server workflow gate; confirmations for reject. |
| U15 | Technician requests table | Pass | Requests table with contact/address/date/problem/status and existing job actions. |
| U16 | Admin counts: users/technicians/pending services | Pass | Protected admin overview summary endpoint. |
| U17 | User photo/name/email/role/joined date; role edits; no self-role change | Pass | Avatar/joined date added; protected admin role endpoint and tests. |
| U18 | Manage Users table | Pass | Users table with avatar/name/email/role/joined date and expandable role controls. |
| U19 | Admin service approve/reject/filter with pending easy to find | Pass | Pending default filter; server admin moderation tests and real approval check. |
| U20 | Admin service approval table | Pass | Approval table with owner information, filters and moderation details. |
| U21 | Admin readonly all-booking fields and status filter | Pass | AdminBookingsPage; no job mutation controls; protected API. |
| U22 | Admin bookings table | Pass | Read-only booking table with filters and full request/timeline details. |
| U23 | All transactions and total revenue above list | Pass | Names/emails/service/amount/reference/date; totalRevenue aggregates all matching records rather than current page. Tests cover multi-page totals. |
| U24 | Admin transaction table | Pass | Transactions table with required fields; aggregate revenue remains above it. |
| U25 | Every role edits name/phone/area/bio/photo; readonly email/role | Pass | Shared profile page, ImgBB upload and protected profile tests for all roles. |
| U26 | Name/photo update navbar/topbar without logout | Pass | Save awaits shared session refetch; both surfaces consume same session provider. Source verified; complete browser photo-save journey not rerun during this audit. |

## Stripe, feedback and design

| ID | Criterion | Status | Evidence / remaining work |
| --- | --- | --- | --- |
| F01 | Protected Checkout with bookingId, stored finalAmount ×100 | Pass | Payment service ignores client amount; customer gate; testmode only. API supports create-checkout-session alias. |
| F02 | Checkout bookingId/customerEmail metadata and exact success/cancel URLs | Pass | Added customerEmail metadata and `/payment/*` routes. |
| F03 | Success verifies Stripe paid status, stores payment, marks booking paid | Pass | Protected verification endpoint, transaction, signed webhook; local real sandbox payment. |
| F04 | Success amount/reference and return-to-bookings | Pass | VerifyPayment renders receipt and history/bookings links, Sonner payment feedback. |
| F05 | Cancel message and link to retry through bookings; no mutation | Pass | Cancel route explains incomplete attempt and links to bookings; no write request. |
| F06 | No duplicate payments across webhook/verify/retries | Pass | Unique booking/session/intent indexes, transactional fulfillment, concurrent callback/rollback tests, real repeated verification. |
| F07 | Signed raw-body webhook (fourth challenge described in payment section) | Pass | Signature tests, local delivery and deployed signed replay returned200; provider resend and duplicate protection verified. |
| X01 | Public/dashboard loading states | Pass | loading.tsx and component skeleton/loading feedback. |
| X02 | Tool-themed404/Home button and clear error boundaries | Pass | Wrench illustration added; root/dashboard/service error routes use installed Next retry API. |
| X03 | Sonner or react-hot-toast notifications | Pass | Replaced custom toast implementation with Sonner through shared useToast; auth, CRUD, status, payments and failures use it. Inline validation remains inline. |
| X04 | Empty states with useful guidance/CTA | Pass | Shared EmptyState across listings/bookings/queues; filter/reset/add/browse guidance according to role. |
| X05 | Confirmation before service delete/booking cancel/request reject | Pass | Shared confirmation dialog and the three action flows. |
| X06 | Connected seed: 2 technicians, ≥12 approved services, varied bookings | Pass locally | Demo seed expanded to 21 approved available services (three per category), two technicians and six connected booking examples. Existing edits/payments preserved. Live-site population still depends on deployment. |
| V01 | Consistent headings, paragraphs, images, spacing and buttons | Pass | Shared typography/tokens/components and redesign stylesheet. Subjective quality remains a user/reviewer decision. |
| V02 | Responsive public/dashboard/mobile/tablet/desktop | Pass locally | Responsive CSS, prior dashboard checks, current hero/footer checks. Does not guarantee every device/browser. |
| V03 | Consistent status colors | Pass | Shared blue requested, indigo accepted, amber progress, green completion, red rejection, gray cancellation. |
| V04 | Unique design; no similarity to module/example submissions | Review | Original implementation; Taskrabbit composition explicitly requested as inspiration. Cannot certify originality against inaccessible student projects. |
| V05 | Pleasing contrast/recruiter appeal | Review | Refreshed forest/peach palette and readable type; no complete automated WCAG audit or subjective grading claim. |

## Challenges and selected optional features

| ID | Criterion | Status | Evidence |
| --- | --- | --- | --- |
| C01 | Server title/category search, category/mode filter, price/newest sort | Pass | `src/services/query.js`; Mongo query/sort/pagination tested, literal regex handling. |
| C02 | URL persistence/reload and home-category preselection | Pass | GET forms/searchParams/category links. |
| C03 | Custom verifyToken/customer/technician/admin middleware;401/403 | Pass | Middleware auth module, route guards and live-role/JWT tests. |
| C04 | All specified private endpoint roles and ownership | Pass | Route modules/tests; admin `/payments` and checkout path aliases added. Profile verifies identity. Public service GETs remain public. |
| C05 | Server-owned job transition/payment gate | Pass | Workflow and payment tests plus real multi-role integration check. |
| C06 | Fourth challenge webhook | Pass locally | Described in payment section although challenge heading list only numbers1–3; implemented and verified locally. |
| O01 | Job timeline tracker | Pass | statusHistory and visual requested→accepted→progress→completed→paid steps; terminal cases and Dhaka dates. |
| O02 | Server-side browse pagination composing filters/sort | Pass | Mongo skip/limit; page controls preserve URL options. |
| O03 | Pro subscription | Optional | Not selected. |
| O04 | Ratings/reviews | Optional | Not selected. |
| O05 | PDF invoice + dark mode | Partial | Dark mode added across public pages/dashboards with a persistent sun/moon switch. PDF invoices are not implemented, so this combined optional requirement is not counted as a third fully completed item. |

## Final handoff and limits

Application deployment, production origins, Stripe signing configuration and live workflow checks are complete. The final handoff includes documentation and a production startup-timeout adjustment; confirm the hosting dashboard deploys the intended pushed revision. Public demo credentials were explicitly approved. The owner confirmed the public footer address as Dhaka, Bangladesh (L07). No automated claim is made about subjective design grading or originality against inaccessible student submissions.

The app accepts positive cent amounts; Stripe imposes its own minimum charges. Normal seeded USD prices exceed that minimum. Free Render hosting can wake slowly; see DEPLOYMENT.md. Google login and unselected optional enhancements do not block the required application flows.

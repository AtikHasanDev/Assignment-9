# Live verification — 20 November 2026

Client: https://fixmate-atikhasan.vercel.app
API: https://fixmate-api-atikhasan.onrender.com

## Passed

- Production Next.js build and TypeScript; 32 server tests passed.
- Render /api/ready and frontend /api/ready returned200 with MongoDB connected.
- Exact CORS frontend origin and credentials=true confirmed on the deployed API.
- Disposable deployed multi-role workflow check passed: all four demo sign-ins, role boundaries, service creation/approval/availability, booking with/without damage photos, duplicate conflict, cancellation, ownership, technician pipeline, approval reset, histories and real Stripe test Checkout creation/unpaid verification. Temporary service/bookings and Checkout session were cleaned up; seed and user records preserved.
- Hosted browser checks: customer, technician and admin sign-in and private-route reload; customer cannot enter admin pages; guest redirect and return-to sign-in.
- Hosted ImgBB upload returned201 and an i.ibb.co URL for a generated public demo illustration. No profile or service was modified by this upload check.
- Required public/details/auth/payment pages and a direct customer-bookings load returned200; an unknown route returned404.
- Approved signed replay of the existing $40 demo sandbox event returned200. Stripe provider resend accepted. Exactly one payment and one Paid history entry remained afterward. No new charge created.
- All eight desktop dashboard tables verified locally across the three roles before deployment; representative customer, technician and admin tables also verified on the hosted app. Mobile technician cards retained without horizontal page overflow.
- Public styling, category filtering, pagination, dark-mode persistence and professional signup were checked during the preceding UI work. Runtime images and database-backed listings load on the hosted app.

## Limits and submission notes

Render Free can sleep and wake slowly. The production fetch timeout is extended; this is not an always-warm hosting guarantee. Design originality and examiner marks are human judgments; no automatic100% certification is claimed. Google login is explicitly optional. Two complete optional features are implemented (timeline and pagination); dark mode is implemented, but the combined PDF-invoice + dark-mode optional item still lacks PDF invoices.

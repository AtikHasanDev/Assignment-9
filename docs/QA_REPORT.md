# Local verification report

Verified on 20 November 2026. Production hosting checks remain pending.

Optional damage-photo follow-up: production build/TypeScript and all 32 server tests pass. Real API checks create requests without a photo and with a trusted photo URL, and verify technician visibility. Browser QA uploaded an actual PNG to ImgBB, displayed its preview, removed it, and confirmed the submit button remains enabled without a photo. The 390px request form had no horizontal overflow. Service-card hover lift/image zoom uses pointer-capability queries and disables motion under prefers-reduced-motion.

| Check | Result |
| --- | --- |
| Production Next.js build and TypeScript | Passed |
| Server tests | 31 passed |
| Live demo API workflows | All roles, authorization, approval, availability, duplicates, cancellation, ownership, and technician transitions passed |
| Browser customer sign-in | Passed; role dashboard and six connected bookings displayed |
| Browser admin sign-in | Passed; admin dashboard and transaction view displayed |
| Mobile at 390px | Customer dashboard/bookings/history and payment return inspected; no horizontal overflow observed |
| Desktop at 1280px | Customer payment history inspected; no horizontal overflow observed |
| Keyboard navigation | Mobile drawer wraps Shift+Tab, Escape closes it and restores toggle focus; background is inert while open |
| Stripe browser checkout | Successful $40 USD sandbox card payment; no real money moved |
| Stripe return verification | Payment confirmed; amount and transaction reference displayed |
| Customer/admin history | Both show the same single paid repair record |
| Real Stripe webhook | checkout.session.completed delivered to local API with HTTP 200 |
| Repeat payment verification | Exactly one payment document and one Paid timeline entry remain after concurrent repeat verification |
| Checkout cancellation | Returns to the unpaid-attempt cancellation screen |
| USD checkout | Adaptive conversion disabled; real newly created test sessions verified with adaptive_pricing.enabled=false |
| Production API proxy | Locally built server on port 3001 forwarded /api/ready and /api/auth/get-session successfully; temporary server stopped after checks |
| Custom 404 | HTTP 404 and recovery links verified |
| Demo seed rerun | No duplicate records; existing edits preserved |

Changes from these checks: keyboard focus/background handling in dashboard navigation, account-menu dismissal on Escape/outside click/route change, singular payment pagination text, long transaction-reference wrapping, optional API_PROXY_URL rewrite for deployment, and robots exclusions for private/auth paths.

Screenshots are local verification artifacts in the chat's visualization directory: payment-confirmed-mobile.jpg, payment-history-desktop.jpg, and admin-transactions-desktop.jpg. They contain fictional demo account data.

Still needed: deployed Vercel/Render URLs, production proxy/session-cookie checks, a deployed Stripe webhook delivery, final submission credentials/URLs, and targeted signed-in technician/profile-upload browser checks. Those technician and profile APIs are tested, and their live provider/API checks pass; the complete browser journeys have not all been exercised.

# Stripe test setup

The app accepts Stripe test payments only. Never paste secret keys into chat or commit them.

## Current local setup

Browser QA follow-up: a $40 USD sandbox payment was completed successfully. The return page, both history views, a real HTTP 200 webhook delivery, and one-record/one-timeline-event behavior after repeated verification were confirmed. New sessions disable adaptive conversion for consistent USD checkout. No real money moved.

The existing sandbox test secret and the local listener signing secret are configured in the server's ignored .env. The official Stripe CLI is installed under the ignored node_modules/.cache/stripe-cli folder. The listener was started in the background and forwards the two checkout completion events to localhost:5000. A real Stripe $1 test checkout session was created and verified as unpaid, then expired; its disposable MongoDB booking was removed. No card payment was submitted.

To restart this local listener from the server directory, run `npm run stripe:listen`. It reads the existing key from .env via an environment variable, writes the listener's signing secret back to .env without printing it, and forwards webhooks. Restart the API after the listener reports ready. Avoid starting a second listener while the existing one is running. The CLI can be reinstalled locally with `npm install --prefix node_modules/.cache/stripe-cli --no-package-lock --no-save @stripe/cli`; STRIPE_CLI_PATH can point to another official Stripe executable.

Run `npm run stripe:check` to repeat the real test checkout configuration check without submitting a payment. The integration uses Dashboard-managed dynamic payment methods; it does not send the removed payment_method_types parameter.

## Manual setup on another machine

1. Create or sign in to an account at https://dashboard.stripe.com/register. Open a sandbox/test environment and its API keys page: https://dashboard.stripe.com/test/apikeys. Save the **secret** key (starts with `sk_test_`) in `D:\Assignment-9\Assignemnt-9-server\.env`:

   ```dotenv
   STRIPE_SECRET_KEY=sk_test_your_key
   PAYMENT_CLIENT_ORIGIN=http://localhost:3000
   ```

2. Install the official Stripe CLI using https://docs.stripe.com/stripe-cli/install. In a terminal run:

   ```powershell
   stripe login
   stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded --forward-to http://localhost:5000/api/payments/webhook
   ```

   Keep the listener running. Copy the `whsec_...` signing secret printed by this listener into the server `.env` as `STRIPE_WEBHOOK_SECRET`. The CLI listener secret differs from a Dashboard endpoint's secret.

3. Restart the API after changing `.env`:

   ```powershell
   cd D:\Assignment-9\Assignemnt-9-server
   npm start
   ```

   If port 5000 is already occupied, stop the existing API first. The client runs separately with `npm run dev` in `D:\Assignment-9`.

4. Sign in as a customer, request a service, and have its technician accept, start, and complete it. Set a final USD amount of at least $0.50 (Stripe's USD minimum). Open My bookings and choose **Pay with Stripe**. For a successful test payment, use card `4242 4242 4242 4242`, any future expiry, and any three-digit CVC. See https://docs.stripe.com/testing for other test scenarios.

5. Verify the return page confirms payment, My bookings shows Paid, and the listener reports successful webhook delivery. Refreshing verification or redelivering the event must create only one payment and one paid timeline entry. Closing checkout must leave the booking unpaid. A failed return-page request does not cancel a Stripe payment: check again before retrying checkout.

The server uses trusted booking amounts and customer ownership; client-supplied amounts, identities, and return URLs are ignored. Existing open sessions are reused, expired sessions can be replaced, and repeated creation requests share a stored idempotency key. Both verification and signed webhooks use the same MongoDB transaction to insert payment history and mark the booking paid. MongoDB must support transactions (Atlas does).

Automated checks run with `npm test` in the server directory. `node scripts/check-payment-transactions.js` checks real MongoDB concurrency using a simulated Stripe session and cleans up its disposable records. It does not charge a card or verify live Stripe credentials.

Deployment: configure the deployed client origin in both `CLIENT_ORIGINS` and `PAYMENT_CLIENT_ORIGIN`, register the public HTTPS `/api/payments/webhook` endpoint for the two checkout events, and use that endpoint's signing secret. Keep test keys for this assignment.

# OrderTaker — Backend Schema & API Notes

Supabase project: `hvyfeebazmiqateniupm`

## Tables (prefix `ot_`)

- **ot_restaurants** — one row per customer location. Stores plan (`starter`/`restaurant`), languages, upsell prompts (JSON), POS info, open hours.
- **ot_menu_items** — menu catalog per restaurant, flags upsell-eligible items.
- **ot_orders** — every order created by the AI phone agent. Status flow: `new → preparing → ready → completed` (or `cancelled`). Tracks subtotal, upsell revenue, total, quoted wait time.
- **ot_order_items** — line items per order, flags `is_upsell`.
- **ot_reservations** — Restaurant Plan only. Status: `confirmed → seated → completed` (or `cancelled`/`no_show`).
- **ot_call_log** — every inbound call, outcome (`order_placed`, `reservation_made`, `info_only`, `voicemail`, `hung_up`). Powers the "Calls Answered Today" stat.

## Demo data

One seed restaurant: **Cairo Kitchen** (matches the landing page phone mockup and kitchen dashboard demo), Restaurant Plan, upsell enabled with the Mint Lemonade prompt ($4).

## Dashboard data flow (next implementation step)

The kitchen dashboard (`dashboard.html`) is currently a static demo with hardcoded orders. To make it live:

1. Dashboard reads `ot_orders` + `ot_order_items` where `restaurant_id = <this restaurant>` and `status in ('new','preparing','ready')`, ordered by `created_at`.
2. "Start Preparing" / "Mark Ready" / "Mark Picked Up" buttons → `update ot_orders set status = ... where id = ...`
3. Stats bar pulls from `ot_orders` (today's avg order, upsell revenue sum) and `ot_call_log` (calls answered count).
4. Reservations panel reads `ot_reservations` where `reservation_date = today`.
5. Use Supabase Realtime subscriptions on `ot_orders` so new orders appear instantly without polling — mirrors the "new order every 25s" demo simulation but driven by real inserts from the AI agent.

## AI Agent → Database flow (when voice agent is connected)

1. Call comes in → log row in `ot_call_log` with `caller_phone`.
2. AI completes order → insert `ot_orders` row (`status='new'`) + `ot_order_items` rows.
3. If `upsell_enabled` and order matches a prompt trigger, AI offers item; if accepted, insert an `ot_order_items` row with `is_upsell=true` and update `ot_orders.upsell_total`/`total`.
4. AI quotes wait time → `ot_orders.wait_time_minutes`.
5. SMS/email confirmation sent → set `sms_sent`/`email_sent` flags.
6. If reservation → insert `ot_reservations` row instead, link via `ot_call_log.reservation_id`.

## Security note

RLS is enabled on all tables with `service_role`-only policies for now (the AI agent backend uses the service role key). When restaurant owners get individual dashboard logins, add per-restaurant policies scoped to `auth.uid()` mapped via a future `ot_restaurant_users` table.

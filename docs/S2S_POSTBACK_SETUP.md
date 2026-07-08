# Server-to-Server (S2S) Postback Setup

Every outbound affiliate click already carries a UUID `click_id` (as `sub1`,
`s1`, `subid`, and `click_id` on the URL, so any partner macro picks it up).
When a partner fires an S2S postback into
`https://<project-ref>.functions.supabase.co/record-conversion`, we JOIN the
conversion back to the click and real revenue lights up in `/admin/revenue`.

## Universal receiver URL

```
https://<project-ref>.functions.supabase.co/record-conversion?token=<AFFILIATE_POSTBACK_TOKEN>
  &partner=<network-id>
  &sub_id=<their-macro-for-our-click-id>
  &tx=<their-transaction-id>
  &amount=<payout-in-numeric>
  &currency=USD
  &status=approved
```

The token lives in the Lovable Cloud environment as
`AFFILIATE_POSTBACK_TOKEN`. It is a shared secret — treat it like an API key
and paste it into each partner dashboard exactly once.

Reversals: send the same `partner` + `tx` with `status=reversed`; the row is
upserted, not duplicated.

Both `GET` and `POST` are accepted. Add `&pixel=1` to receive a 1×1 GIF
response for partners that fire the postback from an `<img>` tag.

## Per-partner templates

Copy-paste into each partner's dashboard under "Postback URL" /
"Server-to-Server tracking" / "Pixel URL".

### Ledger Affiliate (Impact)
Impact macro for our click id is `{SubId1}`, transaction is `{ActionId}`,
payout is `{Payout}`.
```
https://<ref>.functions.supabase.co/record-conversion?token=XXX
  &partner=ledger
  &sub_id={SubId1}
  &tx={ActionId}
  &amount={Payout}
  &currency={Currency}
  &status={Status}
```

### Coinbase (Impact)
Same Impact macros as Ledger — use `partner=coinbase`.

### Koinly
Koinly's affiliate dashboard uses `{via}` for our sub-id and `{payout}` /
`{order_id}`.
```
https://<ref>.functions.supabase.co/record-conversion?token=XXX
  &partner=koinly
  &sub_id={via}
  &tx={order_id}
  &amount={payout}
  &status=approved
```

### MEXC
```
https://<ref>.functions.supabase.co/record-conversion?token=XXX
  &partner=mexc
  &sub_id={sub1}
  &tx={inviteeUid}
  &amount={commission}
  &status={settleStatus}
```

### Bybit
```
https://<ref>.functions.supabase.co/record-conversion?token=XXX
  &partner=bybit
  &sub_id={sub1}
  &tx={uid}
  &amount={commission_usd}
  &status={status}
```

### RedotPay
```
https://<ref>.functions.supabase.co/record-conversion?token=XXX
  &partner=redotpay
  &sub_id={aff_sid}
  &tx={order_id}
  &amount={payout}
  &status={status}
```

### TradingView
TradingView's affiliate pays on plan subscription; check their macro docs
for the exact placeholder names (`{sub1}` / `{amount}` / `{order_id}`).
```
https://<ref>.functions.supabase.co/record-conversion?token=XXX
  &partner=tradingview
  &sub_id={sub1}
  &tx={order_id}
  &amount={commission}
```

## Verifying a partner

1. Paste the URL into the partner dashboard, save.
2. In their dashboard, trigger a "test postback" if the option exists.
3. Open `/admin/revenue` — a new row appears in the conversions total.
4. In Supabase SQL editor: `select * from conversions order by created_at desc limit 5;` — inspect the `raw_payload` column to confirm the macros expanded correctly.
5. If `click_id` is null on the row, the partner's postback template did not
   include the sub-id macro. Fix the template.

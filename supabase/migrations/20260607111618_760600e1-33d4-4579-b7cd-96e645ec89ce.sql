INSERT INTO public.affiliates (id, name, category, tier, priority, enabled, url_en, url_tr, cta_short_en, cta_short_tr, description_en, description_tr, badge_en, badge_tr, logo_color, target_pages, target_results, language_restriction, commission_rate, commission_currency, cookie_days)
VALUES (
  'redotpay', 'RedotPay', 'card', 1, 9, true,
  'https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0',
  'https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0',
  'Get $5 free', '5$ ücretsiz al',
  'Crypto Visa card with Apple Pay & Google Pay. Pay for X, Telegram, Reddit and more with BTC.',
  'Apple Pay & Google Pay destekli kripto Visa kartı. X, Telegram, Reddit aboneliklerini BTC ile öde.',
  '$5 bonus', '5$ bonus', '#FF2C5B',
  ARRAY['*']::text[],
  ARRAY['profit','cashout','spend','high-value']::text[],
  ARRAY[]::text[],
  20, 'USD', 365
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  tier = EXCLUDED.tier,
  priority = EXCLUDED.priority,
  enabled = EXCLUDED.enabled,
  url_en = EXCLUDED.url_en,
  url_tr = EXCLUDED.url_tr,
  cta_short_en = EXCLUDED.cta_short_en,
  cta_short_tr = EXCLUDED.cta_short_tr,
  description_en = EXCLUDED.description_en,
  description_tr = EXCLUDED.description_tr,
  badge_en = EXCLUDED.badge_en,
  badge_tr = EXCLUDED.badge_tr,
  logo_color = EXCLUDED.logo_color,
  target_pages = EXCLUDED.target_pages,
  target_results = EXCLUDED.target_results,
  commission_rate = EXCLUDED.commission_rate,
  cookie_days = EXCLUDED.cookie_days;
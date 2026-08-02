INSERT INTO public.affiliates (id, name, category, tier, priority, enabled, url_en, url_tr, conversion_intent)
VALUES
  ('koinly',      'Koinly',      'tax',       1, 9, true, 'https://koinly.io/',            'https://koinly.io/',            'high'),
  ('coinbase',    'Coinbase',    'exchange',  1, 8, true, 'https://www.coinbase.com/',     'https://www.coinbase.com/',     'medium'),
  ('mexc',        'MEXC',        'exchange',  2, 8, true, 'https://www.mexc.com/',         'https://www.mexc.com/',         'medium'),
  ('bybit',       'Bybit',       'exchange',  2, 7, true, 'https://www.bybit.com/',        'https://www.bybit.com/',        'medium'),
  ('tradingview', 'TradingView', 'tools',     1, 9, true, 'https://www.tradingview.com/',  'https://www.tradingview.com/',  'high'),
  ('axi',         'Axi',         'trading',   1, 9, true, 'https://www.axi.com/int/live-account?promocode=4744672', 'https://www.axi.com/int/live-account?promocode=4744672', 'high')
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      category = EXCLUDED.category,
      enabled = true,
      updated_at = now();
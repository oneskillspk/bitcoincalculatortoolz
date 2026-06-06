-- Normalize target_pages to match the URL slugs used by calculator pages
UPDATE public.affiliates SET target_pages = (
  SELECT ARRAY(
    SELECT DISTINCT CASE
      WHEN x = 'tax-calculator' THEN 'capital-gains-tax'
      WHEN x = 'capital-gains' THEN 'capital-gains-tax'
      WHEN x = 'savings' THEN 'bitcoin-savings'
      WHEN x = 'mining' THEN 'mining-profitability'
      ELSE x
    END
    FROM unnest(target_pages) x
  )
);

-- Enable the starter set
UPDATE public.affiliates
SET enabled = true
WHERE id IN ('ledger', 'trezor', 'swan_bitcoin', 'koinly', 'btcturk');
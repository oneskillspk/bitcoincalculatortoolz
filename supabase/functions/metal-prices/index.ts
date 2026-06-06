import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback values (March 2026 reference)
const FALLBACK = {
  gold_per_gram_usd: 164.34,
  silver_per_gram_usd: 2.73,
  silver_nisab_usd: 1671.74,
  gold_nisab_usd: 14377.88,
  exchange_rates: {
    PKR: 279, INR: 86.5, AED: 3.67, GBP: 0.79, BDT: 121,
    MYR: 4.47, IDR: 16200, SAR: 3.75, NGN: 1550, EUR: 0.92,
    CAD: 1.36, AUD: 1.54, TRY: 36.5
  },
  btc_usd: 85000,
  updated_at: '2026-03-13T00:00:00Z',
  is_fallback: true,
};

const SILVER_NISAB_GRAMS = 612.36;
const GOLD_NISAB_GRAMS = 87.48;
const TROY_OZ_TO_GRAMS = 31.1035;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const METALS_API_KEY = Deno.env.get('METALS_API_KEY');
    if (!METALS_API_KEY) {
      console.error('METALS_API_KEY not configured');
      return new Response(JSON.stringify(FALLBACK), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch metal prices and exchange rates in parallel
    const [metalsRes, ratesRes, btcRes] = await Promise.allSettled([
      fetch(`https://api.metals.dev/v1/latest?api_key=${METALS_API_KEY}&currency=USD&unit=toz`),
      fetch('https://open.er-api.com/v6/latest/USD'),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
    ]);

    let goldPerGram = FALLBACK.gold_per_gram_usd;
    let silverPerGram = FALLBACK.silver_per_gram_usd;
    let exchangeRates = FALLBACK.exchange_rates;
    let btcUsd = FALLBACK.btc_usd;
    let isFallback = false;

    // Parse metals
    if (metalsRes.status === 'fulfilled' && metalsRes.value.ok) {
      const metals = await metalsRes.value.json();
      if (metals.metals?.gold) {
        goldPerGram = metals.metals.gold / TROY_OZ_TO_GRAMS;
      }
      if (metals.metals?.silver) {
        silverPerGram = metals.metals.silver / TROY_OZ_TO_GRAMS;
      }
    } else {
      isFallback = true;
      console.warn('Metals API failed, using fallback');
    }

    // Parse exchange rates
    if (ratesRes.status === 'fulfilled' && ratesRes.value.ok) {
      const ratesData = await ratesRes.value.json();
      if (ratesData.rates) {
        exchangeRates = {
          PKR: ratesData.rates.PKR || FALLBACK.exchange_rates.PKR,
          INR: ratesData.rates.INR || FALLBACK.exchange_rates.INR,
          AED: ratesData.rates.AED || FALLBACK.exchange_rates.AED,
          GBP: ratesData.rates.GBP || FALLBACK.exchange_rates.GBP,
          BDT: ratesData.rates.BDT || FALLBACK.exchange_rates.BDT,
          MYR: ratesData.rates.MYR || FALLBACK.exchange_rates.MYR,
          IDR: ratesData.rates.IDR || FALLBACK.exchange_rates.IDR,
          SAR: ratesData.rates.SAR || FALLBACK.exchange_rates.SAR,
          NGN: ratesData.rates.NGN || FALLBACK.exchange_rates.NGN,
          EUR: ratesData.rates.EUR || FALLBACK.exchange_rates.EUR,
          CAD: ratesData.rates.CAD || FALLBACK.exchange_rates.CAD,
          AUD: ratesData.rates.AUD || FALLBACK.exchange_rates.AUD,
          TRY: ratesData.rates.TRY || FALLBACK.exchange_rates.TRY,
        };
      }
    } else {
      isFallback = true;
      console.warn('Exchange rate API failed, using fallback');
    }

    // Parse BTC price
    if (btcRes.status === 'fulfilled' && btcRes.value.ok) {
      const btcData = await btcRes.value.json();
      if (btcData.bitcoin?.usd) {
        btcUsd = btcData.bitcoin.usd;
      }
    }

    const silverNisabUsd = SILVER_NISAB_GRAMS * silverPerGram;
    const goldNisabUsd = GOLD_NISAB_GRAMS * goldPerGram;

    const result = {
      gold_per_gram_usd: Math.round(goldPerGram * 100) / 100,
      silver_per_gram_usd: Math.round(silverPerGram * 100) / 100,
      silver_nisab_usd: Math.round(silverNisabUsd * 100) / 100,
      gold_nisab_usd: Math.round(goldNisabUsd * 100) / 100,
      exchange_rates: exchangeRates,
      btc_usd: btcUsd,
      updated_at: new Date().toISOString(),
      is_fallback: isFallback,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (error) {
    console.error('Metal prices error:', error);
    return new Response(JSON.stringify(FALLBACK), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

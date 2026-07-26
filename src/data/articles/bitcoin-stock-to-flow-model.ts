import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-stock-to-flow-model',
  title: 'Bitcoin Stock-to-Flow (S2F) Model: How It Works & Its Limits',
  metaDescription: 'The S2F model predicted Bitcoin accurately from 2015–2021, then failed in 2022 when BTC should have hit $100K but crashed. Learn the formula and its limits.',
  quickAnswer: "Stock-to-Flow (S2F) models Bitcoin's price from its scarcity: existing supply ÷ annual new issuance. Post-2024 halving, S2F projects a fair value near $500K per BTC by 2028. The model fit the 2013–2021 cycle well but has diverged since — treat it as one long-term reference, not a trading signal.",
  category: 'Market Analysis',
  publishedDate: '2026-03-09',
  updatedDate: '2026-03-09',
  readingTime: 9,
  keywords: ['bitcoin stock to flow', 'bitcoin S2F model', 'PlanB bitcoin model', 'stock to flow bitcoin explained', 'bitcoin scarcity model', 'S2F ratio bitcoin', 'bitcoin halving stock to flow'],
  relatedCalculators: ['on-chain', 'halving-countdown', 'power-law', 'supply'],
  relatedArticles: ['bitcoin-on-chain-metrics-guide', 'bitcoin-power-law-explained', 'bitcoin-halving-explained'],
  faqs: [
    {
      question: 'What is Bitcoin\'s current Stock-to-Flow ratio?',
      answer: 'As of 2026, Bitcoin\'s S2F ratio is approximately 118, calculated by dividing circulating supply (~19.8M BTC) by annual new supply (~168,000 BTC). After the 2024 halving reduced the block reward to 3.125 BTC, Bitcoin\'s S2F ratio now exceeds gold\'s (~60), making it the scarcest asset by this metric.'
    },
    {
      question: 'Does the Stock-to-Flow model accurately predict Bitcoin\'s price?',
      answer: 'The S2F model has been controversial. It correctly predicted the general direction of Bitcoin\'s price through 2021, but overestimated prices in the 2022 bear market by 75-80%. Critics argue the model is flawed, while supporters note that no model is perfectly accurate and S2F captures the scarcity relationship well on longer timeframes.'
    },
    {
      question: 'How does Stock-to-Flow compare to the Power Law model?',
      answer: 'Both are logarithmic models, but they differ in methodology. S2F uses scarcity ratios to derive price targets, while the Power Law model uses time-based regression. The Power Law has shown greater precision in recent years, but S2F remains valuable for understanding scarcity dynamics, especially around halving events.'
    },
    {
      question: 'Has the Stock-to-Flow model been accurate after halvings?',
      answer: 'S2F accurately captured the directional price moves after the 2012 and 2016 halvings. The 2020 halving showed more mixed results — Bitcoin reached new all-time highs as the model predicted, but fell significantly short of the $100K+ price targets suggested by the original S2F model during that cycle.'
    }
  ],
  howToSteps: [
    { name: 'Understand stock vs flow', text: 'Stock is the total existing supply of an asset. Flow is the new supply produced annually. For Bitcoin, stock is ~19.8M BTC and flow is ~168,000 BTC/year after the 2024 halving.' },
    { name: 'Calculate the S2F ratio', text: 'Divide stock by flow. Bitcoin\'s current S2F ratio of ~118 means it would take 118 years of mining at current rates to double the existing supply.' },
    { name: 'Compare with other assets', text: 'Gold has S2F ~60, Silver ~22. Bitcoin now surpasses gold, making it the scarcest asset by this metric. Fiat currencies have S2F near 0 due to unlimited printing potential.' },
    { name: 'Apply the price model', text: 'The original S2F model uses regression: ln(Price) = a × ln(S2F) + b. This produces a price target based on scarcity. Higher S2F = higher predicted price.' },
    { name: 'Evaluate model accuracy', text: 'Track actual price against S2F predictions. Understand that the model has limitations and should be combined with other indicators like the Power Law and on-chain metrics.' }
  ],
  sections: [
    {
      id: 'what-is-s2f',
      heading: 'What Is Stock-to-Flow',
      content: 'The **Stock-to-Flow (S2F) model** is a quantitative framework that measures an asset\'s scarcity by comparing its existing supply (stock) to its annual production rate (flow). The formula is simple:\n\n**S2F Ratio = Stock ÷ Flow**\n\nFor Bitcoin:\n• **Stock** = Total circulating supply (~19.8 million BTC as of 2026)\n• **Flow** = New Bitcoin mined annually (~168,000 BTC after the 2024 halving)\n• **S2F Ratio** = 19.8M ÷ 0.168M = **~118**\n\nA higher S2F ratio means an asset is harder to inflate — it would take longer for new supply to significantly dilute existing holdings. This concept has been used for decades to analyze **precious metals** like gold and silver, where scarcity is a primary driver of value.\n\nThe model was adapted for Bitcoin by pseudonymous analyst **PlanB** in 2019, who published the original model on [Medium](https://medium.com/@100trillionUSD/modeling-bitcoins-value-with-scarcity-91fa0fc03e25). PlanB argued that Bitcoin\'s mathematically guaranteed supply schedule makes it uniquely suited for S2F analysis. Unlike gold, where mining companies can theoretically increase production when prices rise, Bitcoin\'s [halving mechanism](/learn/bitcoin-halving-explained) ensures that new supply decreases predictably every four years regardless of price.\n\nThis **programmatic scarcity** — combined with increasing adoption — forms the theoretical basis for S2F price predictions.',
      cta: {
        calculatorId: 'supply',
        calculatorName: 'Supply & Scarcity Calculator',
        text: 'Explore Bitcoin\'s supply dynamics and scarcity metrics',
        path: '/calculators/supply'
      }
    },
    {
      id: 's2f-formula',
      heading: 'The S2F Formula Explained',
      content: 'PlanB\'s **Stock-to-Flow price model** goes beyond just calculating the ratio — it uses regression analysis to derive price targets based on scarcity. The core formula is:\n\n**ln(Market Value) = a × ln(S2F) + b**\n\nOr in simpler terms: **Price = e^(a × ln(S2F) + b)**\n\nWhere:\n• **ln** = natural logarithm\n• **a** (slope) ≈ 3.0-3.3 based on historical regression\n• **b** (intercept) ≈ determined by historical data fitting\n• **e** = Euler\'s number (~2.718)\n\n**Model Evolution:**\n\n**S2F (Original, 2019)**: Used only Bitcoin\'s data points at monthly intervals. Predicted ~$55,000 after the 2020 halving.\n\n**S2FX (Cross-Asset, 2020)**: Incorporated gold and silver data points, arguing Bitcoin transitions through "phases" (Proof of Concept → E-money → Digital Gold). Predicted higher targets of $100K-288K by end of 2021 cycle.\n\n**Calculating the S2F Ratio Over Time:**\n\n| Halving | Date | Block Reward | Annual Flow | S2F Ratio |\n|---------|------|--------------|-------------|------------|\n| Pre-halving | 2009-2012 | 50 BTC | 2.6M | ~3-7 |\n| 1st halving | 2012 | 25 BTC | 1.3M | ~10 |\n| 2nd halving | 2016 | 12.5 BTC | 657K | ~25 |\n| 3rd halving | 2020 | 6.25 BTC | 328K | ~54 |\n| 4th halving | 2024 | 3.125 BTC | 164K | ~118 |\n| 5th halving | 2028 (est.) | 1.5625 BTC | 82K | ~240 |\n\nNotice how each halving approximately **doubles the S2F ratio**, which the model interprets as fundamentally increasing Bitcoin\'s value floor.',
      cta: {
        calculatorId: 'halving-countdown',
        calculatorName: 'Halving Countdown',
        text: 'Track the next Bitcoin halving event',
        path: '/calculators/halving-countdown'
      }
    },
    {
      id: 's2f-comparison',
      heading: 'Bitcoin vs Gold vs Silver S2F',
      content: 'Comparing S2F ratios across assets reveals why Bitcoin is often called **"digital gold"** — and why some argue it may become even more valuable:\n\n| Asset | Stock | Annual Flow | S2F Ratio | Scarcity Interpretation |\n|-------|-------|-------------|-----------|------------------------|\n| **Bitcoin** | 19.8M BTC | 168K BTC | **~118** | Scarcest asset ever |\n| **Gold** | 210,000 tons | 3,500 tons | **~60** | Historic store of value |\n| **Silver** | 1.6M tons | 27,000 tons | **~22** | Industrial + monetary |\n| **Platinum** | 10,000 tons | 200 tons | **~50** | Industrial focus |\n| **US Dollar** | Unlimited | ~$1T+/year | **~0** | No scarcity |\n\n**Key Insights:**\n\n• **Bitcoin now exceeds gold\'s S2F ratio** — after the 2024 halving, Bitcoin is mathematically the scarcest asset by this metric\n• **Gold\'s S2F has been stable for millennia** — mining output increases slowly and roughly matches jewelry/industrial demand\n• **Bitcoin\'s S2F will keep increasing** — each halving doubles the ratio while gold\'s remains roughly constant\n• **Silver\'s lower S2F** explains why it has underperformed gold as a monetary asset over centuries\n\n**The S2F Hypothesis:**\nIf markets value scarcity consistently across assets, and if Bitcoin achieves similar market acceptance as gold ($12-15 trillion market cap), then Bitcoin\'s price should converge toward valuations implied by its S2F ratio.\n\nAt gold parity (~$12T market cap), Bitcoin would be worth approximately **$600,000 per BTC**. S2F proponents argue this is inevitable; critics argue the model is oversimplified.\n\nExplore the historical scarcity relationship with our [On-Chain Metrics](/calculators/on-chain) dashboard.'
    },
    {
      id: 'planb-predictions',
      heading: 'PlanB\'s Model and Predictions',
      content: '**PlanB** is the pseudonymous Dutch institutional investor who popularized the Bitcoin Stock-to-Flow model in March 2019. His analysis gained widespread attention for correctly predicting Bitcoin\'s general price trajectory through 2021.\n\n**Key Predictions Made:**\n\n• **March 2019**: PlanB predicted Bitcoin would reach ~$55,000 after the 2020 halving based on the original S2F model\n• **April 2020**: S2FX (cross-asset) model predicted $100,000-288,000 by end of 2021\n• **Floor Model**: PlanB later created a "worst case" floor model that predicted monthly price minimums\n\n**Results:**\n\n✅ **Bitcoin reached $69,000 in November 2021** — exceeding the original S2F prediction of $55K\n\n❌ **Bitcoin never reached $100,000 in the 2021 cycle** — falling short of S2FX predictions\n\n❌ **Bitcoin fell to $15,500 in 2022** — breaking the floor model\'s predictions for over a year\n\n**PlanB\'s Current Stance (2024-2026):**\nPlanB has acknowledged the model\'s limitations while maintaining that S2F captures the **long-term relationship** between scarcity and value. He argues that:\n• Short-term deviations are noise\n• The model\'s accuracy should be judged over full cycles, not monthly\n• External factors (Fed policy, regulation) can cause temporary deviations\n• Bitcoin\'s S2F > gold\'s S2F will eventually be reflected in prices\n\n**S2F Price Implications for Current Cycle (2024-2028):**\nWith S2F ratio of ~118, the model suggests fair value in the **$100,000-200,000 range**. However, the model\'s reliability for precise price targets has been questioned after the 2022 breakdown.'
    },
    {
      id: 's2f-after-2024',
      heading: 'S2F After the 2024 Halving',
      content: 'The **April 2024 halving** reduced Bitcoin\'s block reward from 6.25 to 3.125 BTC, pushing the S2F ratio to approximately **118** — nearly double gold\'s ratio. This milestone has important implications:\n\n**Supply Mathematics:**\n• **New daily Bitcoin**: ~450 BTC (down from ~900 pre-halving)\n• **New annual Bitcoin**: ~164,000 BTC (down from ~328,000)\n• **S2F ratio**: ~118 (up from ~57)\n• **Inflation rate**: ~0.85% annually (down from ~1.7%)\n\n**Historical Post-Halving Performance:**\n\n| Halving | S2F Ratio After | Peak Price (Cycle) | Time to Peak |\n|---------|-----------------|-------------------|-------------|\n| 2012 (1st) | ~10 | $1,163 | 365 days |\n| 2016 (2nd) | ~25 | $19,783 | 526 days |\n| 2020 (3rd) | ~54 | $69,044 | 546 days |\n| 2024 (4th) | ~118 | ~$108,000 (so far) | ~240+ days |\n\n**Current Cycle Observations:**\n• Bitcoin reached new all-time highs within months of the 2024 halving — faster than previous cycles\n• The presence of [Bitcoin ETFs](/learn/bitcoin-etf-guide-ibit-fbtc-arkb) fundamentally changed demand dynamics\n• Price action has been less volatile than previous post-halving rallies\n\n**S2F Model Expectations:**\nBased on the S2F ratio of 118, the model suggests Bitcoin\'s "fair value" in the **$150,000-250,000 range** by the end of this cycle. However, the model\'s track record on specific price targets has been mixed.\n\n**What\'s Different This Cycle:**\n• **Institutional demand**: ETF inflows provide steady buying pressure independent of retail sentiment\n• **Reduced volatility**: Professional market structure dampens extreme moves\n• **Regulatory clarity**: Clearer rules reduce uncertainty discount\n\nMonitor halving effects with our [Halving Countdown](/calculators/halving-countdown) and track supply metrics with our [Supply Calculator](/calculators/supply).'
    },
    {
      id: 'criticisms-limitations',
      heading: 'Criticisms and Limitations',
      content: 'The Stock-to-Flow model has faced significant criticism from economists, traders, and even other Bitcoin analysts. Understanding these critiques is essential for using the model appropriately:\n\n**Fundamental Criticisms:**\n\n• **Demand is ignored**: S2F only models supply scarcity, but price is determined by supply AND demand. A scarce asset with no demand is worthless.\n• **Circular logic**: The model assumes scarcity → value, but this relationship is not automatic for digital assets\n• **No comparable assets**: Gold took thousands of years to develop its S2F-price relationship; applying it to a 17-year-old asset may be premature\n• **Cannot go to infinity**: The model implies exponentially increasing prices forever, which is mathematically impossible\n\n**Statistical Criticisms:**\n\n• **Cointegration issues**: Time series data for both S2F and price are non-stationary, making regression potentially spurious\n• **Overfitting**: The model was fit to limited historical data and may not generalize to future conditions\n• **Model selection bias**: Other models (like the [Power Law](/calculators/power-law)) show similar or better fits with different theoretical foundations\n\n**Practical Failures:**\n\n• **2022 breakdown**: Bitcoin spent over 12 months below S2F model predictions, with actual price 75% below "fair value"\n• **Floor model invalidated**: PlanB\'s floor model was violated for extended periods\n• **S2FX overestimation**: The cross-asset model predicted $100K+ by end of 2021, which didn\'t materialize\n\n**Defenders\' Response:**\n\n• S2F is a long-term model; short-term deviations are expected\n• External shocks (Fed policy, FTX collapse) caused temporary dislocations\n• The model correctly identified the general direction over multiple cycles\n• No model is perfect; S2F provides a useful framework for thinking about scarcity\n\n**Best Practice:**\n\nUse S2F as **one input among many** — not as a precise price predictor. Combine with:\n• [Power Law model](/calculators/power-law) for time-based regression\n• [On-chain metrics](/calculators/on-chain) for demand-side signals\n• [Fear & Greed Index](/calculators/fear-greed-index) for sentiment context\n• Technical analysis for entry/exit timing\n\nThe S2F model\'s value lies in **conceptual understanding of scarcity** rather than exact price forecasts.',
      cta: {
        calculatorId: 'on-chain',
        calculatorName: 'On-Chain Metrics Dashboard',
        text: 'Track Bitcoin on-chain data and market indicators',
        path: '/calculators/on-chain'
      }
    }
  ],
  expertQuote: {
    quote: 'Stock-to-flow describes scarcity, and scarcity drives value. The model captured Bitcoin\'s halving-driven supply shock — but no model survives contact with every market.',
    author: 'PlanB',
    role: 'Pseudonymous quant & creator of S2F',
    source: 'https://medium.com/@100trillionUSD/modeling-bitcoins-value-with-scarcity-91fa0fc03e25',
    sourceLabel: 'medium.com/@100trillionUSD',
  },
};

export default article;

import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-dominance-explained',
  title: 'Bitcoin Dominance Explained: BTC.D & Altcoin Season',
  metaDescription: "BTC.D = Bitcoin's market cap ÷ total crypto market cap × 100. A fall below 60% has historically signaled altcoin season. Learn what it means and how to use it.",
  category: 'Market Analysis',
  publishedDate: '2026-03-09',
  updatedDate: '2026-03-09',
  readingTime: 8,
  keywords: ['bitcoin dominance', 'BTC.D', 'bitcoin dominance chart', 'what is bitcoin dominance', 'altcoin season indicator', 'bitcoin market cap dominance', 'crypto market share bitcoin'],
  relatedCalculators: ['dominance', 'fear-greed-index', 'on-chain', 'supply'],
  relatedArticles: ['bitcoin-on-chain-metrics-guide', 'what-is-fear-greed-index', 'bitcoin-vs-gold-sp500'],
  faqs: [
    {
      question: 'What is considered healthy Bitcoin dominance?',
      answer: 'Bitcoin dominance typically ranges from 40-70%. Above 70% suggests altcoins are deeply oversold and may be due for recovery. Below 40% has historically marked overheated altcoin seasons. Around 50-60% dominance is considered balanced, indicating healthy market participation across both Bitcoin and altcoins.'
    },
    {
      question: 'Does falling Bitcoin dominance mean altseason is starting?',
      answer: 'Not always. Bitcoin dominance can fall for two reasons: 1) Bitcoin price drops faster than altcoins (bear market), or 2) Altcoins rise faster than Bitcoin (altseason). True altseason occurs when total crypto market cap is growing AND Bitcoin dominance is falling — meaning money is flowing from Bitcoin into altcoins, not just leaving crypto entirely.'
    },
    {
      question: 'How do I track Bitcoin dominance in real time?',
      answer: 'You can monitor Bitcoin dominance through CoinMarketCap, CoinGecko, TradingView (BTC.D symbol), or dedicated crypto data platforms like Glassnode. Our Dominance Calculator also provides real-time BTC dominance data along with historical context and trend analysis.'
    },
    {
      question: 'Does Bitcoin dominance calculation include stablecoins?',
      answer: 'It depends on the data provider. Some platforms include stablecoins like USDT and USDC in total crypto market cap, which lowers Bitcoin dominance. Others exclude stablecoins to show just the "investable" crypto market. Always check the methodology — including stablecoins gives a more diluted dominance figure.'
    }
  ],
  howToSteps: [
    { name: 'Understand the basic calculation', text: 'Bitcoin dominance = (Bitcoin market cap ÷ Total crypto market cap) × 100. Track this percentage to see Bitcoin\'s relative strength versus all altcoins combined.' },
    { name: 'Identify dominance trends', text: 'Rising dominance suggests Bitcoin is outperforming altcoins. Falling dominance can signal altcoin strength or Bitcoin weakness — context matters.' },
    { name: 'Use dominance for market timing', text: 'Extreme dominance readings (>70% or <40%) often mark turning points. High dominance may precede altcoin rallies, while very low dominance can signal altcoin tops.' },
    { name: 'Combine with other indicators', text: 'Use dominance alongside Fear & Greed Index, on-chain metrics, and total crypto market cap for comprehensive market analysis. Never rely on dominance alone.' },
    { name: 'Track with our calculator', text: 'Use the Bitcoin Dominance Calculator to monitor real-time BTC.D, view historical charts, and set alerts for key dominance levels that might signal market shifts.' }
  ],
  sections: [
    {
      id: 'what-is-dominance',
      heading: 'What Is Bitcoin Dominance',
      content: 'Bitcoin dominance (often abbreviated as **BTC.D**) is a metric that measures Bitcoin\'s [market capitalization](https://en.wikipedia.org/wiki/Market_capitalization) relative to the **total cryptocurrency market cap**. It is expressed as a percentage and calculated as:\n\n**Bitcoin Dominance = (Bitcoin Market Cap ÷ Total Crypto Market Cap) × 100**\n\nFor example, if Bitcoin\'s market cap is $1.7 trillion and the total crypto market cap is $2.8 trillion, Bitcoin dominance would be approximately 60.7%. You can track this metric live on [CoinMarketCap](https://coinmarketcap.com/charts/#dominance-percentage) or [TradingView (BTC.D)](https://www.tradingview.com/chart/?symbol=BTC.D).\n\nBitcoin dominance serves as a **macro indicator** for crypto market sentiment and capital allocation. When dominance is rising, it suggests investors are favoring Bitcoin over altcoins — either due to risk-off sentiment or Bitcoin\'s superior performance. When dominance is falling, it may indicate either an "altcoin season" where smaller cryptocurrencies outperform, or a broader market decline where Bitcoin is holding up better than alternatives.\n\nHistorically, Bitcoin dominance has ranged from a low of around 33% (during the 2017-2018 altcoin bubble) to a high of over 72% (during the 2019 crypto winter). Understanding these cycles is crucial for [portfolio allocation](/learn/how-much-bitcoin-should-i-own) and market timing.',
      cta: {
        calculatorId: 'dominance',
        calculatorName: 'Dominance Calculator',
        text: 'Track Bitcoin dominance in real time',
        path: '/calculators/dominance'
      }
    },
    {
      id: 'how-calculated',
      heading: 'How Bitcoin Dominance Is Calculated',
      content: 'While the formula for Bitcoin dominance appears straightforward, the **methodology** behind market cap calculations affects the final number significantly:\n\n**Market Cap = Circulating Supply × Current Price**\n\nKey considerations:\n\n• **Circulating Supply**: For Bitcoin, this is straightforward — around 19.8 million BTC as of 2026. For altcoins, "circulating supply" can be subjective, as some tokens may be locked, staked, or held by foundations.\n\n• **Price Source**: Different platforms use different exchange prices and weighting methodologies. CoinMarketCap, CoinGecko, and TradingView may show slightly different dominance figures.\n\n• **Inclusion Criteria**: Some dominance calculations exclude **stablecoins** (USDT, USDC, BUSD) from the total market cap, arguing they are not "investment assets." Including stablecoins lowers Bitcoin dominance because it inflates the denominator.\n\n• **Dead/Inactive Coins**: Platforms may exclude cryptocurrencies with no trading volume or development activity, but the criteria vary.\n\nThe most commonly cited Bitcoin dominance figures come from **CoinMarketCap**, which includes stablecoins and uses a volume-weighted price methodology. For context, Bitcoin dominance excluding stablecoins is typically 5-10 percentage points higher than the headline figure.\n\nTrack multiple dominance metrics with our [On-Chain Metrics dashboard](/calculators/on-chain) to get a comprehensive view.'
    },
    {
      id: 'historical-trends',
      heading: 'Historical Dominance Trends',
      content: 'Bitcoin dominance has experienced several distinct phases since 2017, each reflecting different market cycles and investor psychology:\n\n| Period | Bitcoin Dominance | Market Context | Key Events |\n|--------|------------------|----------------|------------|\n| Early 2017 | 85-90% | Pre-altcoin boom | Limited altcoin options |\n| Late 2017 | 33-38% | Altcoin mania peak | ICO boom, "flippening" fears |\n| 2018-2019 | 50-72% | Crypto winter | Flight to quality, altcoin collapse |\n| 2020 | 60-70% | Institutional adoption | Corporate Bitcoin buying |\n| 2021 H1 | 40-45% | DeFi/NFT boom | Ethereum ecosystem explosion |\n| 2021 H2 | 40-48% | Altcoin season continues | Layer 1 competition, meme coins |\n| 2022 | 40-48% | Bear market resilience | Bitcoin holds value better |\n| 2023-2024 | 50-58% | Recovery phase | ETF anticipation, stability |\n| 2025-2026 | 55-62% | Institutional era | Post-ETF launch maturity |\n\nThe **2017-2018 cycle** established the classic pattern: Bitcoin leads the market higher, dominance falls as altcoins catch up, extreme speculation peaks (dominance below 40%), then a crash where Bitcoin proves most resilient and dominance recovers.\n\nThe **2020-2021 cycle** followed a similar pattern but with important differences — institutional adoption meant Bitcoin\'s dominance floor was higher (~40% vs 33% in 2018), and the rise of DeFi created genuine utility for some altcoins beyond pure speculation.\n\nThe **2024+ cycle** appears to be maturing further, with dominance remaining more stable in the 55-62% range as the market professionalizes through ETFs and institutional infrastructure.'
    },
    {
      id: 'dominance-altcoin-seasons',
      heading: 'Bitcoin Dominance and Altcoin Seasons',
      content: 'Bitcoin dominance is widely used as a **timing indicator** for what crypto traders call "altcoin seasons" — periods when alternative cryptocurrencies significantly outperform Bitcoin.\n\nHistorical altcoin season triggers:\n\n• **BTC.D falls below 50%**: Money is flowing from Bitcoin into alternatives\n• **Total crypto market cap rising**: Confirms new money entering, not just rotation\n• **Bitcoin price stable or rising**: Altcoins outperforming on relative basis\n• **[Fear & Greed Index](/calculators/fear-greed-index) > 70**: Risk-on sentiment favors smaller caps\n\nClassic altseason warning signs:\n\n• **BTC.D below 40%**: Historically unsustainable, suggests speculation peak\n• **New altcoins launching daily**: Market frothiness indicator\n• **"Bitcoin is dead" narratives**: Contrarian signal of over-rotation\n\nThe **altseason playbook** for Bitcoin holders:\n\n1. **BTC.D 60-70%**: Accumulate quality altcoins, Bitcoin still leading\n2. **BTC.D 50-60%**: Altcoin momentum building, maintain exposure\n3. **BTC.D 40-50%**: Peak altseason, consider profit-taking\n4. **BTC.D <40%**: High alert — history suggests this is unsustainable\n\nImportantly, not all dominance declines indicate altseason. If total crypto market cap is falling while Bitcoin dominance drops, it often means **Bitcoin is simply falling slower** than altcoins — a bearish scenario for the entire market.\n\nMonitor these dynamics with our [Dominance Calculator](/calculators/dominance) and cross-reference with [market sentiment indicators](/calculators/fear-greed-index).'
    },
    {
      id: 'portfolio-allocation',
      heading: 'Using Dominance for Portfolio Allocation',
      content: 'Savvy crypto investors use Bitcoin dominance as a **dynamic allocation tool** rather than a fixed strategy. Here are three common approaches:\n\n**The Dominance Rebalancing Strategy:**\n• When BTC.D > 65%: Increase altcoin allocation (they are oversold)\n• When BTC.D 45-65%: Maintain balanced Bitcoin/altcoin split\n• When BTC.D < 45%: Reduce altcoin exposure (they are overvalued)\n\n**The Bitcoin Maximalist Approach:**\n• Maintain 80%+ Bitcoin regardless of dominance\n• Use dominance spikes (>70%) to add small altcoin positions\n• Sell altcoins when dominance falls below 50%\n\n**The Opportunistic Approach:**\n• High dominance (>65%): 50% Bitcoin, 50% altcoins\n• Mid dominance (45-65%): 40% Bitcoin, 60% altcoins\n• Low dominance (<45%): 80% Bitcoin, 20% altcoins (contrarian)\n\nThe key insight: **Bitcoin dominance is mean-reverting**. Extended periods above 70% or below 40% historically resolve with sharp reversals. Positioning for these reversals — rather than chasing trends — has proven profitable.\n\nRisk management remains paramount. Even with favorable dominance readings, altcoins can lose 80-95% of their value in bear markets. Never allocate more to altcoins than you can afford to lose entirely.\n\nSee our [On-Chain Metrics guide](/learn/bitcoin-on-chain-metrics-guide) for additional timing indicators to combine with dominance analysis.'
    },
    {
      id: 'limitations-criticisms',
      heading: 'Limitations and Criticisms',
      content: 'While Bitcoin dominance is a useful tool, it has several limitations that investors should understand:\n\n**Market Cap Limitations:**\n• **Circulating supply assumptions**: Many altcoins have unclear or manipulated circulating supply figures, distorting market cap calculations\n• **Price manipulation**: Low-volume altcoins can have artificially inflated prices and market caps\n• **Stablecoin inclusion**: Including USDT, USDC, and other stablecoins in total market cap dilutes the dominance calculation\n\n**Structural Market Changes:**\n• **Institutional adoption**: ETFs and corporate treasuries have changed Bitcoin\'s volatility profile and dominance dynamics\n• **DeFi evolution**: Some altcoins now have genuine utility and cash flows, making them less speculative than in previous cycles\n• **Layer 2 solutions**: Bitcoin\'s Lightning Network and altcoin scaling solutions blur the lines between "Bitcoin" and "altcoins"\n\n**Lagging Indicator Issues:**\n• Dominance changes are **reactive** — they reflect what has already happened in markets\n• Sharp dominance moves often occur **after** the most profitable entry/exit points\n• Market structure changes can make historical dominance patterns less predictive\n\n**False Signals:**\n• Dominance can fall during bear markets simply because Bitcoin falls slower than altcoins\n• New coin launches (like meme coins) can temporarily distort dominance without meaningful capital flows\n• Cross-chain bridges and wrapped tokens can lead to double-counting in market cap calculations\n\nBest practice: Use Bitcoin dominance as one input in a broader analysis framework that includes [Fear & Greed sentiment](/calculators/fear-greed-index), [on-chain metrics](/calculators/on-chain), macroeconomic factors, and fundamental analysis of specific projects.\n\nTrack Bitcoin dominance with proper context using our [Dominance Calculator](/calculators/dominance).',
      cta: {
        calculatorId: 'dominance',
        calculatorName: 'Dominance Calculator',
        text: 'Monitor Bitcoin dominance trends and alerts',
        path: '/calculators/dominance'
      }
    }
  ]
};

export default article;
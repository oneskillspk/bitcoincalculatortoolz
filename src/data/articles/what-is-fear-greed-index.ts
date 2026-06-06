import { Article } from '../articles';

const article: Article = {
  slug: 'what-is-fear-greed-index',
  title: 'Bitcoin Fear and Greed Index: What It Is & How It Works',
  metaDescription: 'The Bitcoin Fear & Greed Index scores sentiment 0 (Extreme Fear) to 100 (Extreme Greed). Learn what drives the score and how traders use it to time entries.',
  category: 'Market Analysis',
  publishedDate: '2026-01-25',
  updatedDate: '2026-03-10',
  readingTime: 6,
  keywords: ['fear and greed index', 'bitcoin sentiment', 'crypto fear greed', 'market sentiment indicator'],
  relatedCalculators: ['fear-greed-index', 'what-if', 'dca'],
  relatedArticles: ['bitcoin-vs-gold-sp500', 'dca-vs-lump-sum-bitcoin', 'bitcoin-fear-greed-index-strategy'],
  faqs: [
    { question: 'What is a good Fear and Greed Index score?', answer: 'Scores below 25 indicate "Extreme Fear" (potentially good buying opportunities), while scores above 75 indicate "Extreme Greed" (potentially overheated market). Contrarian investors often buy during fear and take profits during greed.' },
    { question: 'How is the Fear and Greed Index calculated?', answer: 'It combines multiple data sources: price volatility (25%), market momentum/volume (25%), social media sentiment (15%), Bitcoin dominance (10%), and Google Trends (10%). Scores range from 0 (extreme fear) to 100 (extreme greed).' },
    { question: 'Should I buy Bitcoin when the index shows fear?', answer: 'Historically, buying during periods of extreme fear has produced above-average returns. However, the index should be one of many factors in your decision — not the sole reason to buy or sell.' },
  ],
  sections: [
    { id: 'overview', heading: 'Understanding Market Sentiment', content: 'The Bitcoin Fear and Greed Index is a daily metric that gauges the overall emotional state of the cryptocurrency market on a scale from 0 to 100. It was inspired by the [CNNMoney Fear & Greed Index](https://en.wikipedia.org/wiki/Greed_and_fear) used for traditional stock markets.\n\nThe premise is simple but powerful: **when investors are fearful, markets tend to be undervalued; when investors are greedy, markets tend to be overvalued.** Warren Buffett famously said, "Be fearful when others are greedy, and greedy when others are fearful." This index quantifies that principle for Bitcoin. For a broader look at market psychology, see [Investopedia\'s guide to market sentiment](https://www.investopedia.com/terms/m/marketsentiment.asp) and the [Alternative.me Fear & Greed Index](https://alternative.me/crypto/fear-and-greed-index/).' },
    { id: 'components', heading: 'How the Index Is Calculated', content: 'The Fear and Greed Index aggregates data from multiple sources:\n\n**Volatility (25%):** Compares current Bitcoin volatility and max drawdowns against 30-day and 90-day averages. Unusual volatility increases fear.\n\n**Market Momentum/Volume (25%):** Measures current trading volume relative to historical averages. High buying volume during price increases signals greed.\n\n**Social Media (15%):** Analyzes Twitter/X post volume, hashtag activity, and sentiment around Bitcoin-related discussions.\n\n**Bitcoin Dominance (10%):** Rising BTC dominance suggests fear (investors fleeing altcoins to safety). Falling dominance suggests greed (speculation in riskier altcoins).\n\n**Google Trends (10%):** Tracks search volume for Bitcoin-related queries. Spikes in searches like "Bitcoin crash" indicate fear, while "buy Bitcoin" spikes indicate greed.', cta: { calculatorId: 'fear-greed-index', calculatorName: 'Bitcoin Fear & Greed Index', text: 'Check today\'s Bitcoin Fear and Greed Index score live', path: '/calculators/fear-greed-index' } },
    { id: 'score-ranges', heading: 'Score Ranges Explained', content: '• **0-24: Extreme Fear** — Investors are very worried. Historically, this is often a buying opportunity.\n• **25-49: Fear** — Market sentiment is cautious. Prices may be below fair value.\n• **50: Neutral** — No strong emotional bias in either direction.\n• **51-74: Greed** — Investors are becoming optimistic. Market may be approaching fair value or getting expensive.\n• **75-100: Extreme Greed** — Market euphoria. Prices may be overextended, and corrections become more likely.\n\nThe index has historically spent the most time in the 30-70 range, with extremes (below 20 or above 80) being relatively rare and often marking significant market turning points.' },
    { id: 'using-the-index', heading: 'How to Use the Index in Your Strategy', content: 'The Fear and Greed Index is best used as a **contrarian indicator** and a tool for **emotional discipline** — not as a trading signal.\n\n**For [DCA](/learn/what-is-bitcoin-dca) investors:** Use extreme fear readings to add extra to your regular purchases ("buying the dip" with data backing).\n\n**For active traders:** Extreme greed readings can signal when to take partial profits or tighten stop-losses. But be aware of the [risks of leverage trading](/learn/bitcoin-leverage-trading-risks) during extreme sentiment.\n\n**For [HODLers](/learn/bitcoin-hodl-strategy-explained):** The index provides context for why prices are moving. Understanding sentiment helps you avoid panic selling during fear spikes.\n\n**Important caveat:** The index can stay in extreme territory for weeks or months. "Extreme greed" doesn\'t mean an immediate crash, and "extreme fear" doesn\'t mean an immediate rally.' },
  ],
  howToSteps: [
    { name: 'Visit the Fear & Greed tool', text: 'Open our Bitcoin Fear & Greed Index page for the latest score' },
    { name: 'Check the current score', text: 'See today\'s sentiment reading on the 0-100 scale' },
    { name: 'Review historical context', text: 'Compare today\'s reading to past scores and price action' },
    { name: 'Factor into your strategy', text: 'Use the sentiment data alongside your other analysis tools' },
  ],
  speakable: true,
};

export default article;

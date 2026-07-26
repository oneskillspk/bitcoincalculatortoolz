import { Article } from '../articles';

const article: Article = {
  slug: 'zakat-on-bitcoin-guide',
  title: 'Zakat on Bitcoin 2026: Nisab, Hawl & 2.5% Calculation',
  metaDescription: "Bitcoin is Maal (wealth) under leading Shariah rulings — Zakat is 2.5% of total value after Hawl. Most scholars use the Silver Nisab. Calculate yours free.",
  quickAnswer: 'Bitcoin is treated as zakatable wealth (maal) under most contemporary Shariah rulings. If your BTC holdings exceed the nisab (~85g gold or 595g silver) for one full lunar year (hawl), you owe 2.5% zakat on the market value on your zakat anniversary — calculated on the full stack, not just the profit.',
  category: 'Investing',
  publishedDate: '2026-03-13',
  updatedDate: '2026-03-13',
  readingTime: 10,
  keywords: ['bitcoin zakat', 'zakat on bitcoin', 'crypto zakat calculator', 'bitcoin zakat calculator PKR', 'zakat on gold calculator', 'islamic zakat calculator', 'zakat calculator', 'nisab bitcoin', 'bitcoin hawl calculator', 'zakat calculation on cryptocurrency'],
  relatedCalculators: ['bitcoin-zakat', 'bitcoin-converter', 'wealth-percentile', 'capital-gains-tax'],
  relatedArticles: ['how-much-bitcoin-should-i-own', 'bitcoin-tax-guide-capital-gains', 'what-is-a-satoshi'],
  howToSteps: [
    { name: 'Determine if Bitcoin is zakatable', text: 'Bitcoin is considered a monetary asset by most scholars and is subject to Zakat at 2.5% if held above Nisab for one Hawl.' },
    { name: 'Check the Nisab threshold', text: 'Use the Silver Nisab (612.36g silver, ~$1,671 USD in March 2026) or Gold Nisab (87.48g gold, ~$14,377 USD). Silver is recommended.' },
    { name: 'Calculate your total zakatable wealth', text: 'Add Bitcoin value + cash + gold + silver + stocks. Subtract debts due within 12 months.' },
    { name: 'Confirm your Hawl', text: 'Ensure your wealth has been above Nisab for one full lunar year (354 days).' },
    { name: 'Pay 2.5% of net zakatable wealth', text: 'Multiply your net wealth by 2.5%. You can pay in fiat or Bitcoin.' },
  ],
  faqs: [
    { question: 'Do I pay Zakat on Bitcoin?', answer: 'Yes, according to the majority of contemporary Islamic scholars. Bitcoin is treated as a monetary asset subject to Zakat at 2.5% of its value, provided your total wealth exceeds the Nisab for a full lunar year.' },
    { question: 'Is BTC haram in Islam?', answer: 'The majority of scholars consider Bitcoin permissible (halal) to hold and trade. Simply holding Bitcoin as a store of value is widely considered permissible.' },
    { question: 'What is the Nisab for Bitcoin Zakat?', answer: 'There is no separate Nisab for Bitcoin. Your Bitcoin value is added to all other zakatable assets and compared against the Silver Nisab (612.36g silver) or Gold Nisab (87.48g gold).' },
    { question: 'How is Hawl calculated for Bitcoin?', answer: 'Hawl is one full lunar year (354 days) from when your total zakatable wealth first exceeded the Nisab threshold. If your wealth drops below Nisab and rises again, the Hawl resets.' },
    { question: 'Can I pay Zakat in Bitcoin?', answer: 'Yes, many scholars permit paying Zakat in Bitcoin as long as the recipient can use or convert it. The amount should equal 2.5% of your zakatable wealth at market value on your Zakat date.' },
    { question: 'Is 1 lakh enough to pay Zakat in India?', answer: 'In 2026, the Silver Nisab in India is approximately ₹144,000–145,000 INR. If your total net zakatable wealth is only ₹1,00,000, you are below the Nisab and not obligated to pay Zakat.' },
    { question: 'What are common mistakes in calculating Zakat?', answer: 'Using Gold Nisab instead of Silver (huge difference), forgetting Bitcoin holdings, deducting full mortgage instead of 12-month instalment, and using outdated Nisab values.' },
  ],
  sections: [
    {
      id: 'is-bitcoin-halal',
      heading: 'Is Bitcoin Halal? What Scholars Say in 2026',
      content: `The majority of contemporary Islamic scholars consider Bitcoin permissible (halal) to hold and trade. Bitcoin is viewed as a digital monetary asset — a form of māl (wealth) that has value, can be owned, and can be exchanged.

Opinions range from fully permissible to conditionally permissible. The primary concerns raised by restrictive scholars include extreme price speculation, potential use in prohibited transactions, and lack of government backing. However, these same concerns apply to many traditional assets.

Key rulings supporting Bitcoin's permissibility:

- **Islamic Fiqh Academy** — treats digital currencies as assets subject to Islamic finance rules
- **Mufti Taqi Usmani's framework** — digital assets that have market value and utility can be treated as māl
- **AAOIFI standards** — ongoing review of cryptocurrency classification under Shariah

Purchasing Bitcoin as a long-term investment is **not** considered gambling (maysir). Gambling requires an element of zero-sum chance — investing in an asset with fundamental utility does not meet this definition.`
    },
    {
      id: 'four-conditions',
      heading: 'The Four Conditions for Zakat on Bitcoin',
      content: `For Zakat to be obligatory on your Bitcoin holdings, four conditions must be met simultaneously:

- **Full ownership (milkiyyah tāmmah):** You must own the Bitcoin outright — not borrowed, not pledged as collateral (unless you can freely access it), and not locked in a smart contract you cannot withdraw from.
- **Above Nisab threshold:** Your total zakatable wealth (Bitcoin + cash + gold + silver + stocks − debts) must exceed the Nisab. Most scholars recommend the Silver Nisab (612.36g silver ≈ $1,671 USD in March 2026) as it benefits more recipients.
- **Completion of Hawl:** Your wealth must have remained above the Nisab for one full lunar year (354 days). If it drops below Nisab at any point, the Hawl resets.
- **In excess of basic needs:** The wealth must be beyond what you need for essential living expenses. Your primary home, personal vehicle, and daily necessities are excluded.`
    },
    {
      id: 'silver-vs-gold-nisab',
      heading: 'Silver vs Gold Nisab — Which to Use in 2026?',
      content: `This is one of the most important decisions in Zakat calculation, and in 2026 it matters more than ever.

**Silver Nisab (612.36g):** approximately $1,671 USD (March 2026)
**Gold Nisab (87.48g):** approximately $14,377 USD (March 2026)

The difference is massive — nearly 9×. Silver prices have surged dramatically in 2025–2026 (from ~$31/oz to ~$85/oz), meaning the Silver Nisab in 2026 is much higher than in previous years. Despite this increase, Silver Nisab is still the recommended standard because:

- It has a lower threshold, meaning more people are eligible to pay Zakat
- This benefits more recipients and fulfills the spirit of Zakat as wealth purification
- The majority of scholars across all four madhabs recommend Silver Nisab for mixed assets

Use Gold Nisab only if your wealth consists entirely or primarily of gold.`,
      cta: { calculatorId: 'bitcoin-zakat', calculatorName: 'Bitcoin Zakat Calculator', text: 'Check your live Nisab threshold', path: '/calculators/bitcoin-zakat' }
    },
    {
      id: 'how-hawl-works',
      heading: 'How Hawl Works for Bitcoin',
      content: `Hawl is the Islamic lunar year — 354 days (not 365). It begins from the date your total zakatable wealth first exceeds the Nisab threshold.

**Key rules:**

- If your wealth drops below Nisab at any point during the year, the Hawl resets from the next date it exceeds Nisab again
- New Bitcoin purchases during the year are added to your existing wealth — they do not get their own separate Hawl
- Your Zakat is calculated on the total value on your Hawl anniversary date, not the average over the year
- Bitcoin's price volatility means your Nisab status can change frequently — check it on your actual Zakat date

**Practical tip:** Many Muslims choose to calculate and pay Zakat during Ramadan for the spiritual reward. If your Hawl anniversary falls outside Ramadan, you may pay in advance — paying early is permitted.`
    },
    {
      id: 'calculating-zakat',
      heading: 'Calculating Zakat in PKR, INR, USD, AED',
      content: `The formula is the same regardless of currency:

**Zakat = (Total Zakatable Assets − Debts Due Within 12 Months) × 2.5%**

Worked example in PKR:

- 0.5 BTC at ₨23,800,000/BTC = ₨11,900,000
- Cash savings: ₨500,000
- 50g 22K gold: ₨820,750
- Total: ₨13,220,750
- Debts: ₨0
- Silver Nisab: ₨466,415 — ✅ Exceeded
- Zakat = ₨13,220,750 × 2.5% = **₨330,519**

The same calculation in USD: $47,385 × 2.5% = **$1,184.63**

In INR: ₹40,99,309 × 2.5% = **₹1,02,483**`,
      cta: { calculatorId: 'bitcoin-zakat', calculatorName: 'Bitcoin Zakat Calculator', text: 'Calculate your exact Zakat now', path: '/calculators/bitcoin-zakat' }
    },
    {
      id: '1-lakh-question',
      heading: 'The 1 Lakh Question — India Zakat Calculation',
      content: `"1 lakh Zakat calculator" is one of the most searched Zakat terms in India. Here's the definitive answer:

At 2.5%: Zakat on ₹1,00,000 = **₹2,500**

However — and this is critical — in 2026 the Silver Nisab in India is approximately **₹144,000–145,000 INR**. This means:

- If your total net zakatable wealth is only ₹1,00,000, you are **below the Nisab** and not obligated to pay Zakat
- Zakat is only due if your combined wealth (Bitcoin + cash + gold + silver + stocks − debts) exceeds ₹144,606
- If you hold even 0.002 BTC (~₹14,700) plus ₹1,30,000 in savings, you would exceed the Nisab

Always check the live Nisab — silver prices have been volatile in 2026, so the threshold changes frequently.`
    },
    {
      id: 'crypto-beyond-bitcoin',
      heading: 'Zakat on Crypto Beyond Bitcoin (ETH, XRP)',
      content: `The same Zakat principles apply to all cryptocurrencies — not just Bitcoin. If you hold Ethereum, XRP, Solana, or any other digital asset with market value, it is zakatable.

**"Is XRP haram?"** — This is a common search query. Like Bitcoin, XRP's permissibility depends on how it's used. Holding XRP as an investment is generally considered permissible by scholars who permit cryptocurrency. The SEC lawsuit does not affect its Shariah classification.

For Zakat purposes, add the USD/PKR/INR value of all crypto holdings together with your other zakatable assets. There is no separate Nisab or rate for different cryptocurrencies — it's all 2.5% of total net zakatable wealth.`
    },
    {
      id: 'pay-zakat-in-bitcoin',
      heading: 'Can You Pay Zakat in Bitcoin?',
      content: `Yes — many contemporary scholars permit paying Zakat in Bitcoin, with conditions:

- The recipient must be able to use or convert the Bitcoin
- The Bitcoin amount must equal 2.5% of your zakatable wealth at market value on your Zakat date
- Some scholars prefer Zakat be paid in the local currency of the recipient for immediate usability

Practically, if your Zakat due is $1,185, you could send approximately 0.014 BTC (at $85,000/BTC) to a Zakat-eligible recipient or charity that accepts Bitcoin.

Organizations that accept Zakat in Bitcoin are growing — check with your local Islamic charity or mosque.`
    },
    {
      id: 'common-mistakes',
      heading: 'Common Mistakes (Gold Nisab vs Silver Nisab — 2026 Alert)',
      content: `The five most common mistakes in Zakat calculation:

- **Using Gold Nisab when Silver applies:** Gold Nisab is ~$14,377 vs Silver's ~$1,671 — a 9× difference. Many people incorrectly exclude themselves from Zakat by using the higher Gold threshold.
- **Forgetting Bitcoin and crypto:** Digital assets are zakatable just like cash. Many Muslims omit them simply because they're new.
- **Deducting full mortgage balance:** Only the 12-month instalment is deductible, not the total outstanding loan.
- **Ignoring Hawl:** Zakat is only due on wealth held above Nisab for 354 days. New purchases don't reset the clock — they're added to existing wealth.
- **Using outdated Nisab values:** Silver has surged 180% since early 2025. The 2026 Nisab is dramatically different from 2024/2025 values. Always use live prices.`,
      cta: { calculatorId: 'bitcoin-zakat', calculatorName: 'Bitcoin Zakat Calculator', text: 'Use live Nisab prices in the calculator', path: '/calculators/bitcoin-zakat' }
    },
    {
      id: 'retirement-401k-stocks',
      heading: 'Zakat on Retirement, 401k, Stocks, and ETFs',
      content: `**401k / IRA / Pension:** Opinions vary significantly. The most common positions:

- Accessible funds (can withdraw without penalty): Zakat is due at 2.5% of current value
- Employer-matched portion only: Some scholars say Zakat applies only to contributions you can access
- Tax-locked funds: Some scholars suggest paying Zakat as a lump sum when withdrawn at retirement

**Stocks and ETFs:** Generally zakatable. The simplified method: 40% of your stock portfolio value is considered zakatable (representing the liquid assets of the underlying companies). For detailed calculation, use the Zakatable Assets Per Share method.

**Bitcoin ETFs (IBIT, FBTC, ARKB):** These hold Bitcoin on your behalf — they are zakatable at the full market value, just like holding BTC directly. The 40% rule does NOT apply to Bitcoin ETFs because the underlying asset is 100% monetary.

**"Is Zakat tax-deductible?"** In the US, Zakat paid to a 501(c)(3) charity may qualify as a charitable deduction. In the UK, Gift Aid may apply. In Pakistan, Zakat deducted at source is exempt from income tax.`
    },
  ],
  expertQuote: {
    quote: 'Cryptocurrencies are considered as wealth (mal) and are subject to Zakah at 2.5% if they reach the Nisab and complete a full lunar year.',
    author: 'AAOIFI',
    role: 'Accounting and Auditing Organization for Islamic Financial Institutions',
    source: 'https://aaoifi.com/shariaa-standards/?lang=en',
    sourceLabel: 'AAOIFI Shariah Standard No. 35',
  },
  speakable: true,
};

export default article;

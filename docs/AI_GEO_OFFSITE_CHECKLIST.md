# AI / GEO Off-Site Action Checklist

These tasks live outside the codebase but the April 2026 audit pegs them at ~60% of the citation lift. Knock them down over the next 30 days.

## Week 1 — Foundational entity & index work

- [ ] **Bing Webmaster Tools** — verify ownership of `bitcoincalculator.tools`, submit `https://bitcoincalculator.tools/sitemap.xml`. ChatGPT search relies on Bing's index.
- [ ] **Google Search Console** — confirm sitemap is fresh; request indexing for `/llms.txt` and the homepage.
- [ ] **Wikidata Q-item** — create an entity for "Bitcoin Calculator Tools" with: official URL, founder (Web3Believer), inception date, instance of (website / web application), described at URL (`/about`). Add `sameAs` for X/Twitter. *(Audit: 4.8× citation lift.)*

## Week 2 — Community signal building

- [ ] **Reddit** — three genuinely useful posts spaced 4–7 days apart:
  - r/Bitcoin — "I built a free DCA backtester with no signup — here's what $100/mo since 2013 looks like"
  - r/personalfinance — answer a thread about Bitcoin allocation, link the Retirement calculator
  - r/CryptoCurrency — share the Accumulation Score tool
- [ ] **Quora** — answer 10 high-volume questions; link the most relevant calculator (1 link per answer, no spam).
  - "How much Bitcoin should I own?" → `/calculators/how-much-bitcoin`
  - "Is DCA better than lump sum for Bitcoin?" → `/calculators/lump-sum-vs-dca`
  - "How do I calculate Bitcoin capital gains tax?" → `/calculators/capital-gains-tax`
  - …(7 more from the article keyword list)

## Week 3 — Directory listings (tool-discovery sources for AI)

- [ ] **Product Hunt** — launch listing with screenshots of 3 marquee calculators.
- [ ] **AlternativeTo** — submit as a free alternative to CoinTracker / CoinStats calculator features.
- [ ] **CoinGecko Tools** directory — submit the homepage.
- [ ] **GitHub** — create a public repo `awesome-bitcoin-calculators` listing every tool with links and short descriptions. Star-bait + permanent backlink.
- [ ] **Awesome Bitcoin** lists — pull-request inclusion in the top community-maintained Awesome lists.

## Week 4 — PR & data study

- [ ] Pitch CoinDesk, Decrypt, and Bitcoin Magazine with a one-paragraph data study (e.g. "$100/mo into BTC since 2013 = $X" — pull the number from the DCA calculator). One pitch per outlet, with a link to the underlying tool.
- [ ] Reach out to 5 mid-tier Bitcoin newsletters (Pomp, Bitcoin Brief, etc.) offering the data study as an exclusive snippet.

## Ongoing

- [ ] Monthly: refresh `llms.txt` and `llms-full.txt` `lastUpdated` dates.
- [ ] Quarterly: re-run the audit's AI-visibility prompts in ChatGPT, Perplexity, Gemini, and Claude. Track which calculators get cited.
- [ ] When new calculators ship, add them to the off-site Reddit / GitHub / directory listings.

---

**Tracking spreadsheet template:** mirror this list in Notion / Trello with three columns: `Status`, `Date completed`, `Resulting backlink URL`. Backlinks from these sources are the input signal AI engines weigh most heavily for citation.
